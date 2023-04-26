import {Navigate, createBrowserRouter} from "react-router-dom";
import NotFound from "./views/NotFound";
import Register from "./views/Register";
import DefautltLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import EmailVerification from "./views/EmailVerification";
import EmailVerified from "./views/EmailVerified";
import Profile from "./views/Profile";
import BasicExample from "./views/BasicExample";


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefautltLayout />,
        children: [
            // {
            //     path: '/account/profile',
            //     element: <Profile />
            // }
        ]
    },
    //
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Register />
            },
            {
                path: '/email-verified',
                element: <EmailVerified />
            },
            {
                path: '/email-verify',
                element: <EmailVerification />
            }
        ]
    },
    {
        path: '/*',
        element: <NotFound />
    },
    {
        path: '/example',
        element: <BasicExample />
    },
    {
        path: '/account/profile',
        element: <Profile />
    },
])

export default router;