import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from '@mui/icons-material/Menu';
import {Drawer} from "@mui/material";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {useState} from "react";

import AccountMenu from "../AccountMenu";

//function MainAppBar({drawerOpen, setDrawerOpen}: {drawerOpen: boolean, setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>})
function MainAppBar({handleDrawerToggle, isLoggedIn}: {handleDrawerToggle: () => void, isLoggedIn: boolean})
{

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {isLoggedIn && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CALORIE APP
                    </Typography>
                    {isLoggedIn && (
                        <AccountMenu />
                    )}
                </Toolbar>

            </AppBar>
            <Toolbar/>
        </>

    );
}

export default MainAppBar;