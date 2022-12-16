import {axiosAuth, axiosNoAuth} from './axios'

export const updateDoctor = (id, data) => {
    return axiosAuth.patch(`/doctor/${id}`, data);
}

export const getDoctor = (id) => {
    return axiosAuth.get(`/doctor/${id}`);
}

export const getDoctorSlot = (id, date) => {
    return axiosAuth.get(`/doctor/${id}/slot?date=`+date);
}

export const addPrescription = (doctorId,patientId, data) => {
    return axiosAuth.post(`/doctor/${doctorId}/patient/${patientId}/prescription`,data);
}

export const patchPrescription = (doctorId,patientId,data,prescriptionId ) => {
    return axiosAuth.patch(`/doctor/${doctorId}/patient/${patientId}/prescription/${prescriptionId}`,data);
}