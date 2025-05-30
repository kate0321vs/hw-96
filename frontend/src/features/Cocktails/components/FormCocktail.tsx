import {Button, IconButton, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from '@mui/icons-material/Delete';
import React, {useState} from "react";
import {ICocktailMutation} from "../../../types";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import {useAppDispatch} from "../../../app/hooks.ts";
import {createCocktail} from "../cocktailsThunk.ts";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

const initialState = {
    name: "",
    image: null as unknown as File,
    recipe: "",
    ingredients: [{name: "", quantity: ""}],
}

const FormCocktail = () => {
    const [state, setState] = useState<ICocktailMutation>(initialState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const submitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasEmptyIngredient = state.ingredients.some(
            (ing) => !ing.name.trim() || !ing.quantity.trim()
        );
        if (hasEmptyIngredient) {
            toast.error("All ingredients must have a name and quantity.");
            return;
        }

        const filteredIngredients = state.ingredients.filter(
            (ing) => ing.name.trim() && ing.quantity.trim()
        );

        if (filteredIngredients.length === 0) {
            toast.error("At least one valid ingredient is required.");
            return;
        }

        if (!state.image) {
            toast.error("Image is required.");
            return;
        }
        const dataToSend: ICocktailMutation = {
            ...state,
            ingredients: filteredIngredients,
        };

        await dispatch(createCocktail(dataToSend));
        toast.success('Item was added Successfully!');
        navigate('/')
        setState(initialState);
    }

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState(prevState => {
            return {...prevState, [name]: value};
        });
    };

    const addIngredient = () => {
        setState(prevState => ({
            ...prevState,
            ingredients: [...prevState.ingredients, { name: '', quantity: '' }],
        }));
    };

    const removeIngredient = (index: number) => {
        const ingredients = state.ingredients.filter((_, i) => i !== index);
        setState({ ...state, ingredients });
    };

    const ingredientChangeHandler = (index: number, field: 'name' | 'quantity', value: string) => {
        setState(prevState => {
            const ingredients = [...prevState.ingredients];
            ingredients[index] = {
                ...ingredients[index],
                [field]: value,
            };
            return { ...prevState, ingredients };
        });
    };

    const filesInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement> ) => {
        const {name, files} = e.target;
        if (files) {
            setState(prevState => {
                return {
                    ...prevState,
                    [name]: files[0]
                };
            })
        }
    }

    return (
        <form autoComplete="off" onSubmit={submitFormHandler}>
            <Grid mb={5} container direction="column" spacing={2}>
                <Grid>
                    <Typography variant="h5">Add new cocktail</Typography>
                </Grid>


                <Grid>
                    <TextField
                        id="name"
                        label="Name"
                        name="name"
                        value={state.name}
                        onChange={inputChangeHandler}
                        fullWidth
                        required
                    />
                </Grid>

                <Grid>
                    <Typography variant="subtitle1">Ingredients</Typography>
                    {state.ingredients.map((ingredient, index) => (
                        <Grid container spacing={1} alignItems="center" key={index} sx={{mt: 1}}>
                            <Grid>
                                <TextField
                                    label="Ingredient name"
                                    value={ingredient.name}
                                    onChange={(e) => ingredientChangeHandler(index, 'name', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid>
                                <TextField
                                    label="Quantity"
                                    value={ingredient.quantity}
                                    onChange={(e) => ingredientChangeHandler(index, 'quantity', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid>
                                {index > 0 && (
                                    <IconButton onClick={() => removeIngredient(index)} aria-label="delete">
                                        <DeleteIcon/>
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    ))}
                    <Button onClick={addIngredient} variant="outlined" sx={{mt: 1}}>
                        Add ingredient
                    </Button>
                </Grid>

                <Grid>
                    <TextField
                        label="Recipe"
                        name="recipe"
                        value={state.recipe}
                        onChange={inputChangeHandler}
                        fullWidth
                        multiline
                        rows={4}
                        required
                    />
                </Grid>

                <Grid>
                    <FileInput onChange={filesInputChangeHandler} name="image" label="Image" file={state.image} />
                </Grid>

                <Grid>
                    <Button variant="contained" type="submit">
                        Create cocktail
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default FormCocktail;
