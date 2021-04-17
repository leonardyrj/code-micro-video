import {applyMiddleware, combineReducers, createStore} from "redux";
import upload from "./upload";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "./root-saga";


const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
    && (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const sagaMiddleware = createSagaMiddleware();
// const store = createStore(
//     combineReducers({
//         upload
//     }),
//     devTools,
//     applyMiddleware(sagaMiddleware)
// );

const reducer = combineReducers({
    upload
})
const store = applyMiddleware(sagaMiddleware)(createStore)(
    reducer,
    devTools,
);


sagaMiddleware.run(rootSaga);

export default store;