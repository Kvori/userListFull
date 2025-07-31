import Auth from "./pages/Auth.js";
import UserList from "./pages/UserList.js";
import { LOGIN_ROUTE, USERLIST_ROUTE, REGISTRATION_ROUTE } from "./utils/consts.js";

export const authRoutes = [
    {
        path: USERLIST_ROUTE,
        Component: UserList
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    }
]
