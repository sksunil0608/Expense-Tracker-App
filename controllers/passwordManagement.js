const uuid = require('uuid')
const bcrypt = require('bcrypt')
const path = require('path')

const ForgotPassword = require('../models/forgotPassword')
const User = require('../models/users')
const email = require('../helper/email')

const postForgotPassword = async (req, res) => {
    try {
        const user_email = req.body.email;
        const user = await User.findOne({ where: { email: user_email } })
        if (user) {
            const id = uuid.v4()
            await user.createForgotpassword({ id, active: true })

            const msg = {
                to: user_email,
                from: 'sksunil0608@gmail.com', // Change to your verified sender
                subject: 'Forgot Password',
                text: 'You requested a password reset. Please follow the link to reset your password.',
                html: `<p>You requested a password reset. Please follow the link to reset your password.</p>
                <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            };
            const result = await email.sendEmail(msg)
            if (result.status === 202) {
                return res.status(result.status).json({ message: 'Link to reset password sent to your mail ', sucess: true })
            }
        }
        else {
            throw new Error('User Does Not Exist')
        }

    }
    catch (err) {
        res.status(500).json({ Error: "Internal Server Error" })
    }

}

const getResetPassword = async (req, res) => {
    try {
        const uuid = req.params.uuid
        const forgetRequest = await ForgotPassword.findOne({ where: { id: uuid } })

        if (forgetRequest.active === false) {
            return res.status(403).json({ Error: "Reset Link Expired" })
        }

        if (forgetRequest) {
            forgetRequest.update({ active: false });
            return res.sendFile(path.join(__dirname,'..', 'views', 'reset-password.html'))
        }
    } catch (err) {
        res.status(500).json({ Error: "Internal Server Error" })
    }
}


const postUpdatePassword = async (req,res)=>{
    try{
        const new_passwrod = req.body.password
        const resetId = req.params.uuid

        const resetRequest = await ForgotPassword.findOne({where:{id:resetId}})
    
        const user = await User.findOne({where:{id:resetRequest.userId}})
        
        if(user){
            const saltrounds = 10;
            bcrypt.genSalt(saltrounds, async (err, salt) => {
                if (!err) {
                    bcrypt.hash(new_passwrod,salt,async(err,hash)=>{
                        if(!err){
                            await user.update({password:hash})
                            return res.status(201).json({ Success: "User Updated Successfully" })
                        }
                    })
                }
                else {
                    console.log("Error")
                    throw new Error("Some Error Occured")
                }
            })
        }
        else{
            return res.status(404).json({ error: 'No user Exists', success: false })
        }

    }catch(err){
        console.log(err)
        return res.status(403).json({ err, success: false })
    }
}

module.exports = {postForgotPassword,getResetPassword,postUpdatePassword}
