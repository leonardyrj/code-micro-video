import React from 'react';
import {Switch,Route as ReactRoute} from 'react-router-dom';
import routes from "./index";
import PrivateRoute from "./PrivateRouter";
import {useKeycloak} from "@react-keycloak/web";


const AppRouter = () =>{
    const {initialized,keycloak} = useKeycloak();
    if(!initialized){
        return <div>Carregando...</div>
    }
    console.log(keycloak.token);
    return (
        <Switch>
            {routes.map((route, key) => {
                const Route = route.auth === true ? PrivateRoute : ReactRoute;
                const routeParams = {
                    key,
                    component: route.component!,
                    ...(route.path && {path: route.path}),
                    ...(route.exact && {exact: route.exact}),
                };

                return <Route {...routeParams}/>
            })}
        </Switch>
    );
};

export default AppRouter;