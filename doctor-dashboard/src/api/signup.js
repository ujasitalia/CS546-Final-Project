import {axiosNoAuth} from './axios'

export const post = (data) => {
    return axiosNoAuth.post(``, data)
}