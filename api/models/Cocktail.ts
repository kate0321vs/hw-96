import mongoose, {model} from "mongoose";
import User from "./User";

const CocktailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: [{
            validator: async (value:  mongoose.Types.ObjectId) => {
                const user = await User.findById(value);
                return !!user;
            },
            message: "User not found",
        }],
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type:String,
        required: true,
    },
    recipe: {
        type: String,
        required: true,
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },
    ingredients: [{
        name: {type: String,
            required: true},
        quantity: {type: String,
            required: true,},
        }],
})

const Cocktail = model("Cocktail", CocktailSchema);
export default Cocktail;