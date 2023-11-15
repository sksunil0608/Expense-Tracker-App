const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function isInValidString(str) {
    return (str == undefined || str.length == 0) ? true : false

}
exports.postSignUp = async (req, res) => {
    try {
        const { name: newName, email: newEmail, password: newPass } = req.body;

        if (isInValidString(newName) || isInValidString(newEmail) || isInValidString(newPass)) {
            return res.status(400).json({ err: "Bad Parameters, Please fill details carefully" })
        }
        //Existing User Validation
        const existingUser = await User.findAll({ where: { email: newEmail } })

        if (existingUser.length == 0) {

            const saltrounds = 10;
            bcrypt.hash(newPass, saltrounds, async (err, hash) => {
                if (!err) {
                    const user = await User.create({
                        name: newName,
                        email: newEmail,
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

function generateAccessToken(id,name) {
    return jwt.sign({ userId: id, name: name }, 'secretkey')
}


exports.postLogin = async (req, res) => {
    try {
        const { email: userEmail, password: userPass } = req.body;

        if (isInValidString(userEmail) || isInValidString(userPass)) {
            return res.status(400).json({ Error: "You have not filled all the details" })
        }

        // Authenticate User
        const existingUser = await User.findAll({ where: { email: userEmail } })
        if (existingUser.length == 0) {
            return res.status(204).json({ Error: "User Does Not Exist! Please Create a Account." })
        }
        else {
            bcrypt.compare(userPass, existingUser[0].password, (err, result) => {

                if (err) {
                    throw new Error("Error Login")
                }
                else {
                    if (result) {
                        return res.status(201).json({ success: "Successful Login", token: generateAccessToken(existingUser[0].id,existingUser[0].name) })
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