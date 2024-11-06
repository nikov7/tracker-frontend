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
import React, {useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useLocation} from "wouter";
import Button from "@mui/material/Button";


interface ServingSize {
    id: number,
    name: string,
    foodItemId: number,
    amount: number
}

interface Food {
    id: number,
    name: string
    servingSizes: ServingSize[]
}

interface IntakeData {
    foodItemId: number,
    quantity: number,
    servingSizeId: number
}


function IntakeDialog({open, setOpen, dateString}: {open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, dateString: string})
{
    const [selectedRow, setSelectedRow] = useState<Food | null>(null);
    const [selectedServing, setSelectedServing] = useState<number | null>(null);

    const [location, setLocation] = useLocation();

    const queryClient = useQueryClient();

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['dialogFood'],
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

    const postMutation = useMutation({
        mutationFn: (foodIntake: IntakeData) => {

            return axiosInstance.post(`/api/DiaryEntry/${dateString}`, foodIntake, {
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

    function handleClick(row: Food) {
        console.log("Clicked a row! id: " + row.id+" name: " + row.name);
        console.log(`Serving size id: ${row.servingSizes[0].id}, foodItemId: ${row['servingSizes'][0].foodItemId}`);
        setSelectedRow(row);
        setSelectedServing(row.servingSizes[0].id);
    }

    function handleServingChange(event: SelectChangeEvent<number>) {
        console.log(`event value: ${event.target.value}`);
        setSelectedServing(+event.target.value);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const amount = formData.get("amount");

        if (selectedRow != null && amount) {

            postMutation.mutate({
                foodItemId: +selectedRow.id,
                quantity: +amount,
                servingSizeId: selectedServing != null ? +selectedServing:+selectedRow['servingSizes'][0].id // change later to an actual serving size
            });
        }

    }

    function handleClose() {
        console.log("Handle close dialog");
        setOpen(false);
        setSelectedRow(null);
        setSelectedServing(null);
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
        <>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <form method="post" onSubmit={(e) => handleSubmit(e)}>
                    <DialogTitle>
                        Add food entry
                    </DialogTitle>
                    <DialogContent>
                        <TableContainer component={Paper} sx={{maxHeight:200}}>
                            <Table size="small" aria-label="a dense table">
                                <TableBody>
                                    {data.map((row: Food) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            hover
                                            onClick={()=> handleClick(row)}
                                            selected={selectedRow === row}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {selectedRow != null &&
                            <Box display="flex" justifyContent="flex-end">
                                <TextField
                                    margin="dense"
                                    id="amount"
                                    name="amount"
                                    label="Amount"
                                    variant="standard"
                                    sx={{maxWidth:120}}
                                />
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel></InputLabel>
                                    <Select
                                        //defaultValue={selectedRow.servingSizes[0].id}
                                        value={selectedServing!}
                                        onChange={handleServingChange}
                                    >
                                        {selectedRow.servingSizes.map((s)=> (
                                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                        ))}
                                        {/*<MenuItem value={10}>g</MenuItem>*/}
                                        {/*<MenuItem value={20}>cup</MenuItem>*/}
                                    </Select>
                                </FormControl>
                            </Box>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
export default IntakeDialog;