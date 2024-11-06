import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {useMutation, useQuery} from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import {useQueryClient} from "@tanstack/react-query";
import LoadBackdrop from "../components/LoadBackdrop";
import React from "react";


function Profile()
{

    const updateMutation = useMutation({
        mutationFn: (profileData: {energy: number, carbs: number, fat:number, protein: number}) => {

            return axiosInstance.put(`/api/Profile/preferences`, profileData, {
                headers: { 'Content-Type': 'application/json' }
            });
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['preferences']})
                .then(()=> console.log("invalidated"))
                .catch((reason) => console.log(`Couldn't invalidate, reason: ${reason}`));
        },
        onSettled: () => {
            console.log("Settled");
        },
    });

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['preferences'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/api/Profile/preferences`);

                return response.data;
            } catch(error) {
                console.log("Not logged in");
                return [];
            }
        },
    });

    const queryClient = useQueryClient();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const energy = formData.get("energy");
        const carbs = formData.get("carbs");
        const fat = formData.get("fat");
        const protein = formData.get("protein");

        if (energy && carbs && fat && protein)
        {
            updateMutation.mutate({
                energy: +energy,
                carbs: +carbs,
                fat: +fat,
                protein: +protein
            });
        }
    }

    if (isPending) {
        console.log("isPending...");
        return <LoadBackdrop />
    }

    if (isError) {
        console.log("Error...");
        return <span>Error: {error.message}</span>
    }

    return (
        <Grid container spacing={{xs: 2, md: 3}} columns={{ xs:4, sm: 8, md: 12}}>
            <Grid xs={4}>
                <Card sx={{p:4}}>
                    <form method="post" onSubmit={handleSubmit}>
                        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                            <TextField
                                label="Energy target"
                                defaultValue={data.energy}
                                size="small"
                                name="energy"
                            />
                            <TextField
                                label="Protein"
                                defaultValue={data.protein}
                                size="small"
                                name="protein"
                            />
                            <TextField
                                label="Carbs"
                                defaultValue={data.carbs}
                                size="small"
                                name="carbs"
                            />
                            <TextField
                                label="Fat"
                                defaultValue={data.fat}
                                size="small"
                                name="fat"
                            />
                            <Button variant="outlined" type="submit">Save</Button>
                        </Stack>
                    </form>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Profile;