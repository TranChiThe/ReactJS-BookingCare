import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from "../../services/userService";
import './UserManage.scss';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter'

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUser: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
        }
    }

    async componentDidMount() {
        this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('All');
        if (response && response.errCode === 0) {
            this.setState({
                arrUser: response.users
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
            } else {
                // alert(response.errMessage);
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false,
                })
                // emitter.emit('EVENT_CLEAR_MODAL_DATA', { 'id': 'your id' })
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log(e);
        }
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    handleDeleteUser = async (user) => {
        try {
            let response = await deleteUserService(user.id);
            if (response && response.errCode === 0) {
                alert(response.errMessage);
                await this.getAllUsersFromReact();
            } else {
                alert(response.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })
        console.log('check user edit: ', this.state.userEdit);
        console.log('check user: ', user);
    }

    doEditUser = async (user) => {
        try {
            let response = await editUserService(user);
            if (response && response.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false,
                })
                alert(response.errMessage);
                await this.getAllUsersFromReact();
            } else {
                alert(response.errMessage);
            }
        } catch (e) {
            console.log(e);
        }

    }
    render() {
        let arrUser = this.state.arrUser;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleUserModal={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleUserModal={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className="title text-center">
                    Manager users BookingCare System
                </div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-2'
                        onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fas fa-plus px-1"></i>
                        Add new users
                    </button>
                </div>
                <div className="user-table mt-3 mx-1">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>

                            {arrUser && arrUser.map((item, index) => {
                                //console.log("Check map: ", item, index);
                                return (
                                    <tr className="">
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className="btn-edit"
                                                onClick={() => this.handleEditUser(item)}>
                                                <i className='fas fa-pencil-alt'></i>
                                            </button>
                                            <button className="btn-delete"
                                                onClick={() => this.handleDeleteUser(item)}>
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
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
