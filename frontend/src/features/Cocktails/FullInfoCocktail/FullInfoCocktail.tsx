import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectOneCocktail, selectOneCocktailLoading} from "../cocktailsSlice.ts";
import {useEffect} from "react";
import {oneCocktailFetch} from "../cocktailsThunk.ts";
import {Card, CardContent, CardMedia, CircularProgress, List, ListItem, ListItemText, Typography} from "@mui/material";
import {baseURL} from "../../../globalConstants.ts";

const FullInfoCocktail = () => {
    const {id} = useParams() as { id: string };
    const dispatch = useAppDispatch();
    const cocktail = useAppSelector(selectOneCocktail);
    const loading = useAppSelector(selectOneCocktailLoading);

    useEffect(() => {
        dispatch(oneCocktailFetch(id));
    }, [dispatch, id]);

    return (
        cocktail ?
            loading ? <CircularProgress/>
                : <Card sx={{display: 'flex', maxWidth: 1000, m: 'auto', mt: 4}}>
                    <CardMedia
                        component="img"
                        sx={{width: 250}}
                        image={baseURL + "/" + cocktail.image}
                        alt={cocktail.name}
                    />
                    <CardContent sx={{flex: 1}}>
                        <Typography variant="h5" component="div" gutterBottom>
                            {cocktail.name}
                        </Typography>

                        <Typography color={"warning"} variant="subtitle1" sx={{fontWeight: 'bold'}}>
                            Ingredients:
                        </Typography>
                        <List dense>
                            {cocktail.ingredients.map((ingredient, index) => (
                                <ListItem key={index} sx={{py: 0}}>
                                    <ListItemText primary={`• ${ingredient.name}: ${ingredient.quantity}`} />
                                </ListItem>
                            ))}
                        </List>

                        <Typography color={"warning"} variant="subtitle1" sx={{fontWeight: 'bold', mt: 2}}>
                            Recipe:
                        </Typography>
                        <Typography variant="body2">{cocktail.recipe}</Typography>
                    </CardContent>
                </Card> : <Typography>Cocktail not found</Typography>

    );
};

export default FullInfoCocktail;