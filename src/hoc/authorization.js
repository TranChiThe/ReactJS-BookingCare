import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


const withAuthorization = (WrappedComponent, allowedRoles) => {
    class WithAuthorization extends React.Component {
        render() {
            const { isLoggedIn, role } = this.props;
            if (!isLoggedIn) {
                return <Redirect to="/login" />;
            }

            if (!allowedRoles.includes(role)) {
                return <Redirect to="/unauthorized" />;
            }

            return <WrappedComponent {...this.props} />;
        }
    }

    const mapStateToProps = state => ({
        isLoggedIn: state.user.isLoggedIn,
        role: state.auth.role,
    });

    return connect(mapStateToProps)(WithAuthorization);
};

export default withAuthorization;
