const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req, res) => {
    const { username, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashedPassword
        })
        req.session.user = newUser
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "incorrect username or password"
            })
        }
        const isCorrect = await bcrypt.compare(password, user.password)
        if (!isCorrect) {
            res.status(401).json({
                status: "incorrect username or password",
            })
            
        }
        req.session.user = user
        return res.status(200).json({
            status: "success",
        })
    } catch (e) {
        res.status(500).json({
            status: "fail"
        })
    }
}
