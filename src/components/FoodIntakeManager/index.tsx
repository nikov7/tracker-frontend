import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Toolbar from "@mui/material/Toolbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../../axiosInstance";
import LoadBackdrop from "../LoadBackdrop";
import React, {useState} from "react";
import {sizing} from '@mui/system';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Box from "@mui/material/Box";
import IntakeDialog from "./IntakeDialog";
import SelectDialog from "./SelectDialog";

interface ServingSize {
    id: number,
    name: string,
    amount: number
}

export interface FoodIntake {
    [key: string]: any,
    id: number,
    name: string,
    foodItemId: number,
    energy: number,
    carbs: number,
    fat: number,
    protein: number,
    quantity: number,
    servingSizeIndex: number,
    availableServingSizes: ServingSize[]
}




function FoodIntakeManager({data, dateString}: {data: FoodIntake[], dateString: string})
{

    const [openIntake, setOpenIntake] = useState<boolean>(false);
    const [openSelect, setOpenSelect] = useState<boolean>(false);

    // const [selectedQuantityCell, setSelectedQuantityCell] = useState<FoodIntake | null>(null);
    // const [quantityValue, setQuantityValue] = useState<number | null>(null);

    const [selectedRow, setSelectedRow] = useState<FoodIntake | null>(null);

    function getCorrectCalories(row: FoodIntake) {

        //row.availableServingSizes[row.servingSizeIndex].id
        const servingSize = row.availableServingSizes[row.servingSizeIndex];
        const servingAmount = servingSize.amount;
        const finalGrams = row.quantity*servingAmount;
        const calculation = finalGrams*(row.energy/100.0);
        //const fixedNumber = +calculation.toFixed(2);

        return +calculation.toFixed(2);;
    }

    // function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     setQuantityValue(+e.target.value);
    // }
    //
    // function handleQuantityClick(event: React.MouseEvent<HTMLTableCellElement>, row: FoodIntake)
    // {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     setSelectedQuantityCell(row);
    //     setQuantityValue(row.quantity);
    // }
    //
    // function handleQuantityEnd() {
    //     setSelectedQuantityCell(null);
    //     setQuantityValue(null);
    // }
    //
    // function renderQuantityCell(row: FoodIntake)
    // {
    //     if (selectedQuantityCell != null && selectedQuantityCell.id === row.id)
    //     {
    //         return (
    //             <TextField
    //                 autoFocus
    //                 margin="none"
    //                 id="name"
    //                 name="name"
    //                 size="small"
    //                 variant="outlined"
    //                 value={quantityValue}
    //                 onBlur={handleQuantityEnd}
    //                 fullWidth
    //                 sx={{
    //                     p:0,
    //                     m:0
    //                 }}
    //                 onChange={(event) => handleQuantityChange(event)}
    //                 onFocus={(event)=> event.target.select()}
    //                 onKeyDown={(event) => {
    //                     if (event.key === 'Enter') {
    //                         // Directly end editing without triggering blur
    //                         handleQuantityEnd();
    //                     }
    //                 }}
    //             />
    //         );
    //     }
    //     return row.quantity;
    // }
    //
    // function renderServingSizeCell()
    // {
    //
    // }

    function handleRowClick(row: FoodIntake)
    {
        setSelectedRow(row);
        setOpenSelect(true);

        console.log(`selecting row: ${row.name}, id: ${row.id}`);
    }


    return (
        <>
            <IntakeDialog open={openIntake} setOpen={setOpenIntake} dateString={dateString} />
            {selectedRow != null && <SelectDialog open={openSelect} setOpen={setOpenSelect} foodIntake={selectedRow} dateString={dateString}/>}
            <Card
                sx={{
                    minHeight:200,
                    p:2
                }}
            >
                <Box
                    display="flex"
                    sx={{
                        mb:2
                    }}
                >
                    <Button
                        startIcon={<RestaurantIcon />}
                        variant="outlined"
                        onClick={()=> setOpenIntake(true)}
                    >
                        Add food
                    </Button>
                </Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius:2,
                        minHeight: data.length > 0 ? 0:200
                    }}
                >
                    <Table size="small" aria-label="a dense table">
                        <TableBody>
                            {data.map((row: FoodIntake) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    onClick={()=> {
                                        handleRowClick(row);
                                    }}
                                    // selected={row.id === selectedRow}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                    >
                                        {row.quantity}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        // onClick={(event)=> clickedType(event, row.id, row.availableServingSizes[row.servingSizeIndex].id)}
                                    >
                                        {row.availableServingSizes[row.servingSizeIndex].name}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                    >
                                        {getCorrectCalories(row)}&nbsp;kcal
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </>
    );
}

export default FoodIntakeManager;