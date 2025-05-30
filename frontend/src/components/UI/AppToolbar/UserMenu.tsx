import React, { useState } from 'react';
import {Avatar, IconButton, Menu, MenuItem, Typography} from '@mui/material';
import { IUser } from '../../../types';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {logout} from "../../../features/Users/usersThunk.ts";
import {useAppDispatch} from "../../../app/hooks.ts";
import {unsetUser} from "../../../features/Users/usersSlice.ts";
import {toast} from "react-toastify";
import {baseURL} from "../../../globalConstants.ts";
import {NavLink, useNavigate} from "react-router-dom";

interface Props {
  user: IUser;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    const handleLogout = async () => {
        await dispatch(logout());
        dispatch(unsetUser());
        handleClose();
        navigate("/");
        toast.success("Logout successfully.");
    }

  return (
    <>
        <Typography marginRight={2}>Hello, {user.displayName}!</Typography>
        <IconButton onClick={handleClick}>
            {user.avatar ?
                <Avatar src={user.googleId ? user.avatar : `${baseURL}/${user.avatar}`} alt={`${user.displayName} picture`} /> :
                <AccountCircleIcon fontSize='large' style={{color: 'white', fontSize: '2rem'}} />}
        </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          {user.role === "user" && <MenuItem component={NavLink} to={`/cocktails?userId=${user._id}`}>My cocktails</MenuItem>}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;