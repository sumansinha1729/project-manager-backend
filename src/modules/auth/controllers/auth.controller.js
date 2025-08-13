const { validationResult } = require("express-validator");
const User = require("../../user/model/User");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../../utils/jwt");
const { json } = require("express");
const { decode } = require("jsonwebtoken");


const REFRESH_COOKIE='pm_refresh';

const setRefreshCookie=(res,token)=>{
    res.cookie(REFRESH_COOKIE,token,{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        path:'/api/auth/refresh',
        maxAge:7*24*60*60*1000,
    })
};


exports.register=async(req,res)=>{
    // validate
    const errors=validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});

    const {name,email,password}=req.body;
    const existing=User.findOne({email});
    if(existing) return res.status(409).json({
        message:"Email already in use"
    });

    const user=await User.create({name,email,password});

    const payload={sub:
        user._id.toString(),
        email:user.email,
        tokenVersion:user.tokenVersion
    };

    const accesSToken=signAccessToken(payload);

    const refreshToken=signRefreshToken(payload);

    setRefreshCookie(res,refreshToken);
    
    return res.status(201).json({
        user:user.toJSONSafe(),
        accesSToken
    })
};



exports.login=async(req,res)=>{
    // validate
    const errors=validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({
      errors:errors.array()
    });

    const {email,password}=req.body;
    const user=User.findOne({email}).select('+password');
    
    if(!user) return res.status(401).json({
        message:"Invalid credentials"
    });

    const ok=await user.comparePassword(password);
    if(!ok) return res.status(401).json({
        message:"Invalid credentials"
    });

    const payload={sub:
        user._id.toString(),
        email:user.email,
        tokenVersion:user.tokenVersion
    };

    const accesSToken=signAccessToken(payload);
    const refreshToken=signRefreshToken(payload);

    setRefreshCookie(res,refreshToken);

    return res.json({
        user:user.toJSONSafe(),
        accesSToken
    })
};



exports.refresh=async(req,res)=>{
   const token=req.cookies?.pm_refresh;
   if(!token) return res.status(401).json({
    message:"Missing refresh token"
   });

   try {
    const decoded=verifyRefreshToken(token);
    const user=await User.findById(decoded.sub);
    if(!user) return res.status.json({
        message:'User not found'
    });

    // refresh rotation protection
    if(decoded.tokenVersion !== user.tokenVersion) return res.status(401).json({
        message:"Refresh token invalidated"
    });

    const payload={sub:
        user._id.toString(),
        email:user.email,
        tokenVersion:user.tokenVersion
    };

    const newAccess=signAccessToken(payload);   
    const newRefresh=signRefreshToken(payload);
    const refreshToken=signRefreshToken(payload);    // rotate token
    setRefreshCookie(res,newRefresh);

    return res.json({accesSToken:newAccess});
   } catch (error) {
    return res.status.json({
        message:"Invalid or expired refresh token"
    })
   }
};



exports.logout=async(req,res)=>{
    // bump tokenversion to invalidate all refresh tokens
    const userId=req.user?.sub;  //requires protect on this route
    if(userId){
        await User.findByIdAndUpdate(userId,{
            $inc:{tokenVersion:1}
        })
    };

    return res.json({
        message:"Logged out"
    })
};



exports.me=async(req,res)=>{
    const userId=req.user.sub;
    const user=await User.findById(userId);
    return res.json({
        user:user.toJSONSafe()
    });
};

