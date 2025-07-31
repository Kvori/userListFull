import { Container, Form, Button, Nav, Card } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    USERLIST_ROUTE,
} from '../utils/consts.js'
import { login, registration } from '../http/userAPI.js'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../index.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomButton from '../components/CustomButton.js'

const getSchema = (isRegister) =>
    yup.object().shape({
        email: yup
            .string()
            .required(isRegister ? 'Email обязателен' : 'Введите email')
            .email('Некорректный email'),
        password: yup
            .string()
            .trim()
            .required(
                isRegister
                    ? 'Пароль обязателен и не может быть пробелом'
                    : 'Введите пароль (пароль не может быть пробелом)'
            ),
        ...(isRegister && {
            name: yup.string().required('Имя обязательно'),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref('password')], 'Пароли не совпадают')
                .required('Подтверждение пароля обязательно'),
        }),
    })

const Auth = () => {
    const { user, error } = useContext(Context)
    const navigate = useNavigate()
    const [serverError, setServerError] = useState('')

    if (user._isAuth) navigate(USERLIST_ROUTE)

    const location = useLocation()
    const isRegister = location.pathname === REGISTRATION_ROUTE
    const [isLoading, setIsLoading] = useState(false)

    const schema = getSchema(isRegister)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) })

    useEffect(() => {
        setServerError('')
    }, [isRegister])

    const onSubmit = async ({ email, password, name }) => {
        setServerError('')
        setIsLoading(true) // ⏳ включаем лоадер
        try {
            const data = isRegister
                ? await registration(email, name, password)
                : await login(email, password)

            user.setUser(data)
            user.setIsAuth(true)
            navigate(USERLIST_ROUTE)
        } catch (e) {
            if (e.response?.data.message) {
                return setServerError(e.response.data.message)
            }
            error.setShowError(true)
            error.setError(e.message)
        } finally {
            setIsLoading(false) // ✅ выключаем лоадер
        }
    }

    return (
        <Container
            className="d-flex align-items-center"
            style={{ maxWidth: '500px', marginTop: '2rem', minHeight: '80vh' }}
        >
            <Card className="p-4 w-100">
                <h2 className="d-flex justify-content-center mb-5">
                    {isRegister ? 'Регистрация' : 'Авторизация'}
                </h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {isRegister && (
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите имя"
                                {...register('name')}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}

                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Введите email"
                            {...register('email')}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Введите пароль"
                            {...register('password')}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {isRegister && (
                        <Form.Group
                            controlId="formConfirmPassword"
                            className="mb-4"
                        >
                            <Form.Label>Подтвердите пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Повторите пароль"
                                {...register('confirmPassword')}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}

                    {serverError && (
                        <p className="Error" style={{ color: 'red' }}>
                            {serverError}
                        </p>
                    )}
                    <CustomButton
                        variant="primary"
                        type="submit"
                        className="w-100 mb-3"
                        isLoading={isLoading}
                    >
                        {isRegister ? 'Зарегистрироваться' : 'Войти'}
                    </CustomButton>
                </Form>
                {isRegister ? (
                    <div className="d-flex justify-content-center">
                        <div>Если у вас есть аккаунт,&nbsp;</div>
                        <Nav.Link
                            className="link-info"
                            as={Link}
                            to={LOGIN_ROUTE}
                        >
                            войдите
                        </Nav.Link>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <div>Если у вас нет аккаунта,&nbsp;</div>
                        <Nav.Link
                            className="link-info"
                            as={Link}
                            to={REGISTRATION_ROUTE}
                        >
                            зарегестрируйтесь
                        </Nav.Link>
                    </div>
                )}
            </Card>
        </Container>
    )
}

export default Auth
