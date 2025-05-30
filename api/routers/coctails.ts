import express from "express";
import Cocktail from "../models/Cocktail";
import {imagesUpload} from "../middleware/multer";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";
import User from "../models/User";

const cocktailsRouter = express.Router();

cocktailsRouter.get("/", async (req, res) => {
    try {
        const {userId} = req.query;
        let cocktails
        const jwtToken = req.get("Authorization")?.replace("Bearer ", "");
        if (!jwtToken) {
            cocktails = await Cocktail.find({isPublished: true}).populate({
                path: "user",
                select: "displayName avatar googleId"
            });
            res.send(cocktails);
            return;
        } else {
            const user = await User.findOne({token: jwtToken});
            if (!user) {
                res.status(404).send({error: "Could not find user"});
                return;
            }
            if (userId) {
                cocktails = await Cocktail.find({user: userId}).populate({
                    path: "user",
                    select: "displayName avatar googleId"
                });
            } else {
                if (user.role === "admin") {
                    cocktails = await Cocktail.find().populate({
                        path: "user",
                        select: "displayName avatar googleId"
                    });
                } else {
                    cocktails = await Cocktail.find({isPublished: true}).populate({
                        path: "user",
                        select: "displayName avatar googleId"
                    });
                }
            }
            res.send(cocktails)
        }

    } catch (e) {
        res.status(500).send(e);
    }
});

cocktailsRouter.get("/:id", async (req, res) => {
    try {
        const cocktail = await Cocktail.findOne({_id: req.params.id});
        if (!cocktail) {
            res.status(404).send({message: 'cocktail not found'});
        }
        res.send(cocktail);

    } catch (e) {
        res.status(500).send(e);
    }
});

cocktailsRouter.post("/", auth, imagesUpload.single('image'), async (req, res) => {
    try {
        const user = (req as RequestWithUser).user;
        const cocktail = new Cocktail({
            user: user._id,
            name: req.body.name,
            image: req.file ? 'images/' + req.file.filename : null,
            recipe: req.body.recipe,
            ingredients: {
                name: req.body.ingredients.name,
                quality: req.body.ingredients.quality
            }
        });
        await cocktail.save();
        res.send(cocktail)
    } catch (e) {
        res.status(500).send(e);
    }
});

cocktailsRouter.delete("/:id", auth, permit('admin'), async (req, res) => {
    try {
        const cocktail = await Cocktail.deleteOne({_id: req.params.id});
        if (!cocktail) {
            res.status(404).send({message: 'Cocktail not found'});
            return
        }
        res.send({message: 'Cocktail deleted successfully'});
        res.send({message: 'Cocktail deleted'});
    } catch (e) {
        res.status(500).send(e);
    }
});

cocktailsRouter.patch('/:id/togglePublished', auth, permit('admin'),async (req, res) => {
    const cocktail = await Cocktail.findOne({_id: req.params.id})
    if (!cocktail) {
        res.status(404).send({error: "Cocktail not found"});
        return;
    }
    cocktail.isPublished = !cocktail.isPublished;
    await cocktail.save();
    res.send({ message: "Cocktail publication status toggled"});
});

export default cocktailsRouter;