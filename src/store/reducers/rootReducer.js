import { combineReducers } from 'redux'; // Kết hợp nhiều reducer thành 1 reducer
import { connectRouter } from 'connected-react-router'; // Tọa reducer cho router history

import appReducer from "./appReducer";
import userReducer from "./userReducer";
import adminReducer from './adminReducer';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist'; // Lưu trữ và khôi phục trạng thái redux
import authReducer from './authReducer';
import darkModeReducer from './darkModeReducer';
import messageReducer from './messageReducer'

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
    ...persistCommonConfig,
    key: 'user',
    whitelist: ['isLoggedIn', 'userInFo']
};

const appPersistConfig = {
    ...persistCommonConfig,
    key: 'app',
    whitelist: ['language']
}

const authPersistConfig = {
    ...persistCommonConfig,
    key: 'auth',
    whitelist: ['accessToken', 'role']
}

const darkModePersistConfig = {
    ...persistCommonConfig,
    key: 'darkMode',
    whitelist: ['isDarkMode']
}

const addMessagePersistConfig = {
    ...persistCommonConfig,
    key: 'chat',
    whitelist: ['messages']
}

export default (history) => combineReducers({
    router: connectRouter(history),
    user: persistReducer(userPersistConfig, userReducer),
    app: persistReducer(appPersistConfig, appReducer),
    admin: adminReducer,
    auth: persistReducer(authPersistConfig, authReducer),  // Add authReducer to combineReducers
    darkMode: persistReducer(darkModePersistConfig, darkModeReducer),
    chat: persistReducer(addMessagePersistConfig, messageReducer)


})