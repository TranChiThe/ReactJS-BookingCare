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

        };
    }

    async componentDidMount() {
        await this.fetchAppointments();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedStatus !== this.state.selectedStatus) {
            this.fetchAppointments()
        }
    }

    fetchAppointments = async () => {
        try {
            let doctorId = this.props.userInFo.id
            let { selectedStatus, currentPage, limit, currentDate, searchTerm } = this.state
            const res = await getPatientAppointment(doctorId, selectedStatus, currentDate, searchTerm, currentPage, limit);
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

    render() {
        const { selectedStatus, appointments, currentPage, totalPages } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        console.log('check state: ', this.getDateTimestamp(this.state.currentDate))
        return (
            <div className="appointment-doctor-manage-list-container">
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
                <div className='doctor-menu'>
                    <div className="status-buttons">
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
                    <div className='col-2 form-group seleted-date'>
                        <DatePicker
                            onChange={this.handleOnchangeDatePicker}
                            className='form-control'
                            selected={this.state.currentDate}
                            minDate={yesterday}
                            placeholder={this.props.intl.formatMessage({ id: 'manage-schedule.choose-date' })}
                        />
                    </div>
                </div>
                <div className="appointment-doctor-list-body">
                    <div className="appointment-manage-table">
                        <div className="appointment-container">
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th></th>
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
                                                    <td>{index + 1}</td>
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
        userInFo: state.user.userInFo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AppointmentManagement));
