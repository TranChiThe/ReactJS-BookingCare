import React, { Component } from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import UserModalRedux from './UserModalRedux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils';
import ConfirmModal from '../../../components/ConfirmModal';
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

    handUserDelete = (user) => {
        this.props.deleteUser(user.id);
    }

    handleUserEdit = (user) => {
        this.setState({
            isOpenModalUser: true,
            userEdit: user,
            action: CRUD_ACTIONS.EDIT
        })
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
                                        <th><FormattedMessage id="manage-user.first-name" /></th>
                                        <th><FormattedMessage id="manage-user.last-name" /></th>
                                        <th><FormattedMessage id="manage-user.phone-number" /></th>
                                        <th><FormattedMessage id="manage-user.address" /></th>
                                        <th><FormattedMessage id="manage-user.gender" /></th>
                                        <th></th>
                                    </tr>
                                    {arrUsers && arrUsers.length > 0 &&
                                        arrUsers.map((item, index) => {
                                            return (
                                                <tr className="" key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.firstName}</td>
                                                    <td>{item.lastName}</td>
                                                    <td>{item.phoneNumber}</td>
                                                    <td>{item.address}</td>
                                                    <td>{item.gender}</td>
                                                    <td>
                                                        <button className="btn-edit"
                                                            onClick={() => this.handleUserEdit(item)}
                                                        >
                                                            <i className='fas fa-pencil-alt'></i>
                                                        </button>
                                                        <button className="btn-delete"
                                                            onClick={() => { this.handUserDelete(item) }}
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
