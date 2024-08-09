import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService,
    getAllUsers, deleteUserService,
    editUserService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctorService,
    getDetailInForDoctor, saveBulkSacheduleDoctor,
    getAllSpecialty,
} from '../../services/userService';
import { toast } from 'react-toastify';

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFaided());
            }
        } catch (e) {
            dispatch(fetchGenderFaided());
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFaided = () => ({
    type: actionTypes.FETCH_GENDER_FAILDED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_START })
            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFaided());
            }
        } catch (e) {
            dispatch(fetchPositionFaided());
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFaided = () => ({
    type: actionTypes.FETCH_POSITION_FAILDED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START })
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFaided());
            }
        } catch (e) {
            dispatch(fetchRoleFaided());
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFaided = () => ({
    type: actionTypes.FETCH_ROLE_FAILDED
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new user succed!")
                dispatch(saveUserSuccess());
                dispatch(fetchAllUserStart())
            } else {
                dispatch(saveUserFailded());
            }
        } catch (e) {
            dispatch(saveUserFailded());
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailded = () => ({
    type: actionTypes.CREATE_USER_FAILDED
})

export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try {
            // dispatch({ type: actionTypes. })
            let res = await getAllUsers("All");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users));
            } else {
                toast.error("Fetch all user error!")
                dispatch(fetchAllUserFaided());
            }
        } catch (e) {
            toast.error("Fetch all user error!")
            dispatch(fetchAllUserFaided());
        }
    }
}

export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data,
})

export const fetchAllUserFaided = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILDED
})

export const fetchDeleteUserStart = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the user succed!")
                dispatch(fetchDeleteUserSuccess());
                dispatch(fetchAllUserStart())
            } else {
                toast.error("Delete the user error!")
                dispatch(fetchDeleteUserFailded());
            }
        } catch (e) {
            toast.error("Delete the user error!")
            dispatch(fetchDeleteUserFailded());
        }
    }
}

export const fetchDeleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const fetchDeleteUserFailded = () => ({
    type: actionTypes.DELETE_USER_FAILDED
})

export const fetchEditUserStart = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                toast.success("Update the user succed!")
                dispatch(fetchEditUserSuccess());
                dispatch(fetchAllUserStart())
            } else {
                toast.error("Update the user error!")
                dispatch(fetchEditUserFailded());
            }
        } catch (e) {
            toast.error("Update the user error!")
            dispatch(fetchEditUserFailded());
        }
    }
}

export const fetchEditUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const fetchEditUserFailded = () => ({
    type: actionTypes.EDIT_USER_FAILDED
})

export const fetchTopDoctorStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    dataDoctor: res.data
                })
            }
        } catch (e) {
            console.log('FETCH_TOP_DOCTOR_FAILDED: ', e)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTOR_FAILDED,
            })
        }
    }
}

export const fetchAllDoctorStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
                    dataDoctor: res.data
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_DOCTOR_FAILDED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTOR_FAILDED,
            })
        }
    }
}

export const fetchDetailInforDoctorStart = (doctorId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailInForDoctor(doctorId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_INFOR_DOCTOR_SUCCESS,
                    dataDetailDoctor: res.data
                })
            }
            else {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_INFOR_DOCTOR_FAILDED,
                })
            }
        } catch (e) {
            console.log('FETCH_DETAIL_INFOR_DOCTOR_FAILDED: ', e)
            dispatch({
                type: actionTypes.FETCH_DETAIL_INFOR_DOCTOR_FAILDED,
            })
        }
    }
}

export const saveDetailInforDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.success('Save detail infor doctor succeed!')
                dispatch({
                    type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            } else if (res && res.errCode === 1) {
                toast.error('Missing parameter!')
            }
        } catch (e) {
            console.log('FETCH_SAVE_DETAIL_DOCTOR_FAILDED: ', e)
            toast.error(`Can't save infor doctor`)
            dispatch({
                type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_FAILDED,
            })
        }
    }
}

export const fetchScheduleHoursStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            }
            else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILDED,
                })
            }
        } catch (e) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILDED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILDED,
            })
        }
    }
}

export const saveBulkScheduleDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveBulkScheduleDoctor(data);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_SUCCESS,
                    scheduleDoctor: res.data
                })
            }
            else {
                dispatch({
                    type: actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_FAILDED,
                })
            }
        } catch (e) {
            console.log('BULK_CREATE_SCHEDULE_DOCTOR_FAILDED: ', e)
            dispatch({
                type: actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_FAILDED,
            })
        }
    }
}

export const fetchAllRequiredDoctorStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START })
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialty();
            if (resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0 &&
                resSpecialty && resSpecialty.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data
                }
                dispatch(fetchRequiredDoctorInfoSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInfoFailded());
            }
        } catch (e) {
            dispatch(fetchRequiredDoctorInfoFailded());
        }
    }
}

export const fetchRequiredDoctorInfoSuccess = (allRequired) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
    data: allRequired
})

export const fetchRequiredDoctorInfoFailded = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILDED
})

