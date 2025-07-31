import { Routes, Route, Navigate } from "react-router-dom"
import { authRoutes, publicRoutes } from "../routes.js"
import { LOGIN_ROUTE } from "../utils/consts.js"
import { useContext } from "react"
import { Context } from "../index.js"
import { observer } from "mobx-react-lite"

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} Component={Component} exact />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} Component={Component} exact />
            )}
            <Route path="*" element={<Navigate to={LOGIN_ROUTE} replace/>}></Route>
        </Routes>
    )
})

export default AppRouter
