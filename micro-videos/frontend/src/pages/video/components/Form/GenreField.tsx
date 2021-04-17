import * as React from 'react';
import useHttpHandled from "../../../../hooks/useHttpHandled";
import genreHttp from "../../../../util/http/genre-http";
import AsyncAutocomplete, {AsyncAutocompleteComponent} from "../../../../components/AsyncAutocomplete";
import GridSelected from "../../../../components/GridSelected";
import GridSelectedItem from "../../../../components/GridSelectedItem";
import Typography from "@material-ui/core/Typography";
import useCollectionManager from "../../../../hooks/useCollectionManager";
import {FormControl, FormHelperText, FormControlProps} from "@material-ui/core";
import {getGenresFromCategory} from "../../../../util/model-filter";
import {MutableRefObject, RefAttributes, useImperativeHandle, useRef} from "react";

interface GenreFieldProps extends RefAttributes<GenreFieldComponent>{
    genres: any[];
    setGenres: (genres) => void;
    categories: any[];
    setCategories: (category) => void;
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps;
};

export interface GenreFieldComponent {
    clear: () => void
}


const GenreField =  React.forwardRef<GenreFieldComponent,GenreFieldProps>((props,ref) => {
    const autocompetleRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;
    const {genres,setGenres, error, disabled,categories,setCategories} = props;
    const {addItem,removeItem} = useCollectionManager(genres,setGenres);
    const {removeItem: removeCategory} = useCollectionManager(categories, setCategories);
    /* Usado para não aparecer a mensagem de erro no cancelamento*/
    const autocompleteHttp =useHttpHandled();
    function fetchOptions(searchText) {
        return autocompleteHttp(
            genreHttp
                .list({
                    queryParam: {
                        search: searchText, all: ""
                    }
                })
        ).then(data => data.data)
    }

    useImperativeHandle(ref, () => ({
        clear: () => autocompetleRef.current.clear()
    }));

    return (
        <>
        <AsyncAutocomplete
            ref={autocompetleRef}
            AutocompleteProps={{
              //  autoSelect: true,
                freeSolo: true,
                clearOnEscape: true,
                getOptionSelected: (option,value) => option.id === value.id,
                getOptionLabel: option => option.name,
                onChange: (event,value) => addItem(value),
                disabled: disabled
            }}
            fetchOptions={fetchOptions}
            TextFieldProps={{
                label: 'Gêneros'
            }}
        />
        <FormControl
            error={error !== undefined}
            disabled={disabled === true}
            {...props.FormControlProps}
            margin={"normal"}
            fullWidth
        >
            <GridSelected>
            {
                genres?.map((genre,key) => (
                    <GridSelectedItem
                        key={key}
                        onDelete={() => {
                            const categoriesWithOneGenre = categories
                                .filter(category => {
                                    const genresFromCategory = getGenresFromCategory(genres, category);
                                    return genresFromCategory.length === 1 && genresFromCategory[0].id === genre.id
                                });
                            categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                            removeItem(genre)
                        }}
                        xs={12}
                    >
                        <Typography noWrap={true}>{genre.name}</Typography>
                    </GridSelectedItem>
                ))
            }
            </GridSelected>
            {
                error && <FormHelperText>{error.message}</FormHelperText>
            }
        </FormControl>
        </>
    );
});

export default GenreField;