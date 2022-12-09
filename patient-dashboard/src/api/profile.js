import {axiosNoAuth} from './axios'

export const get = (data) => {
    return axiosNoAuth.get(`/:patientId`, data)
}

export const patch = (id,data) => {
    return axiosNoAuth.patch(`/${id}`, data)
}

export const patchMedicalHistory = (patientId,data,medicalHistoryId) => {
    return axiosNoAuth.patch(`/${patientId}/medicalHistory/${medicalHistoryId}`, data)
}