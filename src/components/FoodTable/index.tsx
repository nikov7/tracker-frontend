import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";

import {useLocation} from "wouter";


interface Food {
    id: number,
    name: string
}

function FoodTable({data}: {data: Food[]})
{
    const [location, setLocation] = useLocation();


    return (
        <Card>
            <Box display="flex" justifyContent="space-between">
                <IconButton
                    aria-label="add"
                    size="medium"
                    sx={{flexGrow: 0}}
                    onClick={() => setLocation('/food/add')}
                >
                    <AddCircleIcon fontSize="inherit" />
                </IconButton>
                <IconButton aria-label="add" size="medium" sx={{flexGrow: 0}}>
                    <EditIcon fontSize="inherit" />
                </IconButton>
            </Box>
            <Divider />
            <TableContainer component={Paper} sx={{maxHeight: 800}}>
                <Table>
                    <TableBody>
                        {data.map((food: Food) => (
                            <TableRow
                                key={food.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer'
                                }}
                                onClick={() => setLocation(`/food/item/${food.id}`)}
                            >
                                <TableCell align="left">{food.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}

export default FoodTable;