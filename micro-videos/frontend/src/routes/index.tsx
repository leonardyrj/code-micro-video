import {RouteProps} from 'react-router-dom';
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/CategoryList";
import CastMemberList from "../pages/cast-member/CastMemberList";
import GenreList from "../pages/genre/GenreList";
import CategoryForm from "../pages/category/CategoryForm";
import GenreForm from "../pages/genre/GenreForm";
import CastMemberForm from "../pages/cast-member/CastMemberForm";
import VideoList from '../pages/video/PageList';
import VideoForm from '../pages/video/PageForm';
import UploadPage from "../pages/uploads";




export interface MyRoutesProps extends RouteProps {
    name: string,
    label: string,
}

const routes: MyRoutesProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: "/",
        component: Dashboard,
        exact: true
    },
    {
        name: 'categoria.list',
        label: 'Lista de Categorias',
        path: '/categorias',
        component: CategoryList,
        exact: true
    },
    {
        name: 'categoria.create',
        label: 'Criar Categorias',
        path: '/categorias/create',
        component: CategoryForm,
        exact: true
    },
    {
        name: 'categoria.edit',
        label: 'Editar Categorias',
        path: '/categorias/:id/edit',
        component: CategoryForm,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Listar membros de elencos',
        path: '/cast-members',
        component: CastMemberList,
        exact: true
    },
    {
        name: 'cast_members.create',
        label: 'Criar Membro de Elenco',
        path: '/cast-members/create',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'cast_members.edit',
        label: 'Editar membros de elencos',
        path: '/cast-members/:id/edit',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
    {
        name: 'genres.create',
        label: 'Criar gêneros',
        path: '/genres/create',
        component: GenreForm,
        exact: true
    },
    {
        name: 'genres.edit',
        label: 'Editar gêneros',
        path: '/genres/:id/edit',
        component: GenreForm,
        exact: true
    },
    {
        name: 'videos.list',
        label: 'Listar vídeos',
        path: '/videos',
        component: VideoList,
        exact: true
    },
    {
        name: 'videos.create',
        label: 'Criar vídeos',
        path: '/videos/create',
        component: VideoForm,
        exact: true
    },
    {
        name: 'videos.edit',
        label: 'Editar vídeo',
        path: '/videos/:id/edit',
        component: VideoForm,
        exact: true
    },
    {
        name: 'uploads',
        label: 'Uploads',
        path: '/uploads',
        component: UploadPage,
        exact: true
    }



]


export default routes;