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
                        <div className='col-12'>
                            <UserManage />
                        </div>
                    </div>
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
