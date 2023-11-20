const jwt = require('jsonwebtoken')
const User = require('../models/users')
const authenticate = async (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        if (!token) {
            // Redirect to the login page if no token is provided
            return res.redirect('/login');
        }
        const newUser = jwt.verify(token,'secretkey')
        const user = await User.findByPk(newUser.userId);

        if (!user) {
            // Redirect to the login page if the user is not found
            res.redirect('/login');
        }

        // console.log(JSON.stringify(user))
        req.user = user;
        next();
    }
    catch(err){
        console.log(err)
        return res.status(401).json({Error:"Authentication Error"})
    }
} 

module.exports = {
    authenticate
}