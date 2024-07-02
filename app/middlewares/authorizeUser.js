const authorizeUser = (permissions) =>{
    return(req, res, next)=>{
        if(permissions.includes(req.user.role)){
            next()
        } else{
            res.status(403).json({errors: "Unauthorized user"})
        }
    }
}

module.exports = authorizeUser