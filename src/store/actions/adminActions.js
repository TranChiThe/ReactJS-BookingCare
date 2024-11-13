import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService,
    getAllUsers, deleteUserService,
    editUserService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctorService,
    getDetailInForDoctor, saveBulkSacheduleDoctor,
    getAllSpecialty, createNewSpecialty,
    getAllClinic
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
                dispatch(fetchGenderFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed());
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_START })
            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (e) {
            dispatch(fetchPositionFailed());
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START })
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                dispatch(saveUserSuccess());
                dispatch(fetchAllUserStart())
            } else {
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed());
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const fetchAllUserStart = (roleId, page = 1, limit = 10) => {
    return async (dispatch) => {
        try {
            let res = await getAllUsers("All", roleId, page, limit);
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.data, res.totalRecords, res.totalPages, page));
            } else {
                dispatch(fetchAllUserFailed());
            }
        } catch (e) {
            dispatch(fetchAllUserFailed());
        }
    }
}

export const fetchAllUserSuccess = (data, totalRecords, totalPages, currentPage) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    payload: {
        data,
        totalRecords,
        totalPages,
        currentPage,
    },
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})

export const fetchDeleteUserStart = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                dispatch(fetchDeleteUserSuccess());
                dispatch(fetchAllUserStart())
            } else {
                dispatch(fetchDeleteUserFailed());
            }
        } catch (e) {
            dispatch(fetchDeleteUserFailed());
        }
    }
}

export const fetchDeleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const fetchDeleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const fetchEditUserStart = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                dispatch(fetchEditUserSuccess());
                dispatch(fetchAllUserStart())
            } else {
                dispatch(fetchEditUserFailed());
            }
        } catch (e) {
            dispatch(fetchEditUserFailed());
        }
    }
}

export const fetchEditUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const fetchEditUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
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
            console.log('FETCH_TOP_DOCTOR_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
            })
        }
    }
}

export const fetchAllDoctorStart = (specialtyId, clinicId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors(specialtyId, clinicId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
                    dataDoctor: res.data
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_DOCTOR_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
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
                    type: actionTypes.FETCH_DETAIL_INFOR_DOCTOR_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_DETAIL_INFOR_DOCTOR_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_DETAIL_INFOR_DOCTOR_FAILED,
            })
        }
    }
}

export const resetState = () => ({
    type: actionTypes.RESET_STATE,
});

export const saveDetailInforDoctor = (data) => {
    return async (dispatch) => {
        dispatch({
            type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_START,
        });
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_SUCCESS,
                });
            } else if (res && res.errCode === 1) {
                dispatch({
                    type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_MISSING,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_FAILED,
            });
        }
    };
};

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
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
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
                    type: actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_FAILED,
                })
            }
        } catch (e) {
            console.log('BULK_CREATE_SCHEDULE_DOCTOR_FAILED: ', e)
            dispatch({
                type: actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_FAILED,
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
            let resClinic = await getAllCodeService('CLINIC');
            let alreadyClinic = await getAllClinic()

            if (resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0 &&
                resSpecialty && resSpecialty.errCode === 0 &&
                resClinic && resClinic.errCode === 0 &&
                alreadyClinic && alreadyClinic.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data,
                    alreadyClinic: alreadyClinic.data
                }
                dispatch(fetchRequiredDoctorInfoSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInfoFailed());
            }
        } catch (e) {
            dispatch(fetchRequiredDoctorInfoFailed());
        }
    }
}

export const fetchRequiredDoctorInfoSuccess = (allRequired) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
    data: allRequired
})

export const fetchRequiredDoctorInfoFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED
})

export const fetchSpecialtyStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_SPECIALTY_START })
            let res = await getAllCodeService("SPECIALTY");
            if (res && res.errCode === 0) {
                dispatch(fetchSpecialtySuccess(res.data));
            } else {
                dispatch(fetchSpecialtyFailed());
            }
        } catch (e) {
            dispatch(fetchSpecialtyFailed());
        }
    }
}

export const fetchSpecialtySuccess = (specialtyData) => ({
    type: actionTypes.FETCH_SPECIALTY_SUCCESS,
    data: specialtyData
})

export const fetchSpecialtyFailed = () => ({
    type: actionTypes.FETCH_SPECIALTY_FAILED
})

export const saveSpecialtyInfo = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewSpecialty(data);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.SAVE_SPECIALTY_INFO_SUCCESS,
                })
            } else if (res && res.errCode === 1) {
                dispatch({
                    type: actionTypes.SAVE_SPECIALTY_INFO_MISSING,
                })
            }
        } catch (e) {
            console.log('SAVE_SPECIALTY_INFO_FAILED: ', e)
            dispatch({
                type: actionTypes.SAVE_SPECIALTY_INFO_FAILED,
            })
        }
    }
}

export const fetchFilterSearchStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_FILTER_SEARCH_START })
            let res = await getAllCodeService("FILTER");
            if (res && res.errCode === 0) {
                dispatch(fetchFilterSearchSuccess(res.data));
            } else {
                dispatch(fetchFilterSearchFailed());
            }
        } catch (e) {
            dispatch(fetchFilterSearchFailed());
        }
    }
}

export const fetchFilterSearchSuccess = (filterSearchData) => ({
    type: actionTypes.FETCH_FILTER_SEARCH_SUCCESS,
    data: filterSearchData
})

export const fetchFilterSearchFailed = () => ({
    type: actionTypes.FETCH_FILTER_SEARCH_FAILED
})