import { flatMap } from 'lodash';
import actionTypes from '../actions/actionTypes';


const initialState = {
    isLoadingGender: false,
    isLoadingPosition: false,
    isLoadingRole: false,
    genders: [],
    roles: [],
    positions: [],
    specialties: [],
    filterSearch: [],
    users: [],
    topDoctor: [],
    allDoctors: [],
    detailDoctor: [],
    allScheduleTime: [],
    bulkScheduleDoctor: [],
    allRequiredDoctorInfo: [],
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    data: [],
    loading: false,
    success: false,
    missing: false,
    error: null,
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let copyState = { ...state };
            copyState.isLoadingGender = true;
            return {
                ...copyState
            }

        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;
            return {
                ...state
            }

        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false;
            state.isLoadingGender = [];
            return {
                ...state
            }

        case actionTypes.FETCH_POSITION_START:
            state.isLoadingPosition = true;
            return {
                ...state
            }

        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            state.isLoadingPosition = false;
            return {
                ...state
            }

        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];
            state.isLoadingPosition = false;
            return {
                ...state
            }

        case actionTypes.FETCH_ROLE_START:
            state.isLoadingRole = true;
            return {
                ...state
            }

        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            state.isLoadingRole = false;
            return {
                ...state
            }

        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            state.isLoadingRole = false;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.data = action.payload.data;
            state.totalRecords = action.payload.totalRecords
            state.totalPages = action.payload.totalPages
            state.currentPage = action.payload.currentPage
            return {
                ...state

            }

        case actionTypes.FETCH_ALL_USER_FAILED:
            state.users = [];
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            state.topDoctor = action.dataDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTOR_FAILED:
            state.topDoctor = []
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            state.allDoctors = action.dataDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTOR_FAILED:
            state.allDoctors = []
            return {
                ...state
            }

        case actionTypes.FETCH_DETAIL_INFOR_DOCTOR_SUCCESS:
            state.detailDoctor = action.dataDetailDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_DETAIL_INFOR_DOCTOR_FAILED:
            state.detailDoctor = []
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            state.allScheduleTime = action.dataTime
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            state.allScheduleTime = []
            return {
                ...state
            }

        case actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_SUCCESS:
            state.bulkScheduleDoctor = action.scheduleDoctor
            return {
                ...state
            }

        case actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_FAILED:
            state.bulkScheduleDoctor = []
            return {
                ...state
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START:
            state.allRequiredDoctorInfo = [];
            return {
                ...state
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS:
            state.allRequiredDoctorInfo = action.data;
            return {
                ...state
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED:
            state.allRequiredDoctorInfo = [];
            return {
                ...state
            }


        case actionTypes.FETCH_SPECIALTY_START:
            state.specialties = [];
            return {
                ...state
            }

        case actionTypes.FETCH_SPECIALTY_SUCCESS:
            state.specialties = action.data;
            return {
                ...state
            }

        case actionTypes.FETCH_SPECIALTY_FAILED:
            return {
                ...state
            }

        case actionTypes.FETCH_FILTER_SEARCH_START:
            state.filterSearch = [];
            return {
                ...state
            }

        case actionTypes.FETCH_FILTER_SEARCH_SUCCESS:
            state.filterSearch = action.data;
            return {
                ...state
            }

        case actionTypes.FETCH_FILTER_SEARCH_FAILED:
            return {
                ...state
            }
        ///
        case actionTypes.FETCH_SAVE_DETAIL_DOCTOR_START:
            return {
                ...state,
                loading: true,
                success: false,
                missing: false,
                error: null,
            };
        case actionTypes.FETCH_SAVE_DETAIL_DOCTOR_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                missing: false,
                error: null,
            };
        case actionTypes.FETCH_SAVE_DETAIL_DOCTOR_MISSING:
            return {
                ...state,
                loading: false,
                success: false,
                missing: true,
                error: action.payload?.message || null,
            };
        case actionTypes.FETCH_SAVE_DETAIL_DOCTOR_FAILED:
            return {
                ...state,
                loading: false,
                success: false,
                missing: false,
                error: action.payload?.message || 'Something went wrong',
            };
        case actionTypes.RESET_STATE:
            return {
                ...state,
                loading: true,
                success: false,
                missing: false,
                error: null,
            };

        ////
        case actionTypes.SAVE_SPECIALTY_INFO_START:
            return {
                ...state,
                loading: true,
                success: false,
                missing: false,
                error: null,
            };
        case actionTypes.SAVE_SPECIALTY_INFO_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                missing: false,
                error: null,
            };
        case actionTypes.SAVE_SPECIALTY_INFO_MISSING:
            return {
                ...state,
                loading: false,
                success: false,
                missing: true,
                error: action.payload?.message || null,
            };
        case actionTypes.SAVE_SPECIALTY_INFO_FAILED:
            return {
                ...state,
                loading: false,
                success: false,
                missing: false,
                error: action.payload?.message || 'Something went wrong',
            };

        default:
            return state;
    }
}

export default adminReducer;