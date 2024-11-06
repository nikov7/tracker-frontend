import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import Stack from "@mui/material/Stack";


function MacroProgressBar({value, maxValue, label, suffix}: {value: number, maxValue: number, label: string, suffix: string})
{

    function getPercentage()
    {
        return Math.round((value*100.0)/maxValue);
    }



    return (
        <Grid container alignItems="flex-end">
            <Grid xs={3}>
                <Typography variant="body1" lineHeight={1}>{label}</Typography>
            </Grid>
            <Grid xs>
                <Stack direction="column">
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid>
                            <Typography variant="body2">{value} {suffix} / {maxValue} {suffix}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="body2">{getPercentage()}%</Typography>
                        </Grid>
                    </Grid>
                    <LinearProgress sx={{height:10, borderRadius:5}} color="primary" variant="determinate" value={getPercentage()}/>
                </Stack>
            </Grid>
        </Grid>
    );
}

export default MacroProgressBar;