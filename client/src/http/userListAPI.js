import { $authHost } from "./index.js";

export const getUserList = async () => {
    const {data} = await $authHost.get('api/users/data')
    return data
}

export const deleteUser = async (id) => {
    const response = await $authHost.delete(`api/users/delete?id=${id}`)
    return response
}

export const blockUser = async (id) => {
    const response = await $authHost.get(`api/users/block?id=${id}`)
    return response
}

export const unblockUser = async (id) => {
    const response = await $authHost.get(`api/users/unblock?id=${id}`)
    return response
}