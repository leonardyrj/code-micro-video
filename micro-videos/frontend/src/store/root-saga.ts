import {all} from 'redux-saga/effects';
import {uploadWatcherSaga} from "./upload/saga";


export default function* rootSaga(){
    yield all([
        uploadWatcherSaga()
    ]);
}