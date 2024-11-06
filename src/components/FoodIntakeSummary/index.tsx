import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Stack from "@mui/material/Stack";


import {FoodIntake} from "../FoodIntakeManager";
import Grid from "@mui/material/Unstable_Grid2";
import MacroProgressBar from "./MacroProgressBar";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../../axiosInstance";
import LoadBackdrop from "../LoadBackdrop";

function Summary({data}: {data: FoodIntake[]}) {

    const { isPending, isError, data: preferences, error } = useQuery({
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

    function sumValue(field: string) {
        return data.reduce((pv, cv) => pv + (cv.availableServingSizes[cv.servingSizeIndex].amount*cv.quantity)*(cv[field]/100.0), 0)
    }

    function roundedSum(field: string) {
        return Math.round(sumValue(field)*10)/10.0;
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
        <Card
            sx={{
                minHeight:200,
                p:2
            }}
        >
            <Grid container spacing={{xs: 2, md: 3}} columns={{ xs:4, sm: 8, md: 12}}>
                <Grid xs={4}>
                    <Typography variant="h5">
                        Targets
                    </Typography>
                </Grid>
                <Grid xs={4}>
                    <Stack direction="column" spacing={2}>
                        <MacroProgressBar value={roundedSum('energy')} maxValue={preferences.energy} label='Energy' suffix='kcal'/>
                        <MacroProgressBar value={roundedSum('protein')} maxValue={preferences.protein} label='Protein' suffix='g'/>
                        <MacroProgressBar value={roundedSum('fat')} maxValue={preferences.fat} label='Fat' suffix='g'/>
                        <MacroProgressBar value={roundedSum('carbs')} maxValue={preferences.carbs} label='Carbs' suffix='g'/>
                    </Stack>
                </Grid>
            </Grid>

        </Card>
    );
}

export default Summary;