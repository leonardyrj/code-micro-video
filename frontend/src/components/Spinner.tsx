import React, {useContext} from 'react';
import {Fade, LinearProgress, MuiThemeProvider} from "@material-ui/core";
import LoadingContext from "./loading/LoadingContext";
import {Theme} from "@material-ui/core/styles";



/** Forma de pegar o theme e modificar apenas um elemento
 * poderia também criar outro com createMuiTheme
*/

function makeLocalTheme(theme: Theme) : Theme{
    return{
        ...theme,
        palette:{
            ...theme.palette,
            primary: theme.palette.error,
            type: 'dark'
        }
    }
}

const Spinner = () => {
    const loading = useContext(LoadingContext);
    return (
        <MuiThemeProvider theme={makeLocalTheme}>
            <Fade in={loading}>
                <LinearProgress
                color={'primary'}
                style={{
                    position: 'fixed',
                    width: '100%',
                    zIndex: 9999
                }}
            />
            </Fade>
        </MuiThemeProvider>
    );
};

export default Spinner;
