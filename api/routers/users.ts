import express from "express";
import mongoose from "mongoose";
import User from "../models/User";
import config from "../config";
import {OAuth2Client} from "google-auth-library";
import {imagesUpload} from "../middleware/multer";
const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

usersRouter.post("/google", async (req, res, next) => {
    try {
        if(!req.body.credential) {
            res.status(400).send({ error: "Google login error!" });
            return
        }

        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).send({ error: "Google login error!" });
            return;
        }

        const email = payload["email"];
        const id = payload["sub"];
        const displayName = payload["name"];
        const avatar = payload["picture"];

        if (!email) {
            res
                .status(400)
                .send({ error: "Not enough user data to continue" });
            return
        }

        let user = await User.findOne({ googleID: id });

        if (!user) {
            user = new User({
                email: email,
                password: crypto.randomUUID(),
                googleId: id,
                displayName,
                avatar
            });
        }

        user.generateToken();

        await user.save();
        res.send({ message: "Login with Google successful!", user });
        return
    } catch (e) {
        next(e);
    }
});

usersRouter.post("/", imagesUpload.single('avatar'), async (req, res, next) => {
    try {
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
            avatar: req.file ? 'images/' + req.file.filename : null,
            role: req.body.role,
        });
        newUser.generateToken();
        await newUser.save();
        res.send(newUser)
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            res.status(400).send(e)
            return;
        }
        next(e)
    }
});

usersRouter.post("/sessions", async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            res.status(400).send({error: "Wrong username or password [username]"});
            return;
        }
        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            res.status(400).send({error: "Wrong username or password [password]"});
        }

        user.generateToken();
        await user.save();
        res.send({message: "Username and password correct", user});

    } catch (e) {
        next(e);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.get('Authorization')?.replace("Bearer ", "");

        if (!token) {
            res.send({message: "Success logout"});
            return;
        }

        const user = await User.findOne({token});

        if (user) {
            user.generateToken();
            await user.save();
            res.send({message: "Success logout"});
        }
    } catch (e) {
        return next(e);
    }
});


export default usersRouter