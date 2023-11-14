const User = require('../models/users')

exports.postSignUp = async (req,res)=>{
    try{
        const newName = req.body.name;
        const newEmail = req.body.email;
        const newPass = req.body.password;

        //Existing User Validation
        const existingUser = await User.findAll({where:{email:newEmail}})
        if(existingUser.length ==0){
            const user = await User.create({
                name: newName,
                email: newEmail,
                password: newPass
            })
            res.status(201).json({Success:"User Created Successfully"})
        }
        else{
            console.log("User Already Exist")
            res.status(409).json({Error:"User Already Exist"})
        }

    }catch(err){
        res.status(400).json({Error:"Network Error"})
    }
    
}