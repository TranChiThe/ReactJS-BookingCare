import axios from "../axios"
import storeRedux from '../redux'
import instance from "../axios";
import { toast } from "react-toastify";

const handleLoginApi = async (email, password) => {
    try {
        let response = await axios.post('/api/login', { email, password });
        return response

    } catch (err) {
        console.log('error during login')
    }

}

const getAllUsers = async (userId, roleId, page, limit) => {
    try {
        // Validate userId
        if (!userId) {
            throw new Error('Invalid userId');
        }
        // Lấy token từ Redux store
        const state = storeRedux.getState();
        const token = state.auth.accessToken;
        let response = await axios.get('/api/get-all-users', {
            params: {
                id: userId,
                page: page,
                limit: limit,
                roleId: roleId
            },
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
};

const createNewUserService = (data) => {
    return axios.post(`/api/create-new-user`, data);
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}

const editUserService = (inputData) => {
    return axios.put(`/api/edit-user`, inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/get-allcode?type=${inputType}`);
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/get-doctor-home?limit=${limit}`)
}

const getAllDoctors = (specialtyId, clinicId) => {
    return axios.get(`/api/get-all-doctor?specialtyId=${specialtyId}&clinicId=${clinicId}`)
}

const saveDetailDoctorService = (data) => {
    return axios.post(`/api/save-infor-doctor`, data)
}

const updateDetailDoctorService = (data) => {
    return axios.post(`/api/update-infor-doctor`, data)
}

const deleteDetailDoctorService = (doctorId) => {
    return axios.delete(`/api/delete-infor-doctor?doctorId=${doctorId}`)
}

const getDetailInForDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId} &date=${date}`)
}

const getAllDoctorSchedule = () => {
    return axios.get(`/api/get-all-doctor-schedule`)
}

const getExtraInfoDoctorById = (doctorId, date) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data);
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data);
}

const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
}

const updateSpecialty = (data) => {
    return axios.post(`/api/update-specialty`, data);
}

const deleteSpecialty = (name) => {
    return axios.delete(`/api/delete-specialty?name=${name}`);
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-all-specialty`)
}

const getSpecialtyById = (data) => {
    return axios.get(`/api/get-specialty-by-id?id=${data.name}`)
}

const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.name}&location=${data.location}`)
}

const deleteDoctorSchedule = (timeType, status, date) => {
    return axios.delete(`api/delete-doctor-schedule?timeType=${timeType}&status=${status}&date=${date}`)
}

const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
}

const updateClinicInformation = (data) => {
    return axios.post(`/api/update-clinic-information`, data);
}

const getAllClinic = () => {
    return axios.get(`/api/get-all-clinic`)
}

const getAllDetailClinicById = (name) => {
    return axios.get(`/api/get-detail-clinic-by-id?name=${name}`)
}

const getAllDoctorSeeMore = () => {
    return axios.get(`/api/get-all-doctor-see-more`)
}

const filterDoctor = (specialtyId, clinicId) => {
    return axios.post(`/api/filter-doctor?specialtyId=${specialtyId}&clinicId=${clinicId}`)
}

const doctorSearch = (searchTerm, specialtyId, clinicId, page = 1, limit = 5) => {
    return axios.get(`/api/doctor-search?searchTerm=${searchTerm}&specialtyId=${specialtyId}&clinicId=${clinicId}&page=${page}&limit=${limit}`);
}

const getHomeSearch = (type, searchTerm) => {
    return axios.get(`/api/home-search?type=${type}&searchTerm=${searchTerm}`)
}

const getAppointmentByTime = (statusId, month, year) => {
    return axios.get(`/api/get-appointment-by-time?statusId=${statusId}&month=${month}&year=${year}`)
}

const getCountPatientByTime = (type, month, year) => {
    return axios.get(`/api/get-count-patient-by-time?type=${type}&month=${month}&year=${year}`)
}

const doctorBusySchedule = (data) => {
    return axios.post(`/api/busy-schedule`, data)
}

const getScheduleDoctorForWeek = (doctorId, weekNumber) => {
    return axios.get(`/api/get-schedule-for-week?doctorId=${doctorId}&weekNumber=${weekNumber}`)
}

const clinicDelete = (name) => {
    return axios.delete(`/api/clinic-delete?name=${name}`)
}

const getPatientAppointment = (doctorId, statusId, date, searchTerm, page = 1, limit = 5) => {
    return axios.get(`/api/get-patient-appointment?doctorId=${doctorId}&statusId=${statusId}&date=${date}&searchTerm=${searchTerm}&page=${page}&limit=${limit}`)
}

const postConfirmAppoitment = (appointmentId) => {
    return axios.put(`/api/post-confirm-appointment?id=${appointmentId}`)
}

const postCancelAppointment = (appointmentId) => {
    return axios.put(`/api/post-cancel-appointment?id=${appointmentId}`)
}

const getAllPatientAppointment = (email, recordId) => {
    return axios.get(`/api/get-all-patient-appointment?email=${email}&recordId=${recordId}`)
}

const getDashBoardInfo = (type) => {
    return axios.get(`/api/get-dashboard-info?type=${type}`)
}

const getSystemCode = (page = 1, limit = 15) => {
    return axios.get(`/api/get-system-code?page=${page}&limit=${limit}`)
}

const addSystemCode = (data) => {
    return axios.post(`/api/add-system-code`, data)
}

const editSystemCode = (data) => {
    return axios.post(`/api/edit-system-code`, data)
}

const deleteSystemCode = (id) => {
    return axios.delete(`/api/delete-system-code?id=${id}`)
}
export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorService,
    getDetailInForDoctor,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    getAllDoctorSchedule,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    postPatientBookAppointment,
    postVerifyBookAppointment,
    createNewSpecialty,
    updateSpecialty,
    getAllSpecialty,
    getSpecialtyById,
    getAllDetailSpecialtyById,
    deleteDoctorSchedule,
    createNewClinic,
    updateClinicInformation,
    getAllClinic,
    getAllDetailClinicById,
    getAllDoctorSeeMore,
    filterDoctor,
    doctorSearch,
    getHomeSearch,
    getAppointmentByTime,
    getCountPatientByTime,
    doctorBusySchedule,
    getScheduleDoctorForWeek,
    clinicDelete,
    deleteSpecialty,
    updateDetailDoctorService,
    deleteDetailDoctorService,
    getPatientAppointment,
    postConfirmAppoitment,
    postCancelAppointment,
    getAllPatientAppointment,
    getDashBoardInfo,
    getSystemCode,
    addSystemCode,
    editSystemCode,
    deleteSystemCode
}