import {axiosNoAuth} from './axios'

export const post = (data) => {
    return axiosNoAuth.post(``, data)
}

export const getLinks = () => {
    return axiosNoAuth.get(`/getLinks/links`)
}