const User = require('../models/users')

function isInValidString(str){
 return (str==undefined || str.length==0)?true:false
 
}
exports.postSignUp = async (req,res)=>{
    try{
        const {name:newName,email:newEmail,password:newPass} = req.body;
        
        if(isInValidString(newName) || isInValidString(newEmail)||isInValidString(newPass)){
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

exports.postLogin = async(req,res)=>{
    try{
        const { email: userEmail, password: userPass } = req.body;
        
        if (isInValidString(userEmail) || isInValidString(userPass)) {
            return res.status(400).json({ Error: "You have not filled all the details" })
        }

        // Authenticate User
        const existingUser = await User.findAll({where:{email:userEmail}})
        if(existingUser.length==0){
            return res.status(204).json({Error:"User Does Not Exist! Please Create a Account."})
        }
        else{
            if(existingUser[0].password === userPass){
                console.log("Successful Login")
                return res.status(201).json({success:"Successful Login"})
            }
            else{
                return res.status(401).json({ Error: "Authentication Error! Password Does Not Match."})
            }
        }
    }
    catch(err){
        // res.status(400).json({ Error: "Bad Parameters, Something Went Wrong." })
    }
}