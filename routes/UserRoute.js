const express = require("express")
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const jwt = require('jsonwebtoken')
const cryptoJS = require("crypto-js");

router.post("/get-users", verifyTokenAndAdmin, async (req, res) => {

    try {

        const users = await User.find();
        res.status(200).json(users)
    } catch (err) {
        res.json(err)
    }

})
router.post("/", async (req, res) => {
    try {
        const { password, ...u } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(302).json("You already joined");
        }

        let isAdmin = false;
        // 2. Security Check: Only an existing admin can create another admin account
        if (req.body.isAdmin) {
            const authHeader = req.get("Authorization");
            const token = authHeader && authHeader.split(" ")[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_PASS);
                if (decoded && decoded.isAdmin) {
                    isAdmin = true;
                } else {
                    return res.status(403).json("You are not allowed to create an admin account");
                }
            } else {
                return res.status(401).json("Authentication required to create admin accounts");
            }
        }

        // 3. Encrypt password and ensure it is saved as a string
        const cryptoPass = cryptoJS.AES.encrypt(password, process.env.CRYPTO_JS_PASS).toString();

        // 4. Create and save new user Mongoose document
        const newUser = new User({ ...u, password: cryptoPass, isAdmin });
        const savedUser = await newUser.save();

        // 5. Generate token excluding the password from the response
        const { password: _p, ...userData } = savedUser._doc;
        const token = jwt.sign(userData, process.env.JWT_PASS);

        res.status(200).json(token);
    } catch (err) {
        console.error("User creation error:", err);
        res.status(500).json(err);
    }
})
router.post("/del", verifyToken, async (req, res) => {
    try {
        const user = await req.user
        if (user.isAdmin) {

            const body = await req.body;
            const deletedOne = await User.findByIdAndDelete(body.id)
            res.status(200).json(`${deletedOne.username} has been deleted`)
        } else res.status(409).json("How dare u !!")
    }
    catch (err) {
        res.json(err)
    }
})

module.exports = router;
