import actionTypes from './actionTypes';

export const addMessage = (messages) => ({
    type: actionTypes.ADD_MESSAGE,
    payload: messages
});

export const clearMessages = () => ({
    type: actionTypes.CLEAR_MESSAGE,
    // localStorage.removeItem('messages');

});

export const loadMessages = (messages) => ({
    type: actionTypes.LOAD_MESSAGE,
    payload: messages
});