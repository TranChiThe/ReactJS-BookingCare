import { logger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import { createStore, applyMiddleware, compose } from 'redux';
import { createStateSyncMiddleware } from 'redux-state-sync';
import { persistStore } from 'redux-persist';

import createRootReducer from './store/reducers/rootReducer';
import actionTypes from './store/actions/actionTypes';

const environment = process.env.NODE_ENV || "development";
let isDevelopment = environment === "development";

//hide redux logs
isDevelopment = false;


export const history = createBrowserHistory({ basename: process.env.REACT_APP_ROUTER_BASE_NAME });

// Các hành động được đồng bộ hóa giữa các tab
const reduxStateSyncConfig = {
    whitelist: [
        actionTypes.APP_START_UP_COMPLETE,
    ]
}

// Tạo lịch sử quản lý các thay đổi trong URL
const rootReducer = createRootReducer(history);

// Danh sách các middleware được áp dụng
const middleware = [
    routerMiddleware(history),
    thunkMiddleware,
    createStateSyncMiddleware(reduxStateSyncConfig),
]

if (isDevelopment) middleware.push(logger);

const composeEnhancers = (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const reduxStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware)),
)

// Gửi các hành động đến bất kỳ đâu trong ứng dụng
export const dispatch = reduxStore.dispatch;

// Quản lý việc lưu trữ và khôi phục trạng thái của redux được lưu trong storage
export const persistor = persistStore(reduxStore);

export default reduxStore;