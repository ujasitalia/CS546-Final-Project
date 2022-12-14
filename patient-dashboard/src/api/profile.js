import {axiosAuth, axiosNoAuth} from './axios'

export const get = (patientId) => {
    return axiosAuth.get(`/patient/${patientId}`)
}
export const getDoctor = (doctorId) => {
    return axiosAuth.get(`/doctor/${doctorId}`)
}
export const patch = (id,data) => {
    return axiosAuth.patch(`/patient/${id}`, data)
}

export const patchMedicalHistory = (patientId,data,medicalHistoryId) => {
    return axiosAuth.patch(`/patient/${patientId}/medicalHistory/${medicalHistoryId}`, data)
}
export const addMedicalHistory = (patientId,data) => {
    return axiosAuth.post(`/patient/${patientId}/medicalHistory/`, data)
}
export const addTestReports = (patientId,data) => {
    return axiosAuth.post(`/patient/${patientId}/testReport`, data)
}
export const patchTestReports = (patientId,data,testReportId) => {
    return axiosAuth.patch(`/patient/${patientId}/testReport/${testReportId}`, data)
}
