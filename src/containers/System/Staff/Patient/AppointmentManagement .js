import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPatientAppointment, postConfirmAppoitment, postCancelAppointment } from '../../../../services/userService';
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import Pagination from '../../../../components/Pagination/Pagination';
import DatePicker from '../../../../components/Input/DatePicker';
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig'
import { toast } from 'react-toastify';
import Select from 'react-select'
import * as actions from '../../../../store/actions'
import './AppointmentManagement.scss';

const statusOptions = [
    { value: 'S2', label: <FormattedMessage id="admin.doctor.confirmed" defaultMessage="Confirmed" /> },
    { value: 'S3', label: <FormattedMessage id="admin.doctor.examining" defaultMessage="Examining" /> },
    { value: 'S4', label: <FormattedMessage id="admin.doctor.complete" defaultMessage="Complete" /> },
    { value: 'S5', label: <FormattedMessage id="admin.doctor.canceled" defaultMessage="Canceled" /> },

];

class AppointmentManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            selectedStatus: 'S2',
            currentPage: 1,
            totalPages: '',
            limit: 5,
            searchTerm: '',
            currentDate: this.getDateTimestamp(new Date()),
            selectedFilter: { value: 'S2', label: <FormattedMessage id="admin.doctor.confirmed" defaultMessage="Confirmed" /> },
            selectedOptions: '',
            arrDoctor: [],
        };
    }

    async componentDidMount() {
        await this.fetchAppointments();
        this.props.fetchAllDoctorStart('', '');
        this.props.getAllRequiredDoctorInfo();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedStatus !== this.state.selectedStatus) {
            this.fetchAppointments()
        }
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                arrDoctor: dataSelect,
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                arrDoctor: dataSelect,

            })
        }
    }

    fetchAppointments = async () => {
        try {
            let doctorId = this.props.userInFo.id
            let { selectedStatus, currentPage, limit, currentDate, searchTerm, selectedOptions } = this.state
            const res = await getPatientAppointment(selectedOptions?.value, selectedStatus, currentDate, searchTerm, currentPage, limit);
            if (res && res.errCode === 0) {
                this.setState({
                    appointments: res.data,
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                });
            } else {
                console.error('Error fetching appointments:', res.errMessage);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    handleStatusChange = (status) => {
        this.setState({ selectedStatus: status });
    };

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage || 1 }, () => {
            this.fetchAppointments();
        });
    };

    handleOnchangeDatePicker = async (date) => {
        this.setState({
            currentDate: this.getDateTimestamp(date[0]),
        }, () => {
            this.fetchAppointments()
        });
    }

    getDateTimestamp = (dateString) => {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    handleConfirmAppointment = async (appointmentId) => {
        let SwalConfig = createSwalConfig(this.props.intl);
        let { userInFo } = this.props;
        if (userInFo.roleId !== 'R2' && this.state.selectedStatus === 'S3') {
            toast.error(<FormattedMessage id='toast.no-access' />)
            return;
        } else {
            let result = await Swal.fire(SwalConfig.confirmDialog());
            if (result.isConfirmed) {
                let res = await postConfirmAppoitment(appointmentId);
                if (res && res.errCode === 0) {
                    Swal.fire(SwalConfig.successNotification('notification.appointment-doctor.textSuccess'))
                    this.fetchAppointments();
                } else if (res && res.errCode === 2) {
                    toast.error(<FormattedMessage id='toast.error' />)
                } else {
                    Swal.fire(SwalConfig.successNotification('notification.appointment-doctor.textFail'))
                }
            }
        }

    }

    handleCancelAppointment = async (appointmentId) => {
        let SwalConfig = createSwalConfig(this.props.intl);
        let result = await Swal.fire(SwalConfig.confirmDialog());
        if (result.isConfirmed) {
            let res = await postCancelAppointment(appointmentId);
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.appointment-doctor.textCancelSuccess'))
                this.fetchAppointments();
            } else if (res && res.errCode === 2) {
                toast.error(<FormattedMessage id='toast.error' />)
            } else {
                Swal.fire(SwalConfig.successNotification('notification.appointment-doctor.textCancelFail'))
            }
        }
    }

    handleInputChange = (event) => {
        let value = event.target.value;
        this.setState({ searchTerm: value }, () => {
            this.fetchAppointments();
        });
    }

    handleFilterChange = (selectedFilterOption) => {
        this.setState({
            selectedFilter: selectedFilterOption,
            selectedStatus: selectedFilterOption.value
        }, () => {
            this.fetchAppointments();
        });
    }

    handleChangeSelect = async (selectedOptions) => {
        this.setState({ selectedOptions }, this.fetchAppointments);
    };

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "USERS") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`
                    let labelEn = `${item.firstName} ${item.lastName}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id;
                    result.push(object);
                })
            }
        }
        return result;
    }

    render() {
        const { selectedStatus, appointments, currentPage, totalPages } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let { userInFo } = this.props;
        return (
            <div className="appointment-doctor-list-container">
                <div className="appointment-management-title">
                    <FormattedMessage id='admin.doctor.appointment-manage' />
                </div>
                <div className="patient-search-appointment-container">
                    <div className="search-box">
                        <Select
                            className="filter"
                            value={this.state.selectedFilter}
                            onChange={this.handleFilterChange}
                            options={statusOptions}
                            placeholder="Select filter..."
                        />
                        <input
                            type="text"
                            className="search-input"
                            value={this.state.searchTerm}
                            onChange={this.handleInputChange}
                            placeholder="Search..."
                        />
                    </div>
                </div>
                <div className='staff-menu'>
                    <div className="staff-status-buttons">
                        <button
                            className={`status-button ${selectedStatus === 'S2' ? 'active' : ''}`}
                            onClick={() => this.handleStatusChange('S2')}
                        >
                            <FormattedMessage id='admin.doctor.confirmed' />
                        </button>
                        <button
                            className={`status-button ${selectedStatus === 'S3' ? 'active' : ''}`}
                            onClick={() => this.handleStatusChange('S3')}
                        >
                            <FormattedMessage id='admin.doctor.examining' />
                        </button>
                        <button
                            className={`status-button ${selectedStatus === 'S4' ? 'active' : ''}`}
                            onClick={() => this.handleStatusChange('S4')}
                        >
                            <FormattedMessage id='admin.doctor.complete' />
                        </button>
                        <button
                            className={`status-button ${selectedStatus === 'S5' ? 'active' : ''}`}
                            onClick={() => this.handleStatusChange('S5')}
                        >
                            <FormattedMessage id='admin.doctor.canceled' />
                        </button>
                    </div>
                    <div className='right-menu'>
                        <div className='col-6 selected-doctor'>
                            <Select
                                placeholder={<FormattedMessage id="menu.manage-doctor.choose-doctor" />}
                                value={this.state.selectedOptions}
                                onChange={this.handleChangeSelect}
                                options={this.state.arrDoctor}
                            />
                        </div>
                        <div className='col-6 seleted-date'>
                            <DatePicker
                                onChange={this.handleOnchangeDatePicker}
                                className='form-control'
                                selected={this.state.currentDate}
                                minDate={yesterday}
                                placeholder={this.props.intl.formatMessage({ id: 'manage-schedule.choose-date' })}
                            />
                        </div>
                    </div>
                </div>
                <div className="appointment-doctor-list-body">
                    <div className="appointment-manage-table">
                        <div className="appointment-container">
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th><FormattedMessage id='manage-user.record' /></th>
                                        <th>Email</th>
                                        <th><FormattedMessage id='manage-user.full-name' /></th>
                                        <th><FormattedMessage id='manage-user.phone-number' /></th>
                                        <th><FormattedMessage id='manage-schedule.schedule' /></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
                                                <FormattedMessage id="admin.doctor.appointment-avaiable" defaultMessage="No appointments available" />
                                            </td>
                                        </tr>
                                    ) : (
                                        appointments
                                            .filter(appointment => appointment.statusId === selectedStatus)
                                            .map((appointment, index) => (
                                                <tr key={appointment.id}>
                                                    <td>{index + 1 + (this.state.currentPage - 1) * this.state.limit}</td>
                                                    <td>{appointment?.recordId}</td>
                                                    <td>{appointment.appointmentData.email}</td>
                                                    <td>
                                                        {language === LANGUAGES.EN
                                                            ? `${appointment.appointmentData.firstName} ${appointment.appointmentData.lastName}`
                                                            : `${appointment.appointmentData.lastName} ${appointment.appointmentData.firstName}`}
                                                    </td>
                                                    <td>{appointment.appointmentData.phoneNumber}</td>
                                                    <td>{language === LANGUAGES.VI
                                                        ? appointment.timeTypeAppointment.valueVi
                                                        : appointment.timeTypeAppointment.valueEn}</td>
                                                    <td>
                                                        {(selectedStatus !== 'S5' && selectedStatus !== 'S4') &&
                                                            <button className="btn-edit"
                                                                onClick={() => this.handleConfirmAppointment(appointment.id)}
                                                            >
                                                                <FormattedMessage id="admin.doctor.confirm" />
                                                            </button>
                                                        }
                                                        {selectedStatus === 'S2' &&
                                                            <button className="btn-delete"
                                                                onClick={() => this.handleCancelAppointment(appointment.id)}
                                                            >
                                                                <FormattedMessage id="admin.doctor.refuse" />
                                                            </button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInFo: state.user.userInFo,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctorStart: (specialtyId, clinicId) => dispatch(actions.fetchAllDoctorStart(specialtyId, clinicId)),
        getAllRequiredDoctorInfo: () => dispatch(actions.fetchAllRequiredDoctorStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AppointmentManagement));
