import {axiosAuth} from './axios'

export const getPatient = (id) => {
    return axiosAuth.get(`/patient/${id}`);
}