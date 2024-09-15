import { createBrowserRouter } from "react-router-dom";

import ProfilePage from "./pages/ProfilePage";
import MainPage from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import FavouritesPage from "./pages/FavouritePage";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>,
    },
    {
        path: "/registration",
        element: <RegistrationPage/>,
    },
    {
        path: "/",
        element: <ProfilePage/>,
    },
    {
        path: "/main",
        element: <MainPage/>,
    },
    {
        path: "/profile",
        element: <ProfilePage/>,
    },
    {
        path: "/favourite",
        element: <FavouritesPage/>,
    },
])