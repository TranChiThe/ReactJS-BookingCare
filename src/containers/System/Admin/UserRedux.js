import React, { Component } from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import UserModalRedux from './UserModalRedux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils';
import Swal from 'sweetalert2';
import { SwalConfig } from '../../../components/NotificationConfig/notificationSwal';
import { notificationEn } from '../../../components/NotificationConfig/notificationEn';
import { notificationVi } from '../../../components/NotificationConfig/notificationVi';
import './UserRedux.scss'


class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenModalUser: false,
            isOpenModalEdit: false,
            action: '',
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers,
            })
        }
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    closeUserModal = () => {
        this.setState({
            isOpenModalUser: false,
            isOpenModalEdit: false,
        })
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
            action: CRUD_ACTIONS.CREATE,
        })
    }
    // this.props.deleteUser(user.id);
    handleUserDelete = (user) => {
        let { language } = this.props;
        if (language === LANGUAGES.EN) {
            Swal.fire(SwalConfig.confirmDialog(notificationEn.title, notificationEn.text, notificationEn.confirm, notificationEn.cancel))
                .then((result) => {
                    if (result.isConfirmed) {
                        this.props.deleteUser(user.id);
                        Swal.fire(SwalConfig.successNotification(notificationEn.deleteTitle, notificationEn.deleteText));
                    }
                });
        } else if (language === LANGUAGES.VI) {
            Swal.fire(SwalConfig.confirmDialog(notificationVi.title, notificationVi.text, notificationVi.confirm, notificationVi.cancel))
                .then((result) => {
                    if (result.isConfirmed) {
                        this.props.deleteUser(user.id);
                        Swal.fire(SwalConfig.successNotification(notificationVi.deleteTitle, notificationVi.deleteText));
                    }
                });
        }

    };


    handleUserEdit = (user) => {
        this.setState({
            isOpenModalUser: true,
            userEdit: user,
            action: CRUD_ACTIONS.EDIT
        })
    }

    confirmUserDelete = () => {

    }

    render() {
        let arrUsers = this.state.userRedux;
        return (
            <div className='user-redux-container'>
                {
                    this.state.action === CRUD_ACTIONS.EDIT &&
                    this.state.isOpenModalUser &&
                    <UserModalRedux
                        isOpen={this.state.isOpenModalUser}
                        toggleUserModal={this.toggleUserModal}
                        currentUser={this.state.userEdit}
                        closeUserModal={this.closeUserModal}
                        action={this.state.action}
                    />
                }
                {
                    this.state.action === CRUD_ACTIONS.CREATE &&
                    <UserModalRedux
                        isOpen={this.state.isOpenModalUser}
                        toggleUserModal={this.toggleUserModal}
                        createNewUserModal={this.createNewUserModal}
                        closeUserModal={this.closeUserModal}
                        action={this.state.action}
                    />
                }
                <div className='user-title'>
                    <FormattedMessage id="manage-user.title" />
                </div>
                <button className='btn btn-primary px-2 mx-3'
                    onClick={() => this.handleAddNewUser()}
                >
                    <i className="fas fa-plus px-1"></i>
                    <FormattedMessage id="manage-user.save" />
                </button>
                <div className='user-redux-body'>
                    <div className='user-manage-table'>
                        <div className="users-container">
                            <table id="customers">
                                <tbody>
                                    <tr>
                                        <th></th>
                                        <th><FormattedMessage id="manage-user.email" /></th>
                                        <th><FormattedMessage id="manage-user.position" /></th>
                                        <th><FormattedMessage id="manage-user.full-name" /></th>
                                        <th><FormattedMessage id="manage-user.phone-number" /></th>
                                        <th><FormattedMessage id="manage-user.address" /></th>
                                        <th><FormattedMessage id="manage-user.gender" /></th>
                                        <th></th>
                                    </tr>
                                    {arrUsers && arrUsers.length > 0 &&
                                        arrUsers.map((item, index) => {
                                            let nameVi = item.lastName + ' ' + item.firstName
                                            let nameEn = item.firstName + ' ' + item.lastName
                                            let positionVi = item && item.positionData ? item.positionData.valueVi : '';
                                            let positionEn = item && item.positionData ? item.positionData.valueEn : '';
                                            let genderVi = item && item.genderData ? item.genderData.valueVi : '';
                                            let genderEn = item && item.genderData ? item.genderData.valueEn : '';

                                            return (
                                                <tr className="" key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.email}</td>
                                                    <td>{this.props.language === LANGUAGES.VI ? positionVi : positionEn}</td>
                                                    <td>{this.props.language === LANGUAGES.VI ? nameVi : nameEn}</td>
                                                    <td>{item.phoneNumber}</td>
                                                    <td>{item.address}</td>
                                                    <td>{this.props.language === LANGUAGES.VI ? genderVi : genderEn}</td>
                                                    <td>
                                                        <button className="btn-edit"
                                                            onClick={() => this.handleUserEdit(item)}
                                                        >
                                                            <i className='fas fa-pencil-alt'></i>
                                                        </button>
                                                        <button className="btn-delete"
                                                            onClick={() => { this.handleUserDelete(item) }}
                                                            onSubmit={() => { this.confirmUserDelete() }}
                                                        >
                                                            <i className='fas fa-trash'></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
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
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        deleteUser: (userId) => dispatch(actions.fetchDeleteUserStart(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
