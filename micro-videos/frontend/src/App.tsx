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
import {ReactKeycloakProvider} from '@react-keycloak/web';
import {keycloak, keycloakConfig} from "./util/auth";



const App: React.FC = () => {
    return (
        <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakConfig}>
        <MuiThemeProvider theme={theme}>
            <LoadingProvider>
                <SnackbarProvider>
                <CssBaseline/>
                <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
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
        </ReactKeycloakProvider>
        );
};

export default App
