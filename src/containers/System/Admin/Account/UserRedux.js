import React, { Component } from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import UserModalRedux from './UserModalRedux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS } from '../../../../utils';
import Pagination from '../../../../components/Pagination/Pagination';
import Select from 'react-select'
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig';
import { toast } from 'react-toastify';
import './UserRedux.scss'

const roleOptions = [
    { value: '', label: <FormattedMessage id="manage-user.all" defaultMessage="All" /> },
    { value: 'R1', label: <FormattedMessage id="manage-user.admin" defaultMessage="Admin" /> },
    { value: 'R2', label: <FormattedMessage id="manage-user.doctor" defaultMessage="Doctor" /> },
    { value: 'R4', label: <FormattedMessage id="manage-user.staff" defaultMessage="Staff" /> },
];

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenModalUser: false,
            isOpenModalEdit: false,
            action: '',
            currentPage: 1,
            limit: 10,
            totalPages: 1,
            selectedRole: { value: '', label: <FormattedMessage id="manage-user.all" defaultMessage="All" /> }
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux('', 1, 10);
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
        let roleId = this.props.roleId;
        if (roleId === 'R1') {
            this.setState({
                isOpenModalUser: true,
                action: CRUD_ACTIONS.CREATE,
            })
        } else {
            toast.error(<FormattedMessage id='toast.no-access' />)
        }
    }

    handleUserDelete = async (user) => {
        let roleId = this.props.roleId;
        if (roleId === 'R1') {
            const SwalConfig = createSwalConfig(this.props.intl);
            const result = await Swal.fire(SwalConfig.confirmDialog());
            if (result.isConfirmed) {
                this.props.deleteUser(user.id);
                Swal.fire(SwalConfig.successNotification(
                    'notification.delete-success.deleteText'
                ))
            }
        } else {
            toast.error(<FormattedMessage id='toast.no-access' />)
        }
    };

    handleUserEdit = (user) => {
        let roleId = this.props.roleId;
        if (roleId === 'R1') {
            this.setState({
                isOpenModalUser: true,
                userEdit: user,
                action: CRUD_ACTIONS.EDIT
            })
        } else {
            toast.error(<FormattedMessage id='toast.no-access' />)
        }
    }

    fetchUsers = () => {
        const { selectedRole, currentPage, limit } = this.state;
        this.props.fetchUserRedux(selectedRole.value, currentPage, limit);
    }

    handleRoleChange = (selectedRole) => {
        this.setState({ selectedRole, currentPage: 1 }, this.fetchUsers);
    };

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage }, this.fetchUsers);
    };

    render() {
        let arrUsers = this.state.userRedux;
        let { currentPage, totalPages } = this.props
        return (
            <React.Fragment>
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
                    <div className='control-row btn-create'>
                        <button className='btn btn-primary px-2 mx-3'
                            onClick={() => this.handleAddNewUser()}
                        >
                            <i className="fas fa-plus px-1"></i>
                            <FormattedMessage id="manage-user.save" />
                        </button>
                        <div className='filter-role'>
                            <Select
                                className="role-select"
                                value={this.state.selectedRole}
                                onChange={this.handleRoleChange}
                                options={roleOptions}
                                placeholder="Filter by role"
                            />
                        </div>
                    </div>
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
                                                        <td>{index + 1 + (this.state.currentPage - 1) * this.state.limit}</td>
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                />
            </React.Fragment>
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
        listUsers: state.admin.data,
        currentPage: state.admin.currentPage,
        totalPages: state.admin.totalPages,
        roleId: state.auth.role

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: () => dispatch(actions.createNewUser()),
        fetchUserRedux: (roleId, page, limit) => dispatch(actions.fetchAllUserStart(roleId, page, limit)),
        deleteUser: (userId) => dispatch(actions.fetchDeleteUserStart(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserRedux));
