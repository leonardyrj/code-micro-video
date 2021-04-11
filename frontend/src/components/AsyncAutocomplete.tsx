import React, {useEffect, useImperativeHandle, useState} from 'react';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import {useDebounce} from "use-debounce";

interface AsyncAutocompleteProps{
    fetchOptions: (search: any) => Promise<any>;
    debounceTime?: number,
    TextFieldProps?: TextFieldProps;
    AutocompleteProps?: Omit<AutocompleteProps<any, any, any, any>,"renderInput" | "options">
}

export interface AsyncAutocompleteComponent {
    clear: () => void;
}


const AsyncAutocomplete = React.forwardRef<AsyncAutocompleteComponent,AsyncAutocompleteProps>((props,ref) => {
    const {AutocompleteProps, debounceTime = 300} = props;
    const {freeSolo,onOpen, onClose} = AutocompleteProps as any;
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [debouncedSearchText] = useDebounce(searchText,debounceTime);


    useEffect(() => {
        if (!open && !freeSolo) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
    if(!open || debouncedSearchText === "" && freeSolo ){
          return;
    }

    let isSubscribed = true;
    (async () => {
      setLoading(true);
      try {
          const  data = await props.fetchOptions(debouncedSearchText);
          if (isSubscribed) {
             setOptions(data);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isSubscribed = false;
    };
  }, [freeSolo ? debouncedSearchText : open]);

  const textFieldProps: TextFieldProps = {
    margin: 'normal',
    variant: 'outlined',
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldProps && { ...props.TextFieldProps }),
  };

  const autocompleteProps: AutocompleteProps<any,any,any,any> = {
      loadingText: 'Carregando...',
      noOptionsText: 'Nenhum item encontrado',
      ...(AutocompleteProps && {...AutocompleteProps}),
      open,
      options,
      loading,
      inputValue: searchText,
      onOpen(){
          setOpen(true);
          onOpen && onOpen();
      },
      onClose(){
          setOpen(false);
          onClose && onClose();
      },
      onInputChange(event, value) { setSearchText(value); },
      renderInput: (params) => (
      <TextField
        {...params}
        {...textFieldProps}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress color="inherit" size={20} />}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    ),
  };

    useImperativeHandle(ref, () => ({
        clear: () => {
            setSearchText("");
            setOptions([]);
        }
    }));

    return (
    <Autocomplete {...autocompleteProps} />
  );
});

export default AsyncAutocomplete;
