import {useEffect} from 'react';
import {useSnackbar} from "notistack";

const UseSnackbarFormError = (submitCount, errors) => {
    const snackbar = useSnackbar();
    useEffect(() => {
        const hasError = Object.keys(errors).length !== 0;
        if(submitCount > 0 && hasError){
            snackbar.enqueueSnackbar(
                'Formulário Inválido. Revejas os campos marcados de vermelhos',
                {variant: 'error'}
            )
        }
    },[submitCount]);
};

export default UseSnackbarFormError;
