import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserRedux from '../../containers/System/Admin/Account/UserRedux';
import ManageDoctor from '../../containers/System/Admin/ManageDoctor';
import Header from '../../containers/Header/Header';
import ManageSpecialty from '../../containers/System/Admin/Specialty/ManageSpecialty';
import ManageClinic from '../../containers/System/Admin/Clinic/ManageClinic';
import ManageClinicInfo from '../../containers/System/Admin/Clinic/ManageClinicInfo';
import StatisticalChart from '../../containers/System/Admin/Home/Char/StatisticalChart'
import AdminDashboard from '../../containers/System/Admin/Home/DashBoard/AdminDashboard'
import ManageSystemCode from '../../containers/System/Admin/SystemCode/ManageSystemCode'
import PatientAppoinment from '../../containers/System/Admin/Patient/PatientAppoinment';
import Comment from '../../containers/System/Staff/Comment/ManageComment';
class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, roleId } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                {roleId === "R1" &&
                    <div className="system-container">
                        <div className="system-list">
                            <Switch>
                                <Route path="/system/overview" component={AdminDashboard} />
                                <Route path="/system/statistical-chart" component={StatisticalChart} />
                                <Route path="/system/system-code" component={ManageSystemCode} />
                                <Route path="/system/manage-user" component={UserRedux} />
                                <Route path="/system/manage-doctor" component={ManageDoctor} />
                                <Route path="/system/manage-patient-appointment" component={PatientAppoinment} />
                                <Route path="/system/manage-patient-comment" component={Comment} />
                                <Route path="/system/manage-specialty" component={ManageSpecialty} />
                                <Route path="/system/manage-clinic" component={ManageClinic} />
                                <Route path="/system/manage-clinic-information" component={ManageClinicInfo} />
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

export default connect(mapStateToProps, mapDispatchToProps)(System);
