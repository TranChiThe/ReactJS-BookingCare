import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
// import { FormattedMessage } from 'react-intl';
import './Login.scss';



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
        }
    }
    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
        // console.log(event.target.value)
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
        // console.log(event.target.value)
    }
    handleLogin = () => {
        console.log('Username:' + this.state.username)
        console.log('Password: ' + this.state.password)
    }

    handleShowhidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    render() {
        return (
            <div className='login-backround'>
                <div className='login-container'>
                    <div className='login-content'>
                        <div className='rol-12 text-login'>Login</div>
                        <div className='col-12 form group login-input'>
                            <label>Username:</label>
                            <input type='text' className='form-control '
                                placeholder='Enter your username'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)} />
                        </div>
                        <div className='col-12 form group login-input'>
                            <label>Password:</label>
                            <div className='custome-input-password'>
                                <input type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    onChange={(event) => this.handleOnChangePassword(event)} />
                                <span onClick={() => this.handleShowhidePassword()}>
                                    <i class={this.state.isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                                </span>

                            </div>
                        </div>
                        <div className='col-12 '>
                            <button
                                className='btn-login'
                                onClick={() => { this.handleLogin() }}>Login
                            </button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot you password?</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span className='text-other-login'>Or login with</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i class="fab fa-google-plus-g google"></i>
                            <i class="fab fa-facebook-f facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
