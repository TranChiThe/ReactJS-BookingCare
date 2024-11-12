import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Home extends Component {

    render() {
        const { isLoggedIn, roleId } = this.props;
        let linkToRedirect;
        if (isLoggedIn && roleId === 'R1') {
            linkToRedirect = isLoggedIn ? '/system/overview' : '/home';
        } else if (isLoggedIn && roleId === 'R2') {
            linkToRedirect = isLoggedIn ? '/doctor-manage/manage-schedule' : '/home';
        } else if (isLoggedIn && roleId === 'R4') {
            linkToRedirect = isLoggedIn ? '/staff-manage/doctor-schedule' : '/home';
        }
        // else if (!isLoggedIn || !roleId) {
        //     linkToRedirect = '/home'
        // }
        return (
            <Redirect to={linkToRedirect} />
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        roleId: state.auth.role
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
