import {axiosAuth} from './axios'

export const getAllDoctor = () => {
    return axiosAuth.get(`/doctor`);
}

export const getDoctor = (id) => {
    return axiosAuth.get(`/doctor/${id}`);
}

export const getAllDoctorReview = (id) => {
    return axiosAuth.get(`/doctor/${id}/review`);
}