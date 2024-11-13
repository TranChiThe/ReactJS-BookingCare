import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../../utils/emitter';
import * as actions from '../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import { toast } from 'react-toastify'
import _ from 'lodash';
import Swal from 'sweetalert2';
import createSwalConfig from '../../../components/NotificationConfig/SwalConfig'
import { injectIntl } from 'react-intl';
import './UserModalRedux.scss';

class UserModalRedux extends Component {
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
            gender: 'M',
            position: 'P0',
            role: 'R1',
            avatar: '',
            arrCheck: {
                email: 'Email',
                password: 'Mật khẩu',
                firstName: 'Tên',
                lastName: 'Họ và tên lót',
                phoneNumber: 'Số điện thoại',
                address: 'Địa chỉ',
            }
        };
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
            });
        });
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        this.handleEditUser();
    }

    handleEditUser = () => {
        let user = this.props.currentUser;
        let imageBase64 = '';
        if (this.props.action === CRUD_ACTIONS.EDIT) {
            if (user && !_.isEmpty(user)) {
                if (user.image) {
                    imageBase64 = new Buffer.from(user.image, 'base64').toString('binary');
                }
                this.setState({
                    id: user.id,
                    email: user.email,
                    password: '1111111Aa',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    gender: user.gender,
                    position: user.positionId,
                    role: user.roleId,
                    avatar: '',
                    previewImgURL: imageBase64,
                    action: CRUD_ACTIONS.EDIT,
                });
            }
        }
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
        let user = this.props.currentUser;
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGender = this.props.genderRedux;
            this.setState({
                genderArr: arrGender,
                gender: arrGender && arrGender.length > 0 && !user ? arrGender[0].keyMap : user.gender
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPosition = this.props.positionRedux;
            this.setState({
                positionArr: arrPosition,
                position: arrPosition && arrPosition.length > 0 && !user ? arrPosition[0].keyMap : user.positionId
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRole = this.props.roleRedux;
            this.setState({
                roleArr: arrRole,
                role: arrRole && arrRole.length > 0 && !user ? arrRole[0].keyMap : user.roleId
            });
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGender = this.props.genderRedux;
            let arrPosition = this.props.positionRedux;
            let arrRole = this.props.roleRedux;
            this.setState({
                previewImgURL: '',
                isOpen: false,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : '',
                position: arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : '',
                role: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : '',
            });
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
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
        const { email, password, firstName, lastName, phoneNumber, address } = this.state;
        const { language } = this.props;
        const messages = {
            en: {
                invalidEmail: "Invalid email",
                invalidPassword: "Invalid password",
                invalidPhone: "Invalid phone number",
                fillAllFields: "Please enter all required information"
            },
            vi: {
                invalidEmail: "Email không hợp lệ",
                invalidPassword: "Mật khẩu không hợp lệ",
                invalidPhone: "Số điện thoại không hợp lệ",
                fillAllFields: "Vui lòng nhập đủ thông tin"
            }
        };

        const validationMessages = messages[language];
        let isValid = true;

        // Regular expressions
        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
        const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        const phoneRegEx = /^[0-9]{10,15}$/;

        // Check for empty fields
        if (!email || !password || !firstName || !lastName || !phoneNumber || !address) {
            toast.error(validationMessages.fillAllFields);
            return false;
        }

        // Validation checks
        if (!regEmail.test(email)) {
            toast.error(validationMessages.invalidEmail);
            isValid = false;
        }
        if (!passw.test(password)) {
            toast.error(validationMessages.invalidPassword);
            isValid = false;
        }
        if (!phoneRegEx.test(phoneNumber)) {
            toast.error(validationMessages.invalidPhone);
            isValid = false;
        }

        return isValid;
    };

    handleSaveUser = async () => {
        const SwalConfig = createSwalConfig(this.props.intl);  // Create SwalConfig using intl prop
        let isValid = this.checkValidInput();
        if (!isValid) {
            return;
        }

        let data;
        if (this.props.action === CRUD_ACTIONS.CREATE) {
            data = this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });

            if (data) {
                this.props.closeUserModal();
                this.props.fetchUserRedux();
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
                Swal.fire(SwalConfig.successNotification(
                    "notification.user-create-success.text"
                ));
            } else {
                Swal.fire(SwalConfig.errorNotification(
                    'notification.user-create-fail.text'
                ));
            }
        } else if (this.props.action === CRUD_ACTIONS.EDIT) {
            let result = await Swal.fire(SwalConfig.confirmDialog())
            if (result.isConfirmed) {
                data = this.props.userEditRedux({
                    id: this.state.id,
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phoneNumber: this.state.phoneNumber,
                    gender: this.state.gender,
                    roleId: this.state.role,
                    positionId: this.state.position,
                    avatar: this.state.avatar,
                });
                if (data) {
                    this.props.closeUserModal();
                    Swal.fire(SwalConfig.successNotification(
                        'notification.user-edit-success.text'
                    ));
                } else {
                    Swal.fire(SwalConfig.errorNotification(
                        'notification.user-edit-fail.text'
                    ));
                }
            }
        }
    };

    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let { email, password, firstName, lastName, phoneNumber, address, gender, position, role, previewImgURL } = this.state;
        return (
            <div className='modal-container'>
                <Modal isOpen={this.props.isOpen} toggle={() => { this.toggle() }} className='modal-user-container' size='lg'>
                    <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id="manage-user.add" /></ModalHeader>
                    <ModalBody>
                        <div className='user-redux-container'>
                            <div className='user-redux-body'>
                                <div className='container'>
                                    <form>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.email" /></label>
                                                    <input className='form-control' type='email'
                                                        value={email}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'email') }}
                                                        disabled={this.props.action === CRUD_ACTIONS.EDIT}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.password" /></label>
                                                    <input className='form-control' type='password'
                                                        value={password}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'password') }}
                                                        disabled={this.props.action === CRUD_ACTIONS.EDIT}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.first-name" /></label>
                                                    <input className='form-control' type='text'
                                                        value={firstName}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'firstName') }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.last-name" /></label>
                                                    <input className='form-control' type='text'
                                                        value={lastName}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'lastName') }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.phone-number" /></label>
                                                    <input className='form-control' type='number' min={0}
                                                        value={phoneNumber}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'phoneNumber') }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.address" /></label>
                                                    <input className='form-control' type='text'
                                                        value={address}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'address') }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.gender" /></label>
                                                    <select className="form-control"
                                                        value={gender}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'gender') }}
                                                    >
                                                        {genders && genders.length > 0
                                                            && genders.map((item, index) => (
                                                                <option key={index} value={item.keyMap}>
                                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.role" /></label>
                                                    <select className="form-control"
                                                        value={role}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'role') }}
                                                    >
                                                        {roles && roles.length > 0
                                                            && roles.map((item, index) => (
                                                                <option key={index} value={item.keyMap}>
                                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.position" /></label>
                                                    <select className="form-control"
                                                        value={position}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'position') }}
                                                    >
                                                        {positions && positions.length > 0
                                                            && positions.map((item, index) => (
                                                                <option key={index} value={item.keyMap}>
                                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="manage-user.avatar" /></label>
                                                    <div className='preview-img-container'>
                                                        <input id='previewImg' type='file' hidden
                                                            onChange={(event) => this.handleOnChangeImage(event)}
                                                        />
                                                        <label className='label-upload' htmlFor='previewImg'>
                                                            <FormattedMessage id="manage-user.image" />
                                                            <i className='fas fa-upload'></i>
                                                        </label>
                                                        <div className='preview-image'
                                                            style={{ backgroundImage: `url(${previewImgURL})` }}
                                                            onClick={() => this.openPreviewImage()}
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                            className={this.props.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}
                            onClick={() => { this.handleSaveUser() }}>
                            {this.props.action === CRUD_ACTIONS.EDIT ?
                                <FormattedMessage id="manage-user.save-change" /> :
                                <FormattedMessage id="manage-user.save" />
                            }
                        </Button>
                        <Button color="secondary" className="px-3"
                            onClick={() => { this.toggle() }}>
                            <FormattedMessage id="manage-user.close" />
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
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
        userEditRedux: (user) => dispatch(actions.fetchEditUserStart(user)),
    };
};
export default (connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserModalRedux)));
