import * as React from 'react';
import * as yup from '../../../../util/vendor/yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useSnackbar} from "notistack";
import {useHistory, useParams} from "react-router";
 import {createRef, MutableRefObject, useContext, useEffect, useRef, useState} from "react";
import videoHttp from "../../../../util/http/video-http";
import {Video, VideoFileFieldsMap} from "../../../../util/models";
import {DefaultForm} from "../../../../components/DefaultForm";
import {Card, CardContent, FormHelperText, Grid, Snackbar, TextField, useMediaQuery, useTheme} from "@material-ui/core";
import SubmitAction from "../../../../components/SubmitAction";
import RatingField from "./RatingField";
import UploadField from "./UploadField";
import {makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import GenreField, {GenreFieldComponent} from "./GenreField";
import CategoryField, {CategoryFieldComponent} from "./CategoryField";
import CastMemberField, {CastMemberFieldComponent} from "./CastMemberField";
import {omit,zipObject} from 'lodash'
import {InputFileComponent} from "../../../../components/InputFile";

import LoadingContext from "../../../../components/loading/LoadingContext";
 import SnackbarUpload from "../../../../components/SnackbarUpload";
import {useSelector,useDispatch} from 'react-redux';
import {State as UploadState, Upload} from "../../../../store/upload/types";
import {Creators} from "../../../../store/upload";

import useSnackBarFormError from '../../../../hooks/useSnackbarFormError';



const useStyles = makeStyles((theme: Theme) => ({
    cardUpload:{
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        margin: theme.spacing(2,0)
    }
}))


const SchemaValidation = yup.object().shape({
    title: yup.string()
        .label('Título')
        .required()
        .max(255),
    description: yup.string()
        .label('Sinopse')
        .required(),
    year_launched: yup.number()
        .label('Ano de lançamento')
        .required()
        .min(1),
    duration: yup.number()
        .label('Duração')
        .required()
        .min(1),
    categories: yup.array()
        .min(1,'Categoria é Requerido')
        .label('Categorias')
        .required(),
    genres: yup.array()
        .label('Gêneros')
        .required()
        .min(1,'Gêneros é Requerido')
        .test({
            message: 'Cada gênero escolhido precisa ter pelo menos uma categoria selecionada',
            test(value) { //array genres [{name, categories: []}]
                if(value !== undefined) {
                    return value.every(
                        v => v.categories.filter(
                            cat => this.parent.categories.map(c => c.id).includes(cat.id)
                        ).length !== 0
                    );
                }else{
                    return true;
                }
            }
        }),
    rating: yup.string()
        .label('Classificação')
        .required(),

});


const fileFields = Object.keys(VideoFileFieldsMap);
export const Form = () => {
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
        trigger,
        formState
    } = useForm<any>({
        resolver: yupResolver(SchemaValidation),
        defaultValues: {
            rating: null,
            cast_members: [],
            genres: [],
            categories: [],
            opened: false,
        }
    });
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const [video, setVideo] = useState<Video | null>(null);

    const loading = useContext(LoadingContext);



    // Para saber quando é acima de md
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
    const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
    const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;
    const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;
    const uploadsRef = useRef(
        zipObject(fileFields, fileFields.map(() => createRef()))
    ) as MutableRefObject<{[key: string] : MutableRefObject<InputFileComponent>}>


    const uploads = useSelector<UploadState, Upload[]>(
        (state) => state.uploads
    );
    const dispatch = useDispatch();

    setTimeout(()=> {
        const obj: any = {
            video:{
                id: 1,
                title: 'E o vento levou'
            },
            files:[
                {file: new File([""],'tete.mp4')}
            ]
        }
        dispatch(Creators.addUpload(obj))

    }, 1000);

    console.log(uploads)



    useEffect(() => {
        //Registrando de forma manual no useForm
        [
            'rating',
            'opened',
            'genres',
            'categories',
            'cast_members',
            ...fileFields
        ].forEach(name => register({name}));
    }, [register]);


    useEffect(() => {

        snackbar.enqueueSnackbar('', {
            key: 'snackbar-upload',
            persist: true,
            anchorOrigin:{
                horizontal: 'right',
                vertical: 'bottom'
            },
            content: (key,message) => {
                const id = key as any;
                return <SnackbarUpload id={id}/>
            }
        })

        if (!id) {
            return;
        }
        let isSubscribed = true;
        (async () => {
            try {
                const {data} = await videoHttp.get(id);
                if (isSubscribed) {
                    setVideo(data.data);
                    reset(data.data);
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: 'error',}
                )

            }
        })();
        return () => {
            isSubscribed = false;
        }
    }, []);

    useSnackBarFormError(formState.submitCount, errors);
    async function onSubmit(formData, event) {
        const sendData = omit(formData,['cast_members','genres','categories']);
        sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id);
        sendData['categories_id'] = formData['categories'].map(category => category.id);
        sendData['genres_id'] = formData['genres'].map(genre => genre.id);
        try {
            const http = !video
                ? videoHttp.create(sendData)
                : videoHttp.update(video.id,formData);
            const {data} = await http;
            console.log(data)
            snackbar.enqueueSnackbar(
                'Vídeo salvo com sucesso',
                {variant: 'success'}
            );
            id && resetForm(video);
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/videos/${data.id}/edit`)
                            : history.push(`/videos/${data.id}/edit`)
                    )
                    : history.push('/videos')
            });
        } catch (error) {
            console.error(error);
            snackbar.enqueueSnackbar(
                'Não foi possível salvar o vídeo',
                {variant: 'error'}
            )

        }
    }

    function resetForm(data){
        Object.keys(uploadsRef.current).forEach(
            field => uploadsRef.current[field].current.clear()
        );
        castMemberRef.current.clear();
        genreRef.current.clear();
        categoryRef.current.clear();
        reset(data)
    }

    // @ts-ignore
    return (
        <DefaultForm
            GridItemProps={{xs: 12}}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="title"
                        label="Título"
                        variant={'outlined'}
                        fullWidth
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{shrink: true}}
                        error={errors.title !== undefined}
                        helperText={errors.title && errors.title.message}
                    />
                    <TextField
                        name="description"
                        label="Sinopse"
                        multiline
                        rows="4"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{shrink: true}}
                        error={errors.description !== undefined}
                        helperText={errors.description && errors.description.message}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                name="year_launched"
                                label="Ano de lançamento"
                                type="number"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{shrink: true}}
                                error={errors.year_launched !== undefined}
                                helperText={errors.year_launched && errors.year_launched.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="duration"
                                label="Duração"
                                type="number"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{shrink: true}}
                                error={errors.duration !== undefined}
                                helperText={errors.duration && errors.duration.message}
                            />
                        </Grid>
                    </Grid>
                    <CastMemberField
                        //ref={castMemberRef}
                        castMembers={watch('cast_members')}
                        setCastMembers={(value) => setValue('cast_members', value, {shouldValidate: true})}
                        error={errors.cast_members}
                        disabled={loading}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <GenreField
                                genres={watch('genres')}
                                setGenres={(value) => setValue('genres',value,{shouldValidate: true})}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories',value,{shouldValidate: true})}
                                error={errors.genres}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryField
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories',value,{shouldValidate: true})}
                                genres={watch('genres')}
                                error={errors.categories}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText>
                                Escolha os gêneros do vídeos
                            </FormHelperText>
                            <FormHelperText>
                               Escolha pelo menos uma categoria de cada gênero
                            </FormHelperText>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <RatingField
                        value={watch('rating')}
                        setValue={(value) => setValue('rating',value,{shouldValidate: true})}
                        error={errors.rating}
                        disabled={loading}
                        FormControlProps={{
                            margin: isGreaterMd ? 'none' : 'normal'
                        }}
                    />
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Imagens
                            </Typography>
                            <UploadField
                                ref={uploadsRef.current['thumb_file']}
                                accept={'image/*'}
                                label={'Thumb'}
                                setValue={(value) => setValue('thumb_file',value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['banner_file']}
                                accept={'image/*'}
                                label={'Banner'}
                                setValue={(value) => setValue('banner_file',value)}
                            />
                        </CardContent>
                    </Card>
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                               Videos
                            </Typography>
                            <UploadField
                                ref={uploadsRef.current['trailer_file']}
                                accept={'video/mp4'}
                                label={'Trailler'}
                                setValue={(value) => setValue('trailer_file',value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['video_file']}
                                accept={'video/mp4'}
                                label={'Principal'}
                                setValue={(value) => setValue('video_file',value)}
                            />
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>
            <SubmitAction
                disabledButtons={loading}
                handleSalve={() => {
                    trigger().then((valid) => {
                        valid && onSubmit(getValues(), null)
                    })
                }
                }
            />
        </DefaultForm>

    );
};
