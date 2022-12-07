import {axiosAuth} from './axios'

export const updateDoctor = (id, data) => {
    return axiosAuth.patch(`/doctor/${id}`, data);
}

export const getDoctor = (id) => {
    return axiosAuth.get(`/doctor/${id}`);
}

export const getDoctorSlot = (id, date) => {
    return axiosAuth.get(`/doctor/${id}/slot?date=`+date);
}