import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {keycloak} from "../auth";
const httpVideo = axios.create({
    baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL
})


const instaces = [httpVideo];
httpVideo.interceptors.request.use(authInterceptor);


function authInterceptor(request: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig>{
    if(keycloak?.token){
        addToken(request)
        return request
    }
    return new Promise((resolve, reject) => {
        keycloak.onAuthSuccess = () => {
            addToken(request);
            resolve(request)
        }
        keycloak.onAuthError = () =>{
            reject(request)
        }
    })
}

function addToken(request: AxiosRequestConfig){
    request.headers['Authorization'] = `Bearer ${keycloak.token}`
}

export function addGlobalRequestInterceptor(
    onFuldilled? : (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onReject?: (error: any) => any
){
    const ids: number[] = [];
    for(let i of instaces){
        const id = i.interceptors.request.use(onFuldilled,onReject);
        ids.push(id);
    }
    return ids;
}

export function removeGlobalRequestInterceptor(ids: number[]){
    ids.forEach(
        (id,index) => instaces[index].interceptors.request.eject(id)
    )
}

export function addGlobalResponseInterceptor(
    onFuldilled? : (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onReject?: (error: any) => any
){
    const ids: number[] = [];
    for(let i of instaces){
        const id = i.interceptors.response.use(onFuldilled,onReject);
        ids.push(id);
    }
    return ids;
}

export function removeGlobalResponseInterceptor(ids: number[]){
    ids.forEach(
        (id,index) => instaces[index].interceptors.response.eject(id)
    )
}



export default httpVideo;