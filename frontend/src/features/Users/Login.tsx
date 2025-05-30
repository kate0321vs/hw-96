import React, {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {LoginMutation} from '../../types';
import {Avatar, Box, Button, CircularProgress, Container, Link, TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {useAppDispatch, useAppSelector} from '../../app/hooks.ts';
import {selectLoginError, selectLoginLoading} from './usersSlice.ts';
import {googleLogin, login} from './usersThunk.ts';
import Alert from '@mui/material/Alert';
import {GoogleLogin} from "@react-oauth/google";


const Login = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectLoginError);
    const navigate = useNavigate();
    const loading = useAppSelector(selectLoginLoading)

    const googleLoginHandler = async (credential: string) => {
        await dispatch(googleLogin(credential)).unwrap();
        navigate('/');
    };

    const [state, setState] = useState<LoginMutation>({
        email: '',
        password: '',
    });

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setState(prevState => ({...prevState, [name]: value}));
    };

    const submitFormHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await dispatch(login(state)).unwrap();
            navigate('/');
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                style={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOpenIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                {error && (
                    <Alert
                        severity="error"
                        sx={{mt: 3, width: '100%'}}
                    >
                        {error.error}
                    </Alert>
                )}
                <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                autoComplete="current-email"
                                value={state.email}
                                onChange={inputChangeHandler}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={state.password}
                                onChange={inputChangeHandler}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        endIcon={loading && <CircularProgress size={24} />}
                    >
                        Sign In
                    </Button>
                </Box>
                <Box>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {

                                void googleLoginHandler(credentialResponse.credential);
                            }
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </Box>
                <Link sx={{pt: 2}} component={RouterLink} to="/register" variant="body2">
                    Or sign up
                </Link>
            </Box>
        </Container>
    );
};

export default Login;