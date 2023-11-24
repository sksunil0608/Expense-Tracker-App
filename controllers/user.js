const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path=require('path')
const User = require('../models/user')


function isInValidString(str) {
    return (str == undefined || str.length == 0) ? true : false

}
const getLoginView = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'authentication', 'login.html'));
}
const getSignUpView = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'authentication', 'signup.html'));
}

const postSignUp = async (req, res) => {
    try {
        const { name: new_name, email: new_email, password: new_pass } = req.body;

        if (isInValidString(new_name) || isInValidString(new_email) || isInValidString(new_pass)) {
            return res.status(400).json({ err: "Bad Parameters, Please fill details carefully" })
        }
        //Existing User Validation
        const existing_user = await User.findAll({ where: { email: new_email } })

        if (existing_user.length == 0) {

            const salt_rounds = 10;
            bcrypt.hash(new_pass, salt_rounds, async (err, hash) => {
                if (!err) {
                    const user = await User.create({
                        name: new_name,
                        email: new_email,
                        password: hash
                    })
                    return res.status(201).json({ Success: "User Created Successfully" })
                }
                else {
                    console.log("Error")
                    throw new Error("Some Error Occured")
                }
            })
        }
        else {
            console.log("User Already Exist")
            res.status(409).json({ Error: "User Already Exist" })
        }

    } catch (err) {
        res.status(400).json({ Error: "Network Error" })
    }

}

const generateAccessToken = (id,name,is_premium) =>{
    const token_value = {
        userId: id,
        name: name,
        is_premium_user: is_premium,
    };
    return jwt.sign(token_value, 'secretkey')
}


const postLogin = async (req, res) => {
    try {
        const { email: user_email, password: user_pass } = req.body;
        if (isInValidString(user_email) || isInValidString(user_pass)) {
            return res.status(400).json({ Error: "You have not filled all the details" })
        }

        // Authenticate User
        const existing_user = await User.findAll({ where: { email: user_email } })
        if (existing_user.length == 0) {
            return res.status(204).json({ Error: "User Does Not Exist! Please Create a Account." })
        }
        else {
            bcrypt.compare(user_pass, existing_user[0].password, (err, result) => {

                if (err) {
                    throw new Error("Error Login")
                }
                else {
                    if (result) {
                        return res.status(201).json({ success: "Successful Login", token: generateAccessToken(existing_user[0].id,existing_user[0].name,existing_user[0].is_premium_user) })
                    }
                    else {
                        return res.status(401).json({ Error: "Authentication Error! Password Does Not Match." })
                    }
                }
            }
            )
        }
    }
    catch (err) {
        res.status(400).json({ Error: "Bad Parameters, Something Went Wrong." })
    }
}

const getLogout = async (req,res)=>{
    try{
        // const user =await User.findByPk(req.user.id);
        // user.is_premium_user = false;
        // await user.save();
        res.status(201).json({success:"Logged Out"})
    }catch(err){
        res.status(400).json({ Error: "Bad Parameters, Something Went Wrong." })
    }
}


module.exports = {
    postSignUp,
    generateAccessToken,
    postLogin,
    getLogout,
    getLoginView,
    getSignUpView
};