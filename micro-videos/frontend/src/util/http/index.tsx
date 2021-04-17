import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
const httpVideo = axios.create({
    baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL
})


const instaces = [httpVideo];

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