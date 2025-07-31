import { Button, Container, Navbar, NavLink } from "react-bootstrap"
import { LOGIN_ROUTE } from "../utils/consts.js"
import { useContext } from "react"
import { Context } from "../index.js"
import { Link, useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import useLogout from "../utils/logout.js"

const Header = observer(() => {
    const { user } = useContext(Context)
    const navigate = useNavigate()
    const logout = useLogout()

    return (
        <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary mb-5">
            <Container>
                <Navbar.Brand to={"/"} as={Link}>DATA BASE</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {user.isAuth ?
                            <Button onClick={logout}>LOGOUT</Button>
                            :
                            <NavLink onClick={() => navigate(LOGIN_ROUTE)}>LOGIN</NavLink>
                        }
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
})

export default Header