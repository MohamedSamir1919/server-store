const express = require("express")
const router = express.Router();
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const jose = require('jose')
const cryptoJS = require("crypto-js");
const { verifyTokenAndAdmin } = require("./verifyToken");
// undefined
// const dotenv = require('dotenv');
require('dotenv').config()

// dotenv.config();
router.post('/login', async (req, res) => {
    try {
        const body = await req.body;
        const user = await User.findOne({ email: body.email });

        if (user) {
            const userObj = user.toObject();
            const { password, ...userData } = userObj;

            const bytes = await cryptoJS.AES.decrypt(password, process.env.CRYPTO_JS_PASS);
            const originalPass = bytes.toString(cryptoJS.enc.Utf8);

            if (body.password == originalPass) {
                const token = jwt.sign(userData, process.env.JWT_PASS);
                return res.status(200).json(token);
            }
            else {
                return res.status(401).json("Wrong password");
            }
        }
        else {
            return res.status(403).json("You have to signup");
        }
    }
    catch (err) {
        console.error("Login Error:", err);
        return res.status(400).json({ message: err.message || "Internal Server Error" });
    }
})
router.post('/activate', verifyTokenAndAdmin, async (req, res) => {
    const { email, activateCode } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        user.activate = true;
        await user.save();
        return res.status(200).json("Account activated successfully");
    } else {
        return res.status(404).json("User not found");
    }

})
router.post('/', async (req, res) => {
    try {
        const body = await req.body;
        const { password, ...userData } = body;
        const user = await User.findOne({ email: body.email });
        if (user) {
            return res.status(302).json("You already joined");
        }
        else {
            const cryptoPass = cryptoJS.AES.encrypt(password, process.env.CRYPTO_JS_PASS).toString();
            const newUser = Object.assign(body, { password: cryptoPass })
            await User.create(newUser);
            const token = jwt.sign(userData, process.env.JWT_PASS);
            return res.status(200).json(token);
        }
    } catch (err) {
        return res.status(400).json({ message: err.message || err });
    }
})

module.exports = router;




