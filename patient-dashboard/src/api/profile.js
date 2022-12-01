import {axiosNoAuth} from './axios'

export const get = (data) => {
    return axiosNoAuth.get(`/:patientId`, data)
}

export const patch = (id,data) => {
    return axiosNoAuth.patch(`/${id}`, data)
}