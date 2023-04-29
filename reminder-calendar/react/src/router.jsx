import {Navigate, createBrowserRouter} from "react-router-dom";
import NotFound from "./views/NotFound";
import Register from "./views/Register";
import DefautltLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import EmailVerification from "./views/EmailVerification";
import EmailVerified from "./views/EmailVerified";
import Profile from "./views/Profile";
import CreateCalendar from "./views/CreateCalendar";


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefautltLayout />,
        children: [
            {
                path: '/calendar/create',
                element: <CreateCalendar />
            }
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
        path: '/account/profile',
        element: <Profile />
    },
])

export default router;