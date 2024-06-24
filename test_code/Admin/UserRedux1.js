import React, { Component } from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import UserCreateModalRedux from './UserCreateModalRedux';
import UserEditModalRedux from './UserEditModalRedux';
import { FormattedMessage } from 'react-intl';
import './UserRedux.scss'

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenModalUser: false,
            isOpenModalEdit: false,
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

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    handleEditUserToggle = () => {
        this.setState({
            isOpenModalEdit: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEdit: !this.state.isOpenModalEdit,
        })
    }

    closeUserModal = () => {
        this.setState({
            isOpenModalUser: false,
            isOpenModalEdit: false,
        })
    }

    handUserDelete = (user) => {
        this.props.deleteUser(user.id);
    }

    handleUserEdit = (user) => {
        this.setState({
            isOpenModalEdit: true,
            userEdit: user
        })
        console.log('check user: ', user);
    }

    render() {
        let arrUsers = this.state.userRedux;
        return (
            <div className='user-redux-container'>
                <UserCreateModalRedux
                    isOpen={this.state.isOpenModalUser}
                    toggleUserModal={this.toggleUserModal}
                    createNewUserModal={this.createNewUserModal}
                    closeUserModal={this.closeUserModal}
                />
                {
                    this.state.isOpenModalEdit &&
                    <UserEditModalRedux
                        isOpen={this.state.isOpenModalEdit}
                        toggleEditUserModal={this.toggleEditUserModal}
                        currentUser={this.state.userEdit}
                        closeUserModal={this.closeUserModal}
                    />
                }
                <div className='title'>
                    CRUD with redux
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
                                        <th>STT</th>
                                        <th>Email</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Phone Number</th>
                                        <th>Address</th>
                                        <th>Gender</th>
                                        <th>Actions</th>
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
                                                            onClick={() => this.handUserDelete(item)}
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
