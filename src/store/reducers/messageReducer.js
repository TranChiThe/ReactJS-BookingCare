import actionTypes from '../actions/actionTypes';

// Khởi tạo state ban đầu
const initialState = {
    messages: [],
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_MESSAGE:
            return {
                ...state,
                messages: [...(state.messages || []), action.payload],
            };
        case actionTypes.CLEAR_MESSAGE:
            return {
                ...state,
                messages: []
            };

        case actionTypes.LOAD_MESSAGE:
            return {
                ...state,
                messages: action.payload,
            };

        default:
            return state;
    }
};

export default chatReducer