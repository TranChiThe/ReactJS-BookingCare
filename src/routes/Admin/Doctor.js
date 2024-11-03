import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '../../containers/Header/Header';
import AdminScheduleManage from '../../containers/System/Admin/Doctor/AdminScheduleManage'
import Unauthorized from '../Unauthorized';
import { userHasRole } from '../../hoc/authentication'
class Doctor extends Component {
    render() {
        const { isLoggedIn, roleId } = this.props;
        console.log('check role: ', roleId, isLoggedIn)
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                {roleId === 'R1' &&
                    <div className="system-container">
                        <div className="system-list">
                            <Switch>
                                <Route path="/doctor/manage-schedule" exact component={AdminScheduleManage} />
                                <Route component={() => <Redirect to="/unauthorized" />} />
                            </Switch>
                        </div>
                    </div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);


