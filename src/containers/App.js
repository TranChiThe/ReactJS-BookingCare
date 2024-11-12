import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated, userHasRole } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Admin/Home.js';
import Login from './Auth/Login';
import Header from './Header/Header';
import System from '../routes/Admin/System.js';
import HomePage from './HomePage/HomePage.js'
import CustomScrollbars from '../components/CustomScrollbars.js';
import { CustomToastCloseButton } from '../components/CustomToast.js';
import ScrollBars from '../components/ScrollBars.js';
import DetailDoctor from '../containers/Patient/Doctor/DetailDoctor.js'
import Doctor from '../routes/Admin/Doctor.js';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty.js';
import VerifyEmail from './Patient/EmailVerify/VerifyEmail.js';
import DoctorManagement from '../routes/Doctor/DoctorManagement.js'
import Staff from '../routes/Staff/StaffManagement.js';
import DetailClinic from './Patient/Clinic/DetailClinic.js';
import AllSpecialty from './Patient/Specialty/AllSpecialty.js'
import SearchBar from './Patient/SearchBar/SearchBar.js';
import HomeSearch from './Patient/HomePage/HomeSearch.js'
import Unauthorized from '../routes/Unauthorized.js'
import Support from './Patient/Support/Support.js'


class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                {/* history: lưu lại lịch sử đăng nhập từ các input khi load lại trang */}
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                {/* <ScrollBars> */}
                                <Switch>
                                    {/* Admin router */}
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path={path.DOCTOR} component={userIsAuthenticated(Doctor)} />
                                    <Route path="/unauthorized" component={Unauthorized} />

                                    {/* Doctor router */}
                                    <Route path={path.DOCTOR_MANAGE} component={userIsAuthenticated(DoctorManagement)} />

                                    {/* Staff router */}
                                    <Route path={path.STAFF_MANAGE} component={userIsAuthenticated(Staff)} />

                                    {/* User router */}
                                    <Route path={path.HOMEPAGE} component={(HomePage)} />
                                    <Route path={path.DETAIL_DOCTOR} component={(DetailDoctor)} />
                                    <Route path={path.DETAIL_SPECIALTY} component={(DetailSpecialty)} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={(VerifyEmail)} />
                                    <Route path={path.DETAIL_CLINIC} component={(DetailClinic)} />
                                    <Route path={path.ALL_SPECIALTY} component={(AllSpecialty)} />
                                    <Route path={path.ALL_DOCTORS} component={(SearchBar)} />
                                    <Route path={path.HOME_SEARCH} component={(HomeSearch)} />
                                    <Route path={path.SUPPORT} component={(Support)} />
                                    <Route component={() => <Redirect to="/unauthorized" />} />

                                </Switch>
                            </CustomScrollbars>
                            {/* </ScrollBars> */}
                        </div>

                        {/* <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        /> */}

                        <ToastContainer
                            position="bottom-right"
                            autoClose={2000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </div>
                </Router>
            </Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


