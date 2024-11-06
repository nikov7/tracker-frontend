import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel,
    Paper, SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from "@mui/material";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "../../../axiosInstance";
import LoadBackdrop from "../../LoadBackdrop";
import React, {ChangeEvent, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useLocation} from "wouter";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import {FoodIntake} from "../index";



interface IntakeData {
    id: number,
    quantity: number,
    servingSizeId: number
}

interface ServingSize {
    id: number,
    name: string,
    foodItemId: number,
    amount: number
}

function SelectDialog({open, setOpen, foodIntake, dateString}: {open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, foodIntake: FoodIntake, dateString: string})
{
    const [selectedServing, setSelectedServing] = useState<number>(foodIntake.availableServingSizes[foodIntake.servingSizeIndex].id);
    const [quantity, setQuantity] = useState<number>(foodIntake.quantity);

    const queryClient = useQueryClient();

    useEffect(() => {
        setSelectedServing(foodIntake.availableServingSizes[foodIntake.servingSizeIndex].id);
        setQuantity(foodIntake.quantity);
    }, [foodIntake]);

    const updateMutation = useMutation({
        mutationFn: (intake: IntakeData) => {

            return axiosInstance.put(`/api/DiaryEntry/food/${intake.id}`, intake, {
                headers: { 'Content-Type': 'application/json' }
            });
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['diary', dateString]})
                .then(()=> handleClose())
                .catch((reason) => console.log(`Couldn't invalidate, reason: ${reason}`));
        },
        onSettled: () => {
            console.log("Settled");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (intake: {id: number}) => {
            return axiosInstance.delete('/api/DiaryEntry/food/'+intake.id);
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['diary', dateString]})
                .then(()=> handleClose())
                .catch((reason) => console.log(`Couldn't invalidate, reason: ${reason}`));
        },
    });

    function handleClose()
    {
        console.log("Handle close dialog");
        setOpen(false);
    }

    function handleDelete()
    {
        deleteMutation.mutate({
            id: foodIntake.id
        });
    }

    function handleServingChange(event: SelectChangeEvent<number>) {
        setSelectedServing(+event.target.value);
    }

    function handleQuantityChange(event: ChangeEvent<HTMLInputElement>)
    {
        setQuantity(+event.target.value);
    }

    function handleClick()
    {
        console.log(`ID: [${foodIntake.id}] NAME: ${foodIntake.name} [Final] quantity: ${quantity}, selectedServing: ${selectedServing}`);
        updateMutation.mutate({
            id: foodIntake.id,
            quantity: quantity,
            servingSizeId: selectedServing
        });
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Edit Entry
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={{xs: 2, md: 3}} columns={{ xs:4, sm: 8, md: 12}}>
                    <Grid xs={4}>
                        <TextField
                            margin="dense"
                            id="quantity"
                            name="quantity"
                            variant="standard"
                            value={quantity}
                            onChange={handleQuantityChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid xs={4}>
                        <Select
                            value={selectedServing}
                            onChange={handleServingChange}
                            fullWidth
                            >
                            {foodIntake.availableServingSizes.map((s)=> (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid xs={4}>
                        <Button variant="outlined" onClick={handleClick} fullWidth>Save</Button>
                    </Grid>
                    <Grid xs={4}>
                        <Button variant="outlined" color="error" onClick={handleDelete} fullWidth>Delete</Button>
                    </Grid>
                </Grid>
            </DialogContent>
            {/*<DialogActions>*/}
            {/*    */}

            {/*</DialogActions>*/}
        </Dialog>
    );
}

export default SelectDialog;