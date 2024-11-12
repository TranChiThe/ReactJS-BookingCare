import actionTypes from '../actions/actionTypes';

const initialState = {
    accessToken: null,
    role: '',
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.token
            };
        case actionTypes.SET_USER_ROLE:
            return {
                ...state,
                role: action.role
            };
        default:
            return state;
    }
};

export default authReducer;
