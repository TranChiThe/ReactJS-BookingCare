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

        case actionTypes.FETCH_GENDER_FAILDED:
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

        case actionTypes.FETCH_POSITION_FAILDED:
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

        case actionTypes.FETCH_ROLE_FAILDED:
            state.roles = [];
            state.isLoadingRole = false;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.users = action.users;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_USER_FAILDED:
            state.users = [];
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            state.topDoctor = action.dataDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTOR_FAILDED:
            state.topDoctor = []
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            state.allDoctors = action.dataDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTOR_FAILDED:
            state.allDoctors = []
            return {
                ...state
            }

        case actionTypes.FETCH_DETAIL_INFOR_DOCTOR_SUCCESS:
            state.detailDoctor = action.dataDetailDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_DETAIL_INFOR_DOCTOR_FAILDED:
            state.detailDoctor = []
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            state.allScheduleTime = action.dataTime
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILDED:
            state.allScheduleTime = []
            return {
                ...state
            }

        case actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_SUCCESS:
            state.bulkScheduleDoctor = action.scheduleDoctor
            return {
                ...state
            }

        case actionTypes.BULK_CREATE_SCHEDULE_DOCTOR_FAILDED:
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

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILDED:
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

        case actionTypes.FETCH_SPECIALTY_FAILDED:
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

        default:
            return state;
    }
}

export default adminReducer;