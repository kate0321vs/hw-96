import {
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
import {cocktailsFetch, makePublicCocktail} from "../cocktailsThunk.ts";
import {toast} from "react-toastify";
import {selectPublicLoading} from "../cocktailsSlice.ts";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {NavLink} from "react-router-dom";

interface Props {
    name: string;
    image: string;
    isPublished: boolean;
    id: string;
}

const CocktailItem: React.FC<Props> = ({name, image, isPublished, id}) => {
    const activeUser = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const publicLoading = useAppSelector(selectPublicLoading)

    const onPublic = async () => {
        if (window.confirm(`Published cocktail ${name}?`)) {
            await dispatch(makePublicCocktail(id));
            await dispatch(cocktailsFetch(null));
            toast.success('Cocktail has been published successfully.');
        }
    };

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
                        <Grid component={NavLink} to={`/cocktails/${id}`}><ArrowForwardIosIcon sx={{color: 'black'}}/></Grid>
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

                {!isPublished && activeUser && activeUser.role === "admin" &&
                    <CardActions sx={{justifyContent: "flex-end"}}>
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
                    </CardActions>
                }
            </Card>
        </Grid>
    );
};

export default CocktailItem;