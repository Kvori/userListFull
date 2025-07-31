import { useContext } from "react";
import { Context } from "../index.js";

const useLogout = () => {
    const { user } = useContext(Context);

    const logout = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.setItem("token", "");
    };

    return logout;
};


export default useLogout