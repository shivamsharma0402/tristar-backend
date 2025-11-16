const mongoose = require("mongoose");

const User = require("../models/UserData");

async function postSignIn(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Sign-in attempt:", email, password);

        // find user by email
        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // compare password
        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        return res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = postSignIn;
