import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '../../containers/Header/Header';
import AdminScheduleManage from '../../containers/System/Admin/Doctor/AdminScheduleManage';
import ManageDoctor from '../../containers/System/Admin/ManageDoctor';
import StatisticalChart from '../../containers/System/Admin/Home/Char/StatisticalChart';
import AppointmentManagement from '../../containers/System/Staff/Patient/AppointmentManagement ';
import Comment from '../../containers/System/Staff/Comment/ManageComment';
class StaffManagement extends Component {
    render() {
        const { isLoggedIn, roleId } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                {roleId === "R4" &&
                    <div className="system-container">
                        <div className="system-list">
                            <Switch>
                                <Route path="/staff-manage/statistical-chart" component={StatisticalChart} />
                                <Route path="/staff-manage/doctor-schedule" exact component={AdminScheduleManage} />
                                <Route path="/staff-manage/manage-doctor-infomation" exact component={ManageDoctor} />
                                <Route path="/staff-manage/manage-patient-appointment" component={AppointmentManagement} />
                                <Route path="/staff-manage/manage-patient-comment" component={Comment} />
                                <Route component={() => { return (<Redirect to='/unauthorized' />) }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(StaffManagement);
