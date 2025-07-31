import { $authHost, $host } from "./index.js"

export const registration = async (email, name, password) => {
    const {data} = await $host.post('api/users/registration', {email, name, password})
    localStorage.setItem('token', data.token)
    const user = data.user
    return user
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/users/login', {email, password})
    localStorage.setItem('token', data.token)
    const user = data.user
    return user
}

export const check = async () => {
    const {data} = await $authHost.get('api/users/auth')
    localStorage.setItem('token', data.token)
    const user = data.user
    return user
}
