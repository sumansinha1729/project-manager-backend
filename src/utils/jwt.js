const jwt=require('jsonwebtoken');

const signAccessToken=(payload)=>{
    jwt.sign(payload,
        process.env.JWT_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_TTL || '15m'
    });
};


const signRefreshToken=(payload)=>{
    jwt.sign(payload,
        process.env.JWT_SECRET,
       { expiresIn:process.env.REFRESH_TOKEN_TTL || '7d'}
    )
};


const verifyAccessToken=(token)=>{
    jwt.verify(token,process.env.JWT_SECRET);
};


const verifyRefreshToken=(token)=>{
    jwt.verify(token,process.env.JWT_SECRET);
};


module.exports={
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};