import {axiosAuth} from './axios'

export const getPatient = (id) => {
    return axiosAuth.get(`/doctor/${JSON.parse(localStorage.getItem('id'))}/patient/${id}`);
}