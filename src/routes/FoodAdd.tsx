import Card from "@mui/material/Card";
import {useParams} from "wouter";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import LoadBackdrop from "../components/LoadBackdrop";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useLocation} from "wouter";
import {Redirect} from "wouter";
import Toolbar from "@mui/material/Toolbar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {alpha, Checkbox, ClickAwayListener} from "@mui/material";
import {cloneDeep} from 'lodash';
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Food {
    name: string,
    // Add other properties as needed
    energy: number, // Example additional property
    carbs: number,
    fat: number,
    protein: number,
    servingSizes: ServingSize[]
}

interface ServingSize {
    id?: number,
    name: string,
    amount: number
}

function FoodAdd() {

    const [location, setLocation] = useLocation();

    const [name, setName] = useState("");
    const [energy, setEnergy] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [protein, setProtein] = useState("");
    const [servingList, setServingList] = useState<ServingSize[]>([]);
    const queryClient = useQueryClient();

    // servingName editing
    const [selectedServingName, setSelectedServingName] = useState<number | null>(null);
    const [selectedServingAmount, setSelectedServingAmount] = useState<number | null>(null);


    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<readonly number[]>([]);




    const postMutation = useMutation({
        mutationFn: (foodData: Food) => {

            return axiosInstance.post(`/api/FoodItem`, foodData, {
                headers: { 'Content-Type': 'application/json' }
            });
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['food']})
                .then(()=> setLocation('/food'))
                .catch((reason) => console.log(`Couldn't invalidate, reason: ${reason}`));
        },
        onSettled: () => {
            console.log("Settled");
        },
    });

    function undoChanges()
    {
        setName("");
        setEnergy("");
        setCarbs("");
        setFat("");
        setProtein("");
        setServingList([]);
    }

    function onSubmit()
    {
        postMutation.mutate({
            name: name,
            energy: +energy,
            carbs: +carbs,
            fat: +fat,
            protein: +protein,
            servingSizes: servingList
        });
        // if (params.id !== undefined) {
        //     updateMutation.mutate({
        //         id: +params.id,
        //         name: name,
        //         energy: energy,
        //         carbs: carbs,
        //         fat: fat,
        //         protein: protein,
        //         servingSizes: servingList
        //     });
        // }
    }

    // when clicking one after the other fast, it fires the event twice and creates 2 servings
    function onAddServing(e: React.MouseEvent<HTMLButtonElement>)
    {
        e.preventDefault();
        e.stopPropagation();
        console.log("onAddServing");
        setServingList([
            ...servingList,
            {name: "Serving", amount: 1}
        ]);
    }

    function handleServingNameClick(index: number)
    {
        console.log(`[SERVING NAME TRIGGER] selected serving: ${servingList[index].name}`);
        setSelectedServingName(index);
    }

    function handleServingNameEnd() {
        setSelectedServingName(null);
    }

    function handleServingNameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        console.log(`name: ${event.target.value}`);

        if (selectedServingName != null) {
            const newList = [...servingList];

            newList[selectedServingName].name = event.target.value;

            setServingList(newList);
        }
    }

    function getServingNameContent(index: number)
    {
        if (selectedServingName != null && selectedServingName === index) {
            return (
                <ClickAwayListener onClickAway={handleServingNameEnd}>
                    <TextField
                        autoFocus
                        margin="none"
                        id="name"
                        name="name"
                        size="small"
                        variant="outlined"
                        // defaultValue={profile.name}
                        value={servingList[index].name}
                        onChange={(event) => handleServingNameChange(event)}
                        onFocus={(event)=> event.target.select()}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                // Directly end editing without triggering blur
                                handleServingNameEnd();
                            }
                        }}
                    />
                </ClickAwayListener>
            );
        }

        return servingList[index].name;
    }

    function handleServingAmountClick(index: number)
    {
        console.log(`[SERVING AMOUNT TRIGGER] selected serving: ${servingList[index].name}`);
        setSelectedServingAmount(index);
    }

    // TODO: clickaways maybe switch to blur, no need to register other clicks
    // TODO: instead of sending unnecessary array updates, only monitor actual changes (this only applies to the servingSize array)
    function handleServingAmountEnd() {
        setSelectedServingAmount(null);
    }

    function handleServingAmountChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        console.log(`name: ${event.target.value}`);

        if (selectedServingAmount != null) {
            const newList = [...servingList];

            newList[selectedServingAmount].amount = +event.target.value;

            setServingList(newList);
        }
    }

    function getServingAmountContent(index: number)
    {
        if (selectedServingAmount != null && selectedServingAmount === index) {
            return (
                <ClickAwayListener onClickAway={handleServingAmountEnd}>
                    <TextField
                        autoFocus
                        margin="none"
                        id="amount"
                        name="amount"
                        size="small"
                        variant="outlined"
                        sx={{maxWidth:64}}
                        // defaultValue={profile.name}
                        value={servingList[index].amount}
                        onChange={(event) => handleServingAmountChange(event)}
                        onFocus={(event)=> event.target.select()}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                // Directly end editing without triggering blur
                                handleServingAmountEnd();
                            }
                        }}
                    />
                </ClickAwayListener>
            );
        }

        return servingList[index].amount;
    }


    function handleRowClick(event : React.MouseEvent<HTMLTableRowElement>, index:number) {
        // [0,2,5]

        const selectedIndex = selectedRows.indexOf(index);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, index);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1),
            );
        }

        console.log(`Selected: ${JSON.stringify(newSelected)}`);

        setSelectedRows(newSelected);
    }

    function handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) {
            const newSelected = servingList.map((s, i) => i);
            console.log(`Selected: ${JSON.stringify(newSelected)}`);
            setSelectedRows(newSelected);
            return;
        }
        setSelectedRows([]);
    }

    function handleDeleteRows() {

        console.log("handle");
        const newServingList = servingList.map(s=> s);

        // Sort selectedRows in descending order
        const sortedSelectedRows = [...selectedRows].sort((a, b) => b - a);

        // Remove elements from newServingList
        sortedSelectedRows.forEach(index => {
            newServingList.splice(index, 1);
        });

        setSelectedRows([]);
        setServingList(newServingList);
    }



    const regularTable = (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2, xs: 1 },
                    pr: { xs: 1, sm: 1 },
                    justifyContent: 'space-between'
                }}
            >
                <IconButton
                    aria-label="add"
                    size="medium"
                    onClick={(e)=> onAddServing(e)}
                    sx={{flexGrow:0}}
                >
                    <AddCircleIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                    aria-label="add"
                    size="medium"
                    onClick={()=> {
                        setSelectedRows([]);
                        setIsEditing(true);
                    }}
                >
                    <EditIcon fontSize="inherit" />
                </IconButton>
            </Toolbar>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Serving</TableCell>
                        <TableCell align="right">Grams</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {servingList.map((row: ServingSize, index: number) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" onClick={(e) => handleServingNameClick(index)}>
                                {getServingNameContent(index)}
                            </TableCell>
                            <TableCell align="right" onClick={(e) => handleServingAmountClick(index)}>
                                {getServingAmountContent(index)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

    // add deletion option

    return (
        <Grid container spacing={{xs: 2, md: 3}} columns={{ xs:4, sm: 8, md: 12}}>
            <Grid xs={4}>
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={()=> setLocation('/food')}
                >
                    Back to Food
                </Button>
            </Grid>
            <Grid xs={4}>
                <Card sx={{padding:2}}>
                    <Grid container spacing={{xs: 2, md: 3}} columns={{ xs:4, sm: 8, md: 12}} alignItems="center">

                        <Grid xs={2}>
                            <Typography variant="body1">Food Name</Typography>
                        </Grid>
                        <Grid xs={2}>
                            <TextField
                                value={name}
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid xs={4}>
                            <Divider />
                        </Grid>
                        <Grid xs={4}>

                            <TableContainer component={Paper} sx={{maxHeight:300}}>

                                {!isEditing ?
                                    (regularTable)
                                    :
                                    (
                                        <>
                                            <Toolbar
                                                sx={{
                                                    pl: { sm: 2, xs:1 },
                                                    pr: { xs: 1, sm: 1 },
                                                    justifyContent: selectedRows.length > 0 ? 'space-between':'flex-end',
                                                    ...(selectedRows.length > 0 && {
                                                        bgcolor: (theme) =>
                                                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                                                    }),
                                                }}
                                            >
                                                {selectedRows.length > 0 && (
                                                    <Tooltip title="Delete">
                                                        <IconButton aria-label="add" size="medium" onClick={() => handleDeleteRows()}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                <Tooltip title="Cancel">
                                                    <IconButton aria-label="add" size="medium" onClick={()=> {
                                                        setSelectedRows([]);
                                                        setIsEditing(false);
                                                    }}>
                                                        <ClearIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Toolbar>
                                            <Table size="small" aria-label="a dense table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                color="primary"
                                                                indeterminate={selectedRows.length > 0 && selectedRows.length < servingList.length}
                                                                checked={servingList.length > 0 && selectedRows.length === servingList.length}
                                                                onChange={handleSelectAllClick}
                                                            />
                                                        </TableCell>
                                                        <TableCell padding="none">Serving</TableCell>
                                                        <TableCell align="right">Grams</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {servingList.map((row: ServingSize, index: number) => {

                                                        //const isItemSelected = isSelected(index);
                                                        const isItemSelected = selectedRows.indexOf(index) !== -1;

                                                        return (
                                                            <TableRow
                                                                key={index}
                                                                sx={{
                                                                    '&:last-child td, &:last-child th': {border: 0},
                                                                    cursor: 'pointer'
                                                                }}
                                                                role="checkbox"
                                                                onClick={(event: React.MouseEvent<HTMLTableRowElement>)=> handleRowClick(event, index)}
                                                                selected={isItemSelected}
                                                            >
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        color="primary"
                                                                        checked={isItemSelected}
                                                                    />
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" padding="none"
                                                                           onClick={(e) => handleServingNameClick(index)}>
                                                                    {row.name}
                                                                </TableCell>
                                                                <TableCell align="right"
                                                                           onClick={(e) => handleServingAmountClick(index)}>
                                                                    {row.amount}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </>
                                    )}
                            </TableContainer>
                        </Grid>
                        <Grid xs={4}>
                            <Divider />
                        </Grid>
                        <Grid xs={1}>
                            <Typography variant="body2">Energy</Typography>
                        </Grid>
                        <Grid xs={3}>
                            <TextField
                                value={energy}
                                name="energy"
                                onChange={(e) => setEnergy(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={1}>
                            <Typography variant="body2">Carbs</Typography>
                        </Grid>
                        <Grid xs={3}>
                            <TextField
                                value={carbs}
                                name="carbs"
                                onChange={(e) => setCarbs(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={1}>
                            <Typography variant="body2">Fat</Typography>
                        </Grid>
                        <Grid xs={3}>
                            <TextField
                                value={fat}
                                name="fat"
                                onChange={(e) => setFat(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={1}>
                            <Typography variant="body2">Protein</Typography>
                        </Grid>
                        <Grid xs={3}>
                            <TextField
                                value={protein}
                                name="protein"
                                onChange={(e) => setProtein(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={4}>
                            <Divider />
                        </Grid>
                        <Grid xs={4}>
                            <Box display="flex" justifyContent="space-between">
                                <Button variant="text" onClick={undoChanges}>Undo Changes</Button>
                                <Button variant="outlined" onClick={onSubmit}>Add</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

export default FoodAdd;