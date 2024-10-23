import axios from 'axios';
import _ from 'lodash';
import reduxStore from './redux.js'
import { setAccessToken, setUserRole } from './store/actions/authActions';
import { jwtDecode } from "jwt-decode";
require('dotenv').config();


const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true
});


// New Code
let isTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true;
    }
};

// Xử lý ký tự escape trong token
const sanitizeToken = (token) => {
    return token.replace(/^"|"$/g, '');  // Loại bỏ ký tự escape đầu và cuối
};

// Cập nhật role từ token
let updateUserRole = (token) => {
    try {
        const sanitizedToken = sanitizeToken(token);
        const decodedToken = jwtDecode(sanitizedToken);
        const role = decodedToken.roleId;
        reduxStore.dispatch(setUserRole(role));
    } catch (error) {
        console.error('Failed to decode token:', error);
    }
};

let refreshAccessToken = async () => {
    try {
        const response = await axios.post(`http://localhost:8080/api/refresh-token`, {}, { withCredentials: true });
        const { access_token } = response.data;
        console.log('check response: ', response);
        reduxStore.dispatch(setAccessToken(access_token));  // Cập nhật accessToken trong Redux
        return access_token;
    } catch (error) {
        console.error('New AccessToken fails:', error);
        throw error;
    }
};

// Request interceptor để thêm accessToken vào header
instance.interceptors.request.use(
    (config) => {
        const state = reduxStore.getState();
        const token = state.auth.accessToken;
        if (token) {
            config.headers['token'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để lưu access_token vào Redux và xử lý lỗi
instance.interceptors.response.use(
    (response) => {
        const { data } = response;
        if (data && data.access_token) {
            // Lưu access_token vào Redux
            const sanitizedToken = sanitizeToken(data.access_token);
            reduxStore.dispatch(setAccessToken(sanitizedToken));
            updateUserRole(sanitizedToken);
        }
        return data;  // Trả về dữ liệu response
    },
    async (error) => {
        let originalRequest = error.config;
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            let state = reduxStore.getState();
            let currentToken = state.auth.accessToken;

            if (currentToken && isTokenExpired(currentToken)) {
                try {
                    let newAccessToken = await refreshAccessToken();
                    originalRequest.headers['token'] = `Bearer ${newAccessToken}`;
                    return instance(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);



export default instance;
