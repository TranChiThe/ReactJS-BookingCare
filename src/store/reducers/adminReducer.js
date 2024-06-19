import actionTypes from '../actions/actionTypes';


const initialState = {
    isLoadingGender: false,
    isLoadingPosition: false,
    isLoadingRole: false,
    genders: [],
    roles: [],
    positions: []
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
        default:
            return state;
    }
}

export default adminReducer;