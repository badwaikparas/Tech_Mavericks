const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../../db")

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})

router.get("/", (req, res) => {
    res.send("User route");
})

router.get("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)

    if (!success) {
        console.log(signupBody.safeParse(req.body).error);

        return res.status(411).json({
            message: "Invalid Input"
        })
    }

    //* Check for existing user 
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }


    //* Create user 
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    res.json({
        message: "User created successfully",
    })
})

router.get("/login", (req, res) => {
    res.send("User Login route");
})

module.exports = router;



