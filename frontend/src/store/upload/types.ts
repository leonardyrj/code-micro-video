import {Video} from "../../util/models";
import {AxiosError} from 'axios';
import {AnyAction} from "redux";

export interface FileUpload{
    fileField: string;
    filename: string;
    progress: number;
    error?: AxiosError
}

export interface Upload{
    video: Video;
    progress: number;
    files: FileUpload[]
}

export interface State{
    uploads: Upload[]
}

export interface AddUploadAction extends AnyAction{
    payload:{
        video: Video
        files: Array<{file: File, filedField: string}>
    }
}

export type Actions = AddUploadAction;