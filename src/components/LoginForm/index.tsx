import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import {useMutation} from "@tanstack/react-query";

import {CardActions} from "@mui/material";
import Typography from "@mui/material/Typography";
import axiosInstance from "../../axiosInstance";

import {useQueryClient} from "@tanstack/react-query";

interface LoginData {
    name: string
}

function LoginForm()
{

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (loginData:LoginData) => {

            return axiosInstance.post('/api/auth/login', loginData, {
                headers: { 'Content-Type': 'application/json' }
            });
        },
        onSuccess: () => {
            // Invalidate profiles
            queryClient.invalidateQueries({queryKey: ['login']});
        },
    });


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const username = formData.get("username") as string;

        mutation.mutate({
            name: username
        });


    }


    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >
                <form method="post" onSubmit={handleSubmit}>
                    <Card
                    >
                        <CardContent>
                            <Stack direction="column" spacing={2}>
                                <TextField
                                    label="Username"
                                    size="small"
                                    name="username"
                                />
                                <Button variant="contained" size="small" type="submit">
                                    LOGIN
                                </Button>
                            </Stack>
                        </CardContent>
                        <CardActions>
                            {mutation.isPending && <Typography variant="body1">Adding...</Typography>}
                            {mutation.isError && <Typography variant="body1">Error: {mutation.error.message}</Typography>}
                            {mutation.isSuccess && <Typography variant="body1">Successfully logged in!</Typography>}
                        </CardActions>
                    </Card>
                </form>
            </Box>
        </>
    );
}

export default LoginForm;