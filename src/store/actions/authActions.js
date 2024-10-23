import actionTypes from './actionTypes';

export const setAccessToken = (token) => ({
    type: actionTypes.SET_ACCESS_TOKEN,
    token
});

export const setUserRole = (role) => ({
    type: actionTypes.SET_USER_ROLE,
    role
});