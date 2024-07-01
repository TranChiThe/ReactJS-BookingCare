import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { handleLoginApi } from "../../services/userService";
import * as actions from "../../store/actions";
import './Login.scss';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
        }
    }
    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                console.log('login succed')
                // console.log('check user login succed:', data.user);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }

    handleShowhidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handelOnKeyDown = (event) => {
        if (event.key === "Enter") {
            this.handleLogin()
        }
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
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                    onKeyDown={(event) => this.handelOnKeyDown(event)}
                                />

                                <span onClick={() => this.handleShowhidePassword()}>
                                    <i class={this.state.isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                                </span>

                            </div>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>{this.state.errMessage} </div>
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInFo) => dispatch(actions.userLoginSuccess(userInFo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
