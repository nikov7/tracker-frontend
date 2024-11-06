import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, {useEffect} from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from '@mui/material/Box';
import {useQueryClient} from "@tanstack/react-query";

function DateNavigator({date, setDate}: {date: Date, setDate: React.Dispatch<React.SetStateAction<Date>>})
{

    const queryClient = useQueryClient();
    //queryClient.invalidateQueries({queryKey: ['login']});

    function compareDatesByDay(date1: Date, date2: Date) {
        const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return d1.getTime() === d2.getTime();
    }


    const handleBack = () => {
        let newDate = new Date(date.getTime());
        newDate.setDate(newDate.getDate() - 1);
        setDate(newDate);
        //queryClient.invalidateQueries({queryKey: ['diary']});
    }

    const handleForward = () => {
        let newDate = new Date(date.getTime());
        newDate.setDate(newDate.getDate() + 1);
        setDate(newDate);
        //queryClient.invalidateQueries({queryKey: ['diary']});
    }


    return (
        <>
            <Card>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <IconButton onClick={handleBack}>
                        <ArrowBackIosIcon/>
                    </IconButton>
                    <Typography variant="body1" style={{ textAlign: 'center', flexGrow: 1 }}>
                        {compareDatesByDay(new Date(), date) ?
                            'Today':
                            `${date.getDate()} ` + date.toLocaleDateString('default', {month:'short'})
                        }
                    </Typography>
                    <IconButton onClick={handleForward}>
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </Box>
            </Card>
        </>
    );
}

export default DateNavigator;