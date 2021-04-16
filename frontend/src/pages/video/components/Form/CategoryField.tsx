import * as React from 'react';
import useHttpHandled from "../../../../hooks/useHttpHandled";
import AsyncAutocomplete, {AsyncAutocompleteComponent} from "../../../../components/AsyncAutocomplete";
import GridSelected from "../../../../components/GridSelected";
import GridSelectedItem from "../../../../components/GridSelectedItem";
import Typography from "@material-ui/core/Typography";
import {Genre} from "../../../../util/models";
import categoryHttp from "../../../../util/http/category-http";
import useCollectionManager from "../../../../hooks/useCollectionManager";
import {FormControl, FormHelperText, FormControlProps} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";
import {getGenresFromCategory} from "../../../../util/model-filter";
import {MutableRefObject, useImperativeHandle, useRef} from "react";


const useStyles = makeStyles((theme: Theme) => ({
    genresSubtitle: {
        color: grey["800"],
        fontSize: '0.8rem'
    }
}));


interface CategoryFieldProps {
    categories: any[];
    setCategories: (categories) => void;
    genres: Genre[];
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps;

};

export interface CategoryFieldComponent{
    clear: () => void
}

const CategoryField = React.forwardRef<CategoryFieldComponent, CategoryFieldProps>((props, ref) => {
    const classes = useStyles();
    const {genres,categories,setCategories,error, disabled} = props;
    const {addItem,removeItem} = useCollectionManager(categories,setCategories);
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;
    /* Usado para não aparecer a mensagem de erro no cancelamento*/
    const autocompleteHttp =useHttpHandled();
    function fetchOptions(searchText) {
        return autocompleteHttp(
            categoryHttp
                .list({
                    queryParam: {
                        genres: genres.map(genre => genre.id).join(','),
                        all: ""
                    }
                })
        ).then(data => data.data)
    }
    useImperativeHandle(ref, () => ({
        clear: () => autocompleteRef.current.clear()
    }));


    return (
        <>
        <AsyncAutocomplete
            ref={autocompleteRef}
            AutocompleteProps={{
                getOptionLabel: option => option.name,
                onChange: (event,value) => addItem(value),
                disabled: !genres.length || disabled == true
            }}
            fetchOptions={fetchOptions}
            TextFieldProps={{
                label: 'Categorias'
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
                        categories.map((category, key) => {
                            const genresFromCategory = getGenresFromCategory(genres, category)
                                .map(genre => genre.name)
                                .join(',');
                            return (
                                <GridSelectedItem
                                    key={key}
                                    onDelete={() => removeItem(category)} xs={12}
                                >
                                    <Typography noWrap={true}>
                                        {category.name}
                                    </Typography>
                                    <Typography noWrap={true} className={classes.genresSubtitle}>
                                        Gêneros: {genresFromCategory}
                                    </Typography>
                                </GridSelectedItem>
                            )
                        })
                    }

                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
});

export default CategoryField;