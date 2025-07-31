import { HashRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter.js'
import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { Context } from './index.js'
import { check } from './http/userAPI.js'
import { Container, Spinner } from 'react-bootstrap'
import Header from './components/Header.js'
import ErrorModal from './components/ErrorModal.js'

const App = observer(() => {
    const { user, error } = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            check()
                .then((data) => {
                    user.setUser(data)
                    user.setIsAuth(true)
                })
                .finally(() => setLoading(false))
        } catch (e) {
            error.setShowError(true)
            error.setErrorText(e)
        }

    }, [])

    if (loading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center m-auto"
                style={{ height: '100vh' }}
            >
                <Spinner animation="grow"></Spinner>
            </Container>
        )
    }

    return (
        <HashRouter>
            <ErrorModal
                show={error.showError}
                handleClose={() => error.setShowError(false)}
                error={error.error}
            />
            <Header />
            <AppRouter />
        </HashRouter>
    )
})

export default App
