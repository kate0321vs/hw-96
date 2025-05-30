import {NextFunction, Response, Request} from "express";
import User, {JWT_SECRET} from "../models/User";
import {HydratedDocument} from "mongoose";
import {IUser} from "../types";
import jwt from "jsonwebtoken";

export interface RequestWithUser extends Request {
    user: HydratedDocument<IUser>
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
    try {
        const req = expressReq as RequestWithUser;
        const jwtToken = req.get("Authorization")?.replace("Bearer ", "");
        if (!jwtToken) {
            res.status(400).send({error: "No token provided"});
            return;
        }

        const decoded = jwt.verify(jwtToken, JWT_SECRET) as {_id: string};

        const user = await User.findOne({ _id: decoded._id, token: jwtToken });

        if (!user) {
            res.status(400).send({error: "User not found or invalid token"});
            return;
        }
        req.user = user
        next();

    } catch (e) {
        res.status(401).send({error: "Please authenticate first"});
    }

}

export default auth;