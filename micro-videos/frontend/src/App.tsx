import React from 'react';
import {Navbar} from "./components/Navbar";
import {Box, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {BrowserRouter} from 'react-router-dom';
import AppRouter from "./routes/AppRouter";
import Breadcrumbs from "./components/Breadcrumbs";
import theme from "./theme";
import SnackbarProvider from "./components/SnackbarProvider";
import LoadingProvider from "./components/loading/LoadingProvider";
import Spinner from "./components/Spinner";

const App: React.FC = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <LoadingProvider>
                <SnackbarProvider>
                <CssBaseline/>
                <BrowserRouter basename="/admin">
                    <Spinner/>
                    <Navbar/>
                    <Box paddingTop={'70px'}>
                        <Breadcrumbs/>
                        <AppRouter/>
                    </Box>
                </BrowserRouter>
             </SnackbarProvider>
            </LoadingProvider>
        </MuiThemeProvider>
        );
};

export default App
