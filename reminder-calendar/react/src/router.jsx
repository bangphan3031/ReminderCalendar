import {Navigate, createBrowserRouter} from "react-router-dom";
import NotFound from "./views/NotFound";
import Register from "./views/Register";
import Users from "./views/Users";
import DefautltLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard"
import { Children } from "react";
import Login from "./views/login";


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefautltLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/users" />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/users',
                element: <Users />
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
        ]
    },
    {
        path: '/*',
        element: <NotFound />
    },
])

export default router;