import {axiosAuth} from './axios'

export const getPatientAppointments = (id) => {
    return axiosAuth.get(`/patient/${id}/appointment`);
}