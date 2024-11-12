import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '../../containers/Header/Header';
import DoctorManageSchedule from '../../containers/System/Doctor/ManageSchedule/DoctorManageSchedule'
import BusySchedule from '../../containers/System/Doctor/BusyScheduleManagement/BusySchedule'
import AppointmentManagement from '../../containers/System/Doctor/ManageAppointment/AppointmentManagement ';
class Schedule extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, roleId } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                {roleId === 'R2' &&
                    <div className="system-container">
                        <div className="system-list">
                            <Switch>
                                <Route path="/doctor-manage/manage-schedule" exact component={DoctorManageSchedule} />
                                <Route path="/doctor-manage/manage-busy-schedule" exact component={BusySchedule} />
                                <Route path="/doctor-manage/manage-appointment" exact component={AppointmentManagement} />
                            </Switch>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        roleId: state.auth.role
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
