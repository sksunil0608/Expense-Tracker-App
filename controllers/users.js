const User = require('../models/users')

function isValidString(str){
 return (str==undefined || str.length==0)?true:false
 
}
exports.postSignUp = async (req,res)=>{
    try{
        const {name:newName,email:newEmail,password:newPass} = req.body;
        
        if(isValidString(newName) || isValidString(newEmail)||isValidString(newName)){
            return res.status(400).json({err:"Bad Parameters, Please fill details carefully"})
        }
        //Existing User Validation
        const existingUser = await User.findAll({where:{email:newEmail}})

        if(existingUser.length ==0){
            const user = await User.create({
                name: newName,
                email: newEmail,
                password: newPass
            })
            return res.status(201).json({Success:"User Created Successfully"})
        }
        else{
            console.log("User Already Exist")
            res.status(409).json({Error:"User Already Exist"})
        }

    }catch(err){
        res.status(400).json({Error:"Network Error"})
    }
    
}