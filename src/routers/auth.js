const express = require('express');
const { CustomError } = require('../helpers/error')
const User = require("../models/user")
const router = express.Router();


router.get('/allusers', async function (req, res, next) {
    let users = await User.find({}).catch(err => {
        next(new CustomError(500, "Unknown Internal Error"));
    });
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "all users removed"
    })
    next();
})



router.post('/register', async function (req, res, next) {
    const newUser = new User({
        nickname: req.body.nickname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
    const user = await User.findOne(
        {
            $or:
                [{ username: newUser.username },
                { email: newUser.email }]
        }).catch((err) => {
            next(new CustomError(500, "Unknown Internal Error"));
        })
    if (user) {
        next(new CustomError(400, "User With the same name exists"))
    }
    else {
        await newUser.save().catch((err) => {
            next(new CustomError(500, "Unknown Internal Error"));
        });
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "new user created",
            payload: {
                username: newUser.username,
                nickname: newUser.nickname,
                email: newUser.email
            }
        })
    }
    next();
})


router.get('/find/username/:username', async function (req, res, next) {
    const username = req.params;
    const user = await User.findOne({ email: email }).catch((err) => {
        next(new CustomError(500, "Unknown Internal Error"));
    });
    if (user) {
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: true
        })
    }
})

router.post("/updatepassword", async function (req, res, next) {
    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = await User.findOne({ email: email }).catch((err) => {
        next(new CustomError(500, "Unknown Internal Error"));
    });

    if (user) {
        const match = user.comparePassword(oldPassword).catch(err => {
            next(new CustomError(500, "Unknown Internal Error"));
        });
        if (match) {
            user.password = newPassword;
            const result = await user.save().catch(err => {
                next(new CustomError(500, "Unknown Internal Error"));
            });
            if (result) {
                res.status(200).json({
                    status: "success",
                    statusCode: 200,
                    message: "password updated"
                })
            }

        } else {
            next(new CustomError(400, "No user found"));
        }
        next();
    }
})



router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email }).catch(err => {
        next(new CustomError(500, "Unknown Internal Error"));
    });
    if (user) {
        const match = await user.comparePassword(password).catch(err => {
            next(new CustomError(500, "Unknown Internal Error"));
        });
        if (match) {
            res.status(200).json({
                status: "success",
                statusCode: 200,
                message: "loggin successful",
                payload: {
                    username: user.username,
                    nickname: user.nickname,
                    email: user.email,
                }
            })
        } else {
            next(new CustomError(400, "Password incorrect"));
        }
    } else {
        next(new CustomError(400, "User not found"));
    }
    next();

})

router.post('/deleteall', async (req, res, next) => {
    await User.deleteMany({}).catch((err) => {
        next(new CustomError(500, "Unknown Internal Error"))
    });
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "all users deleted"
    })
    next();
})


module.exports = router;