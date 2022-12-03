import {axiosAuth} from './axios'

export const getDoctorAppointment = (id) => {
    return axiosAuth.get(`/doctor/${id}/appointment`);
}