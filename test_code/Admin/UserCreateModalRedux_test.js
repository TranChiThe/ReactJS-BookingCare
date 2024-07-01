import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../../utils/emitter';
import * as actions from '../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';

class UserCreateModalRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
            arrCheck: {
                email: 'Email',
                password: 'Mật khẩu',
                firstName: 'Tên',
                lastName: 'Họ và tên lót',
                phoneNumber: 'Số điện thoại',
                address: 'Địa chỉ'
            }
        }
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                previewImgURL: '',
                isOpen: false,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: '',
                position: '',
                role: '',
                avatar: '',
                arrCheck: {
                    email: 'Email',
                    password: 'Mật khẩu',
                    firstName: 'Tên',
                    lastName: 'Họ và tên lót',
                    phoneNumber: 'Số điện thoại',
                    address: 'Địa chỉ'
                }
            })
        })
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    toggle = () => {
        this.props.toggleUserModal();
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGender = this.props.genderRedux;
            this.setState({
                genderArr: arrGender,
                gender: arrGender && arrGender.length > 0 ? arrGender[0].key : ''
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPosition = this.props.positionRedux;
            this.setState({
                positionArr: arrPosition,
                position: arrPosition && arrPosition.length > 0 ? arrPosition[0].key : ''
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRole = this.props.roleRedux;
            this.setState({
                roleArr: arrRole,
                role: arrRole && arrRole.length > 0 ? arrRole[0].key : ''
            });
        }
        // if (prevProps.listUsers !== this.props.listUsers) {
        //     let arrGender = this.props.genderRedux;
        //     let arrPosition = this.props.positionRedux;
        //     let arrRole = this.props.roleRedux;
        //     this.setState({
        //         previewImgURL: '',
        //         isOpen: false,
        //         email: '',
        //         password: '',
        //         firstName: '',
        //         lastName: '',
        //         phoneNumber: '',
        //         address: '',
        //         gender: arrGender && arrGender.length > 0 ? arrGender[0].key : '',
        //         position: arrPosition && arrPosition.length > 0 ? arrPosition[0].key : '',
        //         role: arrRole && arrRole.length > 0 ? arrRole[0].key : '',
        //     });
        // }
    }

    handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: file
            });
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) {
            return;
        }
        this.setState({
            isOpen: true
        });
    }

    checkValidInput = () => {
        let isValid = true;
        if (this.props.language === 'en') {
            this.setState({
                arrCheck: { email: 'Email', password: 'Password', firstName: 'First name', lastName: 'Last name', phoneNumber: 'Phone number', address: 'Address' }
            });
        } else {
            this.setState({
                arrCheck: { email: 'Email', password: 'Mật khẩu', firstName: 'Tên', lastName: 'Họ và tên lót', phoneNumber: 'Số điện thoại', address: 'Địa chỉ' }
            });
        }
        for (let i = 0; i < Object.keys(this.state.arrCheck).length; i++) {
            let key = Object.keys(this.state.arrCheck)[i];
            let regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
            let checkEmailValid = regEmail.test(this.state.email);
            let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
            let checkPasswordValid = passw.test(this.state.password);
            if (!this.state[key]) {
                isValid = false;
                if (this.props.language === 'en') {
                    if (!checkEmailValid) {
                        alert('Invalid email');
                    } else if (!checkPasswordValid) {
                        alert('Invalid password');
                    } else {
                        alert('This input is required: ' + this.state.arrCheck[key]);
                    }
                } else {
                    if (!checkEmailValid) {
                        alert('Email không hợp lệ');
                    } else if (!checkPasswordValid) {
                        alert('Mật khẩu không hợp lệ');
                    } else {
                        alert('Ô dữ liệu cần phải nhập vào: ' + this.state.arrCheck[key]);
                    }
                }
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidInput();
        if (isValid === false) {
            return;
        } else {
            let data = this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
            });
            if (data) {
                this.props.closeUserModal();
                this.props.fetchUserRedux();
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        }
    }

    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let {
            email, password, firstName, lastName, phoneNumber, address, role, gender, position
        } = this.state;
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size='xl'
            >
                <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id="manage-user.add" /></ModalHeader>
                <ModalBody>
                    <div className='user-redux-container'>
                        <div className='user-redux-body'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-3 my-3'>
                                        <label><FormattedMessage id="manage-user.email" /></label>
                                        <input className='form-control' type='email'
                                            value={email}
                                            onChange={(event) => { this.handleOnChangeInput(event, 'email') }}
                                        />
                                    </div>
                                    <div className='col-3 my-3'>
                                        <label><FormattedMessage id="manage-user.password" /></label>
                                        <input className='form-control' type='password'
                                            value={password}
                                            onChange={(event) => { this.handleOnChangeInput(event, 'password') }}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-3'>
                                        <label><FormattedMessage id="manage-user.first-name" /></label>
                                        <input className='form-control' type='text'
                                            value={firstName}
                                            onChange={(event) => { this.handleOnChangeInput(event, 'firstName') }}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id="manage-user.last-name" /></label>
                                        <input className='form-control' type='text'
                                            value={lastName}
                                            onChange={(event) => { this.handleOnChangeInput(event, 'lastName') }}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-3 my-3'>
                                        <label><FormattedMessage id="manage-user.phone-number" /></label>
                                        <input className='form-control' type='number' min={0}
                                            value={phoneNumber}
                                            onChange={(event) => { this.handleOnChangeInput(event, 'phoneNumber') }}
                                        />
                                    </div>
                                    <div className='col-6 my-3'>
                                        <label><FormattedMessage id="manage-user.address" /></label>
                                        <input className='form-control' type='text'
                                            value={address}
                                            onChange={(event) => { this.handleOnChangeInput(event, 'address') }}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-3 '>
                                        <label><FormattedMessage id="manage-user.gender" /></label>
                                        <select className="form-control"
                                            onChange={(event) => { this.handleOnChangeInput(event, 'gender') }}
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
                                    <div className='col-3'>
                                        <label><FormattedMessage id="manage-user.position" /></label>
                                        <select className="form-control"
                                            onChange={(event) => { this.handleOnChangeInput(event, 'position') }}
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
                                    <div className='col-3'>
                                        <label><FormattedMessage id="manage-user.role" /></label>
                                        <select className="form-control"
                                            onChange={(event) => { this.handleOnChangeInput(event, 'role') }}
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
                                    <div className='col-3'>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                        className="px-3"
                        onClick={() => { this.handleSaveUser() }}>
                        <FormattedMessage id="manage-user.save" />
                    </Button>{' '}
                    <Button color="secondary" className="px-3"
                        onClick={() => { this.toggle() }}>
                        <FormattedMessage id="manage-user.close" />
                    </Button>
                </ModalFooter>
            </Modal >
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
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserCreateModalRedux);
