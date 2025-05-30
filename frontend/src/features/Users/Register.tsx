import React, { useState } from 'react';
import { RegisterMutation } from '../../types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {Avatar, Box, Button, CircularProgress, Container, Link, TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectRegisterError, selectRegisterLoading } from './usersSlice.ts';
import {googleLogin, register} from './usersThunk.ts';
import {toast} from "react-toastify";
import {GoogleLogin} from "@react-oauth/google";
import FileInput from "../../components/UI/FileInput/FileInput.tsx";

const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);

  const [state, setState] = useState<RegisterMutation>({
    email: '',
    password: '',
    avatar: null,
    displayName: '',
  });

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/');
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState(prevState => {
      return {...prevState, [name]: value};
    });
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(register(state)).unwrap();
      toast.success('User registered successfully');
      navigate('/');
    } catch (e) {
      // error happened
    }
  };

  const getFieldError = (name: string) => {
    try {
      return error?.errors[name].message;
    } catch {
      return undefined;
    }
  };

  const filesInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement> ) => {
    const { name, files } = e.target;
    if (files) {
      setState(prevState => {
        return {...prevState,
          [name]: files[0]};
      })
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
          <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={submitFormHandler} sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                    label="Email"
                    name="email"
                    autoComplete="new-email"
                    value={state.email}
                    onChange={inputChangeHandler}
                    error={!!getFieldError('username')}
                    helperText={getFieldError('username')}
                    fullWidth
                    required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={state.password}
                    onChange={inputChangeHandler}
                    error={!!getFieldError('password')}
                    helperText={getFieldError('password')}
                    fullWidth
                    required
                />
                {!!getFieldError('password') && <span>{getFieldError('password')}</span>}
              </Grid>
            </Grid>
            <Grid sx={{pt:2}}>
              <TextField
                  id="displayName"
                  label="Display Name"
                  value={state.displayName}
                  onChange={inputChangeHandler}
                  name="displayName"
                  fullWidth
                  required
              />
            </Grid>
            <Grid sx={{pt:2}}>
              <FileInput onChange={filesInputChangeHandler} name="avatar" label="Avatar" file={state.avatar}/>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                endIcon={loading && <CircularProgress size={24} />}
            >
              Sign Up
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
          <Link sx={{pt: 2}} component={RouterLink} to="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Box>
      </Container>
  );
}

export default Register;