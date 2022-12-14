import {axiosAuth} from './axios'

export const getDoctorAppointment = (id) => {
    return axiosAuth.get(`/doctor/${id}/appointment`);
}

export const getAppointmentById = (id) => {
    return axiosAuth.get(`/appointment/${id}`)
}

export const updateAppointment = (id, data) => {
    return axiosAuth.patch(`/appointment/${id}`, {data:data})
}

export const createAppointment = (data) => {
    return axiosAuth.post('/appointment', data)
}

export const deleteAppointment = (id) => {
    return axiosAuth.delete(`/appointment/${id}`)
}