import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectCocktails, selectCocktailsLoading} from "./cocktailsSlice.ts";
import {useEffect} from "react";
import {cocktailsFetch} from "./cocktailsThunk.ts";
import {CircularProgress, Typography} from "@mui/material";
import CocktailItem from "./components/CocktailItem.tsx";
import Grid from "@mui/material/Grid";
import {useSearchParams} from "react-router-dom";


const Cocktails = () => {
    const dispatch = useAppDispatch();
    const cocktails = useAppSelector(selectCocktails);
    const loading = useAppSelector(selectCocktailsLoading);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");

    useEffect(() => {
        if (!userId) {
            dispatch(cocktailsFetch(null));
        } else {
            dispatch(cocktailsFetch(userId));
        }

    }, [dispatch, userId]);

    return (
        <>
            {loading ? (
                <CircularProgress/>
            ) : cocktails.length > 0 ? (
                <>
                    {userId ?
                        <Typography variant="h4" my={4}>My cocktails</Typography>
                    :
                        <Typography variant="h4" my={4}>Cocktails</Typography>}

                    <Grid container spacing={2}>
                    {cocktails.map((cocktail) => {
                        return (
                            <CocktailItem
                                key={cocktail._id}
                                name={cocktail.name}
                                image={cocktail.image}
                                isPublished={cocktail.isPublished}
                                id={cocktail._id}
                            />
                        );
                    })}
                    </Grid>
                </>
            ) : (
                <Typography>No cocktails yet</Typography>
            )}
        </>
    );
};

export default Cocktails;