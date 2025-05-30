import {HydratedDocument, Model, model, Schema} from "mongoose";
import {IUser} from "../types";
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken'

interface IUserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
};

export const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret';

type UserModel = Model<IUser, {}, IUserMethods>

const UserSchema = new Schema<IUser, UserModel ,IUserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (this: HydratedDocument<IUser>,email: string): Promise<boolean>  {
                if (!this.isModified('email')) return true;
                const user: HydratedDocument<IUser> | null = await User.findOne({ email });
                return !Boolean(user);
            },
            message: 'This user is already registered'
        }
    },
    password: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
    googleId: String,
    avatar: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
});

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
    next();
});

UserSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.password
        return ret;
    }
});

UserSchema.methods.checkPassword = async function(password) {
    return await argon2.verify(this.password, password);
};

UserSchema.methods.generateToken = function() {
    this.token = jwt.sign({_id: this._id}, JWT_SECRET, {expiresIn: '365d'});
}

const User = model<IUser, UserModel>("User", UserSchema);
export default User;