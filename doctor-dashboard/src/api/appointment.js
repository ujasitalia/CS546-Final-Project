import {axiosAuth} from './axios'

export const getDoctorAppointment = (id) => {
    return axiosAuth.get(`/doctor/${id}/appointment`);
}

export const getAppointmentById = (id) => {
    return axiosAuth.get(`/appointment/${id}`)
}

export const getAvailableSlots = (data) => {
    return axiosAuth.get(`/appointment/slots/${data.doctorId}&${data.day}&${data.date}`)
}

export const updateAppointment = (id, data) => {
    return axiosAuth.patch(`/appointment/${id}`, {data:data})
}

export const deleteAppointment = (id) => {
    return axiosAuth.delete(`/appointment/${id}`)
}