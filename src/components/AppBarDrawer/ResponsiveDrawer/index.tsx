import {Drawer} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from "@mui/material/Toolbar";
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {ListSubheader} from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Link} from "wouter";

function ResponsiveDrawer({drawerOpen, handleDrawerToggle, isLoggedIn}: {drawerOpen: boolean, handleDrawerToggle: () => void, isLoggedIn:boolean})
{
    const drawerWidth = 240;


    const drawer = (
        <>
            <Toolbar />
            <Divider />
            <List
                component="nav"
            >
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/dashboard" onClick={handleDrawerToggle}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/diary" onClick={handleDrawerToggle}>
                        <ListItemIcon>
                            <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary="Diary" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/food" onClick={handleDrawerToggle}>
                        <ListItemIcon>
                            <RestaurantIcon />
                        </ListItemIcon>
                        <ListItemText primary="Food" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List
                component="nav"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Profile
                    </ListSubheader>
                }
            >
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/profile" onClick={handleDrawerToggle}>
                        <ListItemIcon>
                            <AccountBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Preferences" />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

    return (
        <>
            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: {xs: 'block', sm:'none'},
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default ResponsiveDrawer;