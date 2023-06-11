import {Navigate, createBrowserRouter} from "react-router-dom";
import NotFound from "./views/NotFound";
import Register from "./views/Register";
import DefautltLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import EmailVerification from "./views/EmailVerification";
import EmailVerified from "./views/EmailVerified";
import Profile from "./views/Profile";
import EditEvent from "./views/EditEvent";
import CreateEvent from "./views/CreateEventDetail";
import withAuth from "./components/Auth"
import RecycleBin from "./views/RecycleBin";
import CompleteEvent from "./views/CompletedEvent";
import IncompleteEvent from "./views/IncompleteEvent"

const ProtectedProfile = withAuth(Profile);
const ProtectedEditEvent = withAuth(EditEvent);
const ProtectedCreateEvent = withAuth(CreateEvent);

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefautltLayout />,
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
        path: '/account/profile',
        element: <ProtectedProfile />
    },
    {
        path: '/edit-event',
        element: <ProtectedEditEvent  />
    },
    {
        path: '/create-event',
        element: <ProtectedCreateEvent  />
    },
    {
        path: '/*',
        element: <NotFound />
    },
    {
        path: '/trash',
        element: <RecycleBin />
    },
    {
        path: '/completed-event',
        element: <CompleteEvent />
    },
    {
        path: '/incomplete-event',
        element: <IncompleteEvent />
    },
])
export default router;