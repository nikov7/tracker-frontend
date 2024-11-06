import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import FoodIntakeManager from "../components/FoodIntakeManager";
import React, {useContext, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import LoadBackdrop from "../components/LoadBackdrop";
import DateNavigator from "../components/DateNavigator";
import Summary from "../components/FoodIntakeSummary";

import {getDateString} from "../util/date";
import {AuthContext, AuthContextType} from "../AuthContext";

function Diary() {

    //const [date, setDate] = useState<Date>(new Date());
    const {date, setDate} = useContext(AuthContext) as AuthContextType;


    // function getDateString(localDate: Date) {
    //     const year = localDate.getFullYear();
    //     const month = localDate.getMonth() + 1; // getMonth() returns 0-11
    //     const day = localDate.getDate();
    //
    //     return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    // }

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['diary', getDateString(date)],
        queryFn: async () => {
            try {

                console.log(`Fetching from ${getDateString(date)}`);

                const response = await axiosInstance.get(
                    `/api/DiaryEntry/${getDateString(date)}`);


                return response.data;
            } catch(error) {
                console.log("Not logged in");
                return [];
            }
        },
    });

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
                <DateNavigator date={date} setDate={setDate} />
            </Grid>
            <Grid xs={4}>
                <FoodIntakeManager data={data} dateString={getDateString(date)} />
            </Grid>
            <Grid xs={4}>
                <Summary data={data} />
            </Grid>

        </Grid>
    );
}

export default Diary;