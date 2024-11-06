import Typography from "@mui/material/Typography";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import LoadBackdrop from "../components/LoadBackdrop";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import {Paper, Table, TableContainer, TableCell, TableRow, TableHead, TableBody} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
//import {useParams} from "wouter";
import FoodTable from '../components/FoodTable';

interface Food {
    id: number,
    name: string
}

function Food() {

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['food'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/api/FoodItem`);

                return response.data;
            } catch(error) {
                console.log("Not logged in");
                return [];
            }
        },
    });

    //const params = useParams();


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
                <FoodTable data={data}/>
            </Grid>
        </Grid>

        // <ul>
        //     {data.map((food: Food) => (
        //         <li key={food.id}>{food.name}</li>
        //     ))}
        // </ul>
    );
}

export default Food;