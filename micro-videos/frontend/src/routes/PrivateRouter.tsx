import React, {FC, useCallback} from 'react';
import {Route, RouteProps, Redirect} from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import {useKeycloak} from '@react-keycloak/web';
import {useHasRealmRole} from "../hooks/useHasRole";
import NotAuthorized from "../pages/NotAuthorized";
interface PrivateProps extends RouteProps{
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}


const PrivateRoute: FC<PrivateProps> = (props) =>{
    const {component: Component, ...rest} = props;
    const {keycloak} = useKeycloak();
    const hasCatalogAdmin = useHasRealmRole('catalog-admin')
    //keycloak.logout();
    const render = useCallback((props) => {
        if(keycloak.authenticated){
            return hasCatalogAdmin ? <Component {...props}/> :  <NotAuthorized/>;
        }

        return <Redirect to={{
            pathname: "/login",
            state: {from: props.location}
        }}/>

    },[hasCatalogAdmin]);

    return (
        <Route {...rest} render={render}/>
    );
};

export default PrivateRoute;