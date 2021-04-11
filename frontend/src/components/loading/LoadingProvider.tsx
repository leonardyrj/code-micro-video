import * as React from 'react';
import LoadingContext from "./LoadingContext";
import {useEffect, useMemo, useState} from "react";
import {
    addGlobalRequestInterceptor,
    addGlobalResponseInterceptor,
    removeGlobalRequestInterceptor, removeGlobalResponseInterceptor
} from "../../util/http";

interface LoadingProviderProps{
    children: React.ReactNode;
}


const LoadingProvider = (props: LoadingProviderProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [countRequest, setCountRequest] = useState(0);



    useMemo(() => {
        let isSubscribed = true;
        const requestIds = addGlobalRequestInterceptor((config) => {
            if(isSubscribed){
                setLoading(true);
                setCountRequest(prevState => prevState + 1);
            }
            return config;
        })

        const responseIds = addGlobalResponseInterceptor((response) =>{
            if(isSubscribed){
                decrementCountRequest();
            }
            return response
        }, (error) => {
            decrementCountRequest();
            return Promise.reject(error)
        })

        return () => {
            isSubscribed = false;
            removeGlobalRequestInterceptor(requestIds);
            removeGlobalResponseInterceptor(responseIds);
        }
    },[true])

    useEffect(() => {
        if(!countRequest){
            setLoading(false);
        }
    },[countRequest])

    console.log(countRequest)

    function decrementCountRequest(){
        setCountRequest(prevState => prevState - 1);
    }

    return (
        <LoadingContext.Provider value={loading}>
            {props.children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;