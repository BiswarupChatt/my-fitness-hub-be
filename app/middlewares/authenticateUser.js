const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next)=>{
    const token = req.headers['authorization']
    if(!token){
        return res.status(400).json({errors : "Token is required"})
    }
    try{
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        if(!tokenData){
            res.status(400).json({errors: "Invalid Token"})
        }
        req.user = {
            id: tokenData.id,
            role: tokenData.role
        }
        next()
    }catch(err){
        res.status(500).json({ errors: 'Something went wrong in authenticate user' })
    }
}

module.exports = authenticateUser