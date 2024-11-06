import {useQuery} from "@tanstack/react-query";

import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import LoadBackdrop from "../components/LoadBackdrop";
import {CardActions} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import axiosInstance from "../axiosInstance";
import TextField from "@mui/material/TextField";
import {ClickAwayListener} from "@mui/material";

interface Profile {
    id: number,
    name: string
}

function Account() {

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['profiles'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/api/Profile`);

                console.log("req success")
                return response.data;
            } catch(error) {
                console.log("Not logged in");
                return [];
            }
        },
    });

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const [selectedProfileSettings, setSelectedProfileSettings] = useState<Profile | null>(null);
    const [selectedProfileName, setSelectedProfileName] = useState<Profile | null>(null);

    const [nameValue, setNameValue] = useState<string>("");
    const [initialNameValue, setInitialNameValue] = useState<string>(""); // maybe do this change on serverside?

    const queryClient = useQueryClient();





    const deleteMutation = useMutation({
        mutationFn: (profile: Profile) => {
            return axiosInstance.delete('/api/Profile/'+profile.id);
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['profiles']});
        },
    });

    const updateMutation = useMutation({
        mutationFn: (profileData:Profile) => {

            return axiosInstance.put(`/api/Profile/${profileData.id}`, profileData, {
                headers: { 'Content-Type': 'application/json' }
            });
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['profiles']});
        },
        onSettled: () => {
            console.log("Resetting profile selection");
            setSelectedProfileName(null);
        },
    });


    function handleNameClick(event: React.MouseEvent<HTMLSpanElement>, profile: Profile)
    {
        console.log(`[NAME TRIGGER] selected profile: ${profile.name}`);

        if (selectedProfileSettings !== null)
            handleMenuClose();

        setSelectedProfileName(profile);
        setNameValue(profile.name);
        setInitialNameValue(profile.name);

    }

    function handleNameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        console.log(`name: ${event.target.value}`);
        setNameValue(event.target.value);
    }

    function handleIconClick(event: React.MouseEvent<HTMLButtonElement>, profile: Profile)
    {
        console.log(`[MENU TRIGGER] selected profile: ${profile.name}`);

        if (selectedProfileName !== null)
            handleNameEnd();

        setAnchorEl(event.currentTarget);
        setSelectedProfileSettings(profile);
    }


    function handleMenuClose() {
        setAnchorEl(null);
        setSelectedProfileSettings(null);
    }

    function handleDelete(event: React.MouseEvent<HTMLLIElement>) {
        if (selectedProfileSettings != null) {
            console.log(`Deleting profile: ${selectedProfileSettings.id} - ${selectedProfileSettings.name} `);
            deleteMutation.mutate(selectedProfileSettings);
        } else {
            console.log('Profile is null!');
        }
        setAnchorEl(null);
    }

    function handleNameEnd() {

        console.log(`Final name: ${nameValue}`);

        if (initialNameValue !== nameValue && selectedProfileName !== null) {
            updateMutation.mutate({ id: selectedProfileName.id, name: nameValue })
        } else {
            setSelectedProfileName(null);
        }

        //setSelectedProfileName(null);
    }

    function getProfileContent(profile: Profile)
    {
        if (selectedProfileName && selectedProfileName.id === profile.id) {
            return (
                <ClickAwayListener onClickAway={handleNameEnd}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        variant="outlined"
                        // defaultValue={profile.name}
                        value={nameValue}
                        onChange={(event) => handleNameChange(event)}
                        onFocus={(event)=> event.target.select()}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                // Directly end editing without triggering blur
                                handleNameEnd();
                            }
                        }}
                    />
                </ClickAwayListener>
            );
        }

        return profile.name;
    }

    function getCardContent() {

        if (isPending) {
            console.log("Pending...");
            return (
                <LoadBackdrop />
            );
        }

        if (isError) {
            console.log("Error...");
            return (
                <Typography variant="h3">Error</Typography>
            );
        }

        return (
            <>
                {data.profiles.map((profile: Profile) => (
                    <Grid key={profile.name} xs={2}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" onClick={(event) => handleNameClick(event, profile)}>
                                    {getProfileContent(profile)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                                    <IconButton onClick={(event) => handleIconClick(event, profile)}>
                                        <MoreVertIcon/>
                                    </IconButton>
                                </Box>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={(event) => handleDelete(event)}>Delete</MenuItem>
                </Menu>
            </>
        );

    }

    return (
        <>
            <Grid container spacing={{xs: 2, md: 3}} columns={{ xs:4, sm: 8, md: 12}}>
                {getCardContent()}
            </Grid>
        </>
    );
}

export default Account;