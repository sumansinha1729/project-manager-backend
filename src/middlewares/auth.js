const { verifyAccessToken } = require("../utils/jwt");

module.exports=function auth(req,res,next){
    const header=req.headers.authorization || '';
    const token=header.startsWith('Bearer ') ? header.slice(7) : null;
    if(!token) return res.status(401).json({
        message:"Missing Authrization header"
    });

    try {
        const decoded=verifyAccessToken(token);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
};