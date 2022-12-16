import {axiosAuth} from './axios'

export const getPatientAppointments = (id) => {
    return axiosAuth.get(`/patient/${id}/appointment`);
}

export const getPatient = (id) =>{
    return axiosAuth.get(`/patient/${id}`);
}

export const getPatientPrescriptions = (patientId) =>{
    return axiosAuth.get(`/patient/${patientId}/prescription`)
}

export const getPatientTestReports = (patientId) =>{
    return axiosAuth.get(`/patient/${patientId}/testReport`)
}