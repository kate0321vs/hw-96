import {
    Button,
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CircularProgress,
    IconButton,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {baseURL} from "../../../globalConstants.ts";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectUser} from "../../Users/usersSlice.ts";
import {cocktailsFetch, deleteCocktail, makePublicCocktail} from "../cocktailsThunk.ts";
import {toast} from "react-toastify";
import {selectDeleteCocktailLoading, selectPublicLoading} from "../cocktailsSlice.ts";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {NavLink} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    name: string;
    image: string;
    isPublished: boolean;
    id: string;
}

const CocktailItem: React.FC<Props> = ({name, image, isPublished, id}) => {
    const activeUser = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const publicLoading = useAppSelector(selectPublicLoading);
    const deleteLoading = useAppSelector(selectDeleteCocktailLoading);

    const onPublic = async () => {
        if (window.confirm(`Published cocktail ${name}?`)) {
            await dispatch(makePublicCocktail(id));
            await dispatch(cocktailsFetch(null));
            toast.success('Cocktail has been published successfully.');
        }
    };

    const onDeleteItem = async () => {
        if (window.confirm("Are you sure you want to delete this cocktail?")) {
            await dispatch(deleteCocktail(id));
            await dispatch(cocktailsFetch(null));
            toast.error('Cocktail was deleted Successfully!');
        }
    }

    return (
        <Grid>
            <Card sx={{width: 410, mb: 3, boxShadow: 3, borderRadius: 3}}>
                <CardHeader sx={{height: 90}}
                            title={
                                <Grid container alignItems="center">
                                    <Grid flexGrow={1}>
                                        <Typography variant="h5" component="div">
                                            {name}
                                        </Typography>
                                    </Grid>
                                    <Grid component={NavLink} to={`/cocktails/${id}`}><ArrowForwardIosIcon
                                        sx={{color: 'black'}}/></Grid>
                                </Grid>
                            }
                            subheader={!isPublished && activeUser && activeUser.role === "user" && (
                                <Typography variant="body2" color="warning.main">
                                    Your cocktail is under moderator review
                                </Typography>
                            )
                            }/>
                <CardMedia
                    component="img"
                    height="200"
                    image={`${baseURL}/${image}`}
                    alt={name}
                    sx={{objectFit: "cover"}}
                />

                {activeUser && activeUser.role === "admin" &&
                    <CardActions sx={{justifyContent: "flex-end", height: 70}}>
                        {!isPublished &&
                            <>
                                <Typography variant="body2" color="warning.main">
                                    Unpublished
                                </Typography>
                                <IconButton title="Publish" onClick={onPublic}>
                                    {publicLoading === id ? (
                                        <CircularProgress size={22}/>
                                    ) : (
                                        <CheckCircleIcon color="warning"/>
                                    )}
                                </IconButton>
                            </>}
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={deleteLoading === id ? (
                                <CircularProgress size={22}/>
                            ) : (
                                <DeleteIcon/>
                            )}
                            onClick={() => onDeleteItem()}
                        >
                            Delete
                        </Button>
                    </CardActions>
                }
            </Card>
        </Grid>
    );
};

export default CocktailItem;