import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions'
import UserManage from './UserManage';
import './UserRedux.scss'
import UserModalRedux from './UserModalRedux';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,
            arrCheck: {
                email: 'Email',
                password: 'Mật khẩu',
                firstName: 'Tên',
                lastName: 'Họ và tên lót',
                phoneNumber: 'Số điện thoại',
                address: 'Địa chỉ'
            },
            arrUser: [],
            isOpenModelUser: false,
            isOpenModelEdit: false,
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGender = this.props.genderRedux;
            this.setState({
                genderArr: arrGender,
                gender: arrGender && arrGender.length > 0 ? arrGender[0].key : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPosition = this.props.positionRedux;
            this.setState({
                positionArr: arrPosition,
                position: arrPosition && arrPosition.length > 0 ? arrPosition[0].key : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRole = this.props.roleRedux;
            this.setState({
                roleArr: arrRole,
                role: arrRole && arrRole.length > 0 ? arrRole[0].key : ''
            })
        }
    };

    handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: file
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) {
            return;
        }
        this.setState({
            isOpen: true
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        if (this.props.language === 'en') {
            this.setState({
                arrCheck: { email: 'Email', password: 'Password', firstName: 'First name', lastName: 'Last name', phoneNumber: 'Phone number', address: 'Address' }
            })
        } else {
            this.setState({
                arrCheck: { email: 'Email', password: 'Mật khẩu', firstName: 'Tên', lastName: 'Họ và tên lót', phoneNumber: 'Số điện thoại', address: 'Địa chỉ' }
            })
        }
        for (let i = 0; i < Object.keys(this.state.arrCheck).length; i++) {
            let key = Object.keys(this.state.arrCheck)[i];
            let regexEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
            let regexPassword = /^[@#][A-Za-z0-9]{7,13}$/;
            let isPasswordValid = regexPassword.test(this.state.password);
            let isEmailValid = regexEmail.test(this.state.email);
            if (!this.state[key]) {
                isValid = false;
                if (this.props.language === 'en') {
                    if (!isEmailValid) {
                        alert('Invalid email');
                    } else if (isEmailValid) {
                        alert('This input is required: ' + this.state.arrCheck[key]);
                    }
                } else {
                    if (!isEmailValid) {
                        alert('Email không hợp lệ');
                    } else {
                        alert('Ô dữ liệu cần phải nhập vào: ' + this.state.arrCheck[key]);
                    }
                }
                break;
            }
        }
        return isValid;
    }


    // handleSaveUser = () => {
    //     let isValid = this.checkValidateInput();
    //     if (isValid === false) {
    //         return;
    //     } else {
    //         // fire redux action
    //         this.props.createNewUser({
    //             email: this.state.email,
    //             password: this.state.password,
    //             firstName: this.state.firstName,
    //             lastName: this.state.lastName,
    //             address: this.state.address,
    //             phoneNumber: this.state.phoneNumber,
    //             gender: this.state.gender,
    //             roleId: this.state.role,
    //             positionId: this.state.position,
    //         })
    //     }
    // }

    handleAddNewUser = () => {
        this.setState({
            isOpenModelUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModelUser: !this.state.isOpenModelUser
        })
    }

    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let {
            email, password, firstName, lastName, phoneNumber, address
        } = this.state;
        // let isLoadingGender = this.props.isLoadingGender;
        return (
            <div className='user-redux-container'>
                <UserModalRedux
                    isOpen={this.state.isOpenModelUser}
                />
                <div className='title'>
                    CRUD with redux
                </div>
                <button className='btn btn-primary px-2 mx-3'
                    onClick={() => this.handleAddNewUser()}
                >
                    <i className="fas fa-plus px-1"></i>
                    Add new user
                </button>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'><FormattedMessage id="manage-user.add" /></div>
                            <div className='col-3 my-3'>
                                {/* <div>{isLoadingGender ? 'Loading genders' : ''}</div> */}
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input className='form-control' type='email'
                                    value={email}
                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className='form-control' type='password'
                                    value={password}
                                    onChange={(event) => { this.onChangeInput(event, 'password') }}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input className='form-control' type='text'
                                    value={firstName}
                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input className='form-control' type='text'
                                    value={lastName}
                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input className='form-control' type='number' min={0}
                                    value={phoneNumber}
                                    onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className='form-control' type='text'
                                    value={address}
                                    onChange={(event) => { this.onChangeInput(event, 'address') }}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3 mt-3'>
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                >
                                    {genders && genders.length > 0
                                        && genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3 mt-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'position') }}
                                >
                                    {positions && positions.length > 0
                                        && positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3 mt-3'>
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'role') }}
                                >
                                    {roles && roles.length > 0
                                        && roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3 mt-3'>
                                <label><FormattedMessage id="manage-user.avatar" /></label>
                                <div className='preview-img-container'>
                                    <input id='priewImg' type='file' hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className='label-upload' htmlFor='priewImg'>
                                        Tải ảnh
                                        <i className='fas fa-upload'></i>
                                    </label>
                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 mt-3'>
                                <button className='btn btn-primary'
                                    onClick={() => this.handleSaveUser()}
                                >
                                    <FormattedMessage id="manage-user.save" />
                                </button>
                            </div>
                            <div className='col-12'>
                                <UserManage />
                            </div>
                        </div>
                    </div>
                    {this.state.isOpen === true &&
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    }
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
