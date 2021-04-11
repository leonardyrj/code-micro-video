import axios,{
    AxiosInstance,
    AxiosResponse,
    AxiosRequestConfig,
    CancelTokenSource
} from 'axios';
import {serialize} from "object-to-formdata";


export default class HttpResource{

    private cancelList: CancelTokenSource | null = null;

    constructor(private http: AxiosInstance, protected resource) {
    }

    list<T = any>(options?: {queryParam?}): Promise<AxiosResponse<T>>
    {
        if(this.cancelList){
            this.cancelList.cancel('list cancelled');
        }
        this.cancelList = axios.CancelToken.source();
        const config: AxiosRequestConfig = {
            cancelToken: this.cancelList.token
        };
        if(options && options.queryParam){
            config.params = options.queryParam;
        }
        return this.http.get<T>(this.resource,config)
    }

    get<T = any>(id: any): Promise<AxiosResponse<T>>
    {
        return this.http.get<T>(`${this.resource}/${id}`);
    }

    create<T = any>(data): Promise<AxiosResponse<T>>
    {
        let sendData = this.makeSendData(data);
        return this.http.post<T>(this.resource, sendData);

    }

    update<T = any>(id, data, options?: { http?: { usePost: boolean } }): Promise<AxiosResponse<T>> {
        let sendData = data;
        if (this.containsFile(data)) {
            sendData = this.getFormData(data);
        }
        // Quando o objeto tiver a possibilidade de ser vazio
        const {http} = (options || {}) as any;
        return !options || !http || !http.usePost
            ? this.http.put<T>(`${this.resource}/${id}`, sendData)
            : this.http.post<T>(`${this.resource}/${id}`, sendData)
    }


    delete<T = any>(id): Promise<AxiosResponse<T>>
    {
        return this.http.delete<T>(`${this.resource}/${id}`);
    }

    deleteCollection<T = any>(queryParams): Promise<AxiosResponse<T>> {
        const config:AxiosRequestConfig = {};
        if (queryParams) {
            config['params'] = queryParams;
        }
        return this.http.delete<T>(`${this.resource}`, config)
    }

    isCancelledRequest(error){
        return axios.isCancel(error)
    }
    private makeSendData(data) {
        return this.containsFile(data) ? this.getFormData(data) : data;
    }

    private getFormData(data) {
        // const formData = new FormData();
        // Object
        //     .keys(data)
        //     .forEach(key => {
        //         let value = data[key];
        //         if (typeof value === "undefined") {
        //             return;
        //         }
        //         if (typeof value === "boolean") {
        //             value = value ? 1 : 0;
        //         }
        //         if(value instanceof Array){
        //             value.forEach(v => formData.append(`${key}[]`, v))
        //             return;
        //         }
        //         formData.append(key, value)
        //     });
        return serialize(data,{booleansAsIntegers: true} );
    }


    private containsFile(data) {
        return Object
            .values(data)
            .filter(el => el instanceof File).length !== 0
    }



}



