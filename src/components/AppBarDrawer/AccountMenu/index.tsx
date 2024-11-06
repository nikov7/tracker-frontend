
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import React, {useContext, useEffect, useState} from "react";
import axiosInstance from "../../../axiosInstance";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { Link } from 'wouter';
import { Fade } from '@mui/material';
import Stack from "@mui/material/Stack";
import {AuthContext, AuthContextType} from "../../../AuthContext";

interface Profile {
    id: number,
    name: string
}

function AccountMenu()
{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [profileIndex, setProfileIndex] = useState(0);

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['profiles'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    '/api/Profile');


                //console.log("req success");
                return response.data;
            } catch(error) {
                console.log("Not logged in");
                return [];
            }
        },
    });

    const {setDate} = useContext(AuthContext) as AuthContextType;



    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setProfileIndex(data.currentProfileIndex);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: () => {
            return axiosInstance.post(`/api/auth/logout`);
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['login']});
            setDate(new Date());
        },
    });

    const switchProfileMutation = useMutation({
        mutationFn: (profileData: {profileId: number}) => {
            return axiosInstance.post(`/api/auth/switch`, profileData,{
                headers: { 'Content-Type': 'application/json' }
            });
        },
        onSuccess: () => {
            // Invalidate profiles
            console.log("Success");
            queryClient.invalidateQueries({queryKey: ['profiles']});
            queryClient.invalidateQueries({queryKey: ['diary']});
            queryClient.invalidateQueries({queryKey: ['preferences']});

        },
        onError: (error) => {
            console.log(`Error: ${error}`);
        },
    });


    function handleExited() {
        console.log("Exited menu");
    }

    function handleLogout() {
        logoutMutation.mutate();
    }

    function handleSwitchProfile(id: number) {

        console.log("profile id: " + id);
        switchProfileMutation.mutate({profileId: id});
        setAnchorEl(null);
    }

    if (isPending) {
        return <></>
    }

    if (isError) {
        return <Typography variant="body2">Error</Typography>
    }

    // if (switchProfileMutation.isPending) {
    //     return <Typography variant="body2">SWITCHING</Typography>
    // }


    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Avatar sx={{ width: 32, height: 32 }}>{data.profiles[data.currentProfileIndex].name[0]}</Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        // '& .MuiAvatar-root': {
                        //     width: 32,
                        //     height: 32,
                        //     ml: -0.5,
                        //     mr: 1,
                        // },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx ={{
                        p:2
                    }}
                >
                    <Stack direction="column" alignItems="center">
                        <Avatar sx={{
                            width: 64,
                            height: 64,
                            fontSize: '2rem',
                        }}>{data.profiles[profileIndex].name[0]}</Avatar>
                        <Typography variant="h6" fontWeight="bold">{data.profiles[profileIndex].name}</Typography>
                    </Stack>
                    {/* Other details of the current profile */}
                </Box>
                <Divider sx={{mb:1}}/>
                {data.profiles.map((profile: Profile, index: number) => (
                    index !== profileIndex && (
                    <MenuItem key={profile.name} onClick={() => handleSwitchProfile(profile.id)}>
                        <Avatar sx={{
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        }}>{profile.name[0]}</Avatar> {profile.name}
                    </MenuItem>
                    )
                ))}
                <Divider />

                <Link href="/account">
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}
export default AccountMenu;