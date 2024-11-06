import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import reportWebVitals from './reportWebVitals';

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import AppBarDrawer from "./components/AppBarDrawer";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Unstable_Grid2";
import { Route } from "wouter";
import Login from "./routes/Login";
import { Redirect, Switch } from "wouter";
import Typography from "@mui/material/Typography";
import Account from "./routes/Account";
import LoadBackdrop from "./components/LoadBackdrop";
import axiosInstance from "./axiosInstance";

import {AuthContext} from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./routes/Dashboard";
import Diary from "./routes/Diary";
import Food from "./routes/Food";
import FoodEdit from "./routes/FoodEdit";
import FoodAdd from "./routes/FoodAdd";
import Profile from "./routes/Profile";

// Create a client
const queryClient = new QueryClient();



// TODO: make sure to check login state, dont allow components to render when accessing routes manually
function App() {

    //const isLoggedIn = true;
    const drawerWidth = 240;

    const [date, setDate] = useState<Date>(new Date());

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['login'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get('/api/auth/verify');

                return true;
            } catch(error) {
                console.log("Not logged in");
                return false;
            }
        },
    });


    if (isPending) {
        console.log("isPending...");
        return <LoadBackdrop />
        //return <span>Loading...</span>
    }

    if (isError) {
        console.log("Error...");
        return <span>Error: {error.message}</span>
    }


    return (
        // Provide the client to your App
        <>
            <CssBaseline enableColorScheme />
            {/*{!data && <Redirect to="/login" />}*/}
            <Grid container spacing={{xs: 2, md: 3}} columns={{ xs:4, sm: 8, md: 12}}>
                <Grid xs={4} sm={8} md={12}>
                    <AppBarDrawer isLoggedIn={data}/>
                </Grid>
                <Grid
                    component="main"
                    xs={4} sm={8} md={12}
                    sx={{

                        ml: { sm: `${drawerWidth}px`, xs:0 },
                        pl: { sm: 4, xs: 2},
                        pr: { sm: 4, xs: 2},
                    }}
                >
                    <AuthContext.Provider value={{data, date, setDate}}>
                        <Switch>
                            <Route path="/login" >
                                {data ? <Redirect to="/" /> : <Login />}
                            </Route>
                            <ProtectedRoute path="/">
                                <Redirect to="/dashboard" />
                            </ProtectedRoute>
                            <ProtectedRoute path="/dashboard">
                                <Dashboard />
                            </ProtectedRoute>
                            <ProtectedRoute path="/diary">
                                <Diary />
                            </ProtectedRoute>
                            <ProtectedRoute path="/food">
                                <Food />
                            </ProtectedRoute>
                            <ProtectedRoute path="/account">
                                <Account />
                            </ProtectedRoute>
                            <ProtectedRoute path="/food/item/:id">
                                <FoodEdit />
                            </ProtectedRoute>
                            <ProtectedRoute path="/food/add">
                                <FoodAdd />
                            </ProtectedRoute>
                            <ProtectedRoute path="/profile">
                                <Profile />
                            </ProtectedRoute>
                            <Route>
                                <Redirect to="/dashboard" />
                            </Route>
                        </Switch>
                    </AuthContext.Provider>

                </Grid>
            </Grid>
        </>
    )
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>

  // </React.StrictMode>
);

