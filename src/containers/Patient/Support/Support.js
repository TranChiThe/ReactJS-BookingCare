import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage, injectIntl } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getAllPatientAppointment, postCancelAppointment, handlePostComment } from "../../../services/userService";
import Swal from "sweetalert2";
import createSwalConfig from "../../../components/NotificationConfig/SwalConfig";
import { toast } from "react-toastify";
import "./Support.scss";

class Support extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            recordId: '',
            appointments: [],
            comment: '',
            doctorId: '',
            patientId: ''
        };
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };


    fetchAppointments = async () => {
        try {
            let { email, recordId } = this.state
            if (!this.validateEmail(email)) {
                toast.error(<FormattedMessage id='toast.email' />)
            } else {
                const res = await getAllPatientAppointment(email, recordId);
                if (res && res.errCode === 0) {
                    this.setState({
                        appointments: res.appointment,
                    });
                } else if (res && res.errCode === 2 || recordId === '') {
                    toast.error(<FormattedMessage id='patient.support.toast' />)
                }
                else {
                    console.error('Error fetching appointments:', res.errMessage);
                }
            }

        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    handleOnchangeText = (event, id) => {
        let value = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = value;
        this.setState({
            ...stateCopy
        });
    };

    getDateTimestamp = (dateString) => {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    handleCancelAppointment = async (appointmentId, event) => {
        event.preventDefault();
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

    handleSearch = async () => {
        await this.fetchAppointments();
    }

    handleAppointmentSuccess = (event) => {
        event.preventDefault();
        const SwalConfig = createSwalConfig(this.props.intl);
        Swal.fire({
            title: this.props.intl.formatMessage({ id: 'patient.comment.title' }),
            html: `
            <textarea id="commentInput" class="swal2-input custom-textarea" placeholder="Enter your comment" rows="6"></textarea>
            `,
            confirmButtonText: this.props.intl.formatMessage({ id: 'patient.comment.confirm' }),
            showCancelButton: true,
            cancelButtonText: this.props.intl.formatMessage({ id: 'notification.cancel' }),
            preConfirm: () => {
                const comment = document.getElementById('commentInput').value;
                if (!comment) {
                    Swal.showValidationMessage(this.props.intl.formatMessage({ id: 'patient.comment.empty' }));
                }
                return comment;
            }
        }).then(result => {
            if (result.isConfirmed) {
                const comment = result.value;
                this.handleSaveComment(comment);
            }
        });
    };

    handleSaveComment = async (comment) => {
        const SwalConfig = createSwalConfig(this.props.intl);
        let { appointments } = this.state;
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        let datetimeStamp = date.getTime();
        let res = await handlePostComment({
            doctorId: appointments[0]?.doctorId || '',
            patientId: appointments[0]?.patientId || '',
            content: comment,
            date: datetimeStamp,
            examinationDate: appointments[0]?.date || ''
        })
        if (res && res.errCode === 0) {
            Swal.fire(SwalConfig.successNotification('notification.comment.textSuccess'))
        } else {
            Swal.fire(SwalConfig.errorNotification('notification.comment.textFail'))
        }
    }

    render() {
        let { email, recordId, appointments } = this.state;
        let { language } = this.props;
        console.log('check state: ', this.state)
        return (
            <>
                <HomeHeader />
                <div className="patient-support-container">
                    <div className="support-tile">
                        <FormattedMessage id='patient.support.manage-schedule' />
                    </div>
                    <div className="support-body-container">
                        <div className="search-container">
                            <div className="search-item-support">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={this.props.intl.formatMessage({ id: 'patient.support.email' })}
                                    value={email}
                                    onChange={(event) => this.handleOnchangeText(event, 'email')}
                                />
                                {this.state.emailError && (
                                    <div className="error-message">{this.state.emailError}</div>
                                )}
                                <input
                                    type="textt"
                                    className="form-control"
                                    placeholder={this.props.intl.formatMessage({ id: 'patient.support.record' })}
                                    value={recordId}
                                    onChange={(event) => this.handleOnchangeText(event, 'recordId')}
                                />
                                <button className="btn-search"
                                    onClick={() => this.handleSearch()}
                                >
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="appointment-details-form">
                        {appointments.length === 0 ? (
                            <div className="no-appointments" colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
                                <FormattedMessage id="admin.doctor.appointment-avaiable" defaultMessage="No appointments available" />
                            </div>
                        ) : (
                            appointments.map((appointment, index) => (
                                <form key={appointment.id} className="appointment-form">
                                    <div className="form-section">
                                        <h3><FormattedMessage id='patient.support.doctorInfo' /></h3>
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <span>{appointment.doctorAppoitmentData.email}</span>
                                        </div>
                                        <div className="form-group">
                                            <label><FormattedMessage id='patient.support.fullName' /></label>
                                            <span>
                                                {language === LANGUAGES.EN
                                                    ? `${appointment.doctorAppoitmentData.firstName} ${appointment.doctorAppoitmentData.lastName}`
                                                    : `${appointment.doctorAppoitmentData.lastName} ${appointment.doctorAppoitmentData.firstName}`}
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label><FormattedMessage id='patient.support.phoneNumber' /></label>
                                            <span>{appointment.doctorAppoitmentData.phoneNumber}</span>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3><FormattedMessage id='patient.support.patientInfo' /></h3>
                                        <div className="form-group">
                                            <label><FormattedMessage id='patient.support.fullName' /></label>
                                            <span>
                                                {language === LANGUAGES.EN
                                                    ? `${appointment.appointmentData.firstName} ${appointment.appointmentData.lastName}`
                                                    : `${appointment.appointmentData.lastName} ${appointment.appointmentData.firstName}`}
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label><FormattedMessage id='patient.support.reason' /></label>
                                            <span>{appointment.reason}</span>
                                        </div>
                                        <div className="form-group">
                                            <label><FormattedMessage id='patient.support.date' /></label>
                                            <span>
                                                {language === LANGUAGES.EN
                                                    ? `${appointment.timeTypeAppointment.valueEn} `
                                                    : `${appointment.timeTypeAppointment.valueVi} `}
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label><FormattedMessage id='patient.support.status' /></label>
                                            <span>
                                                {language === LANGUAGES.EN
                                                    ? `${appointment.statusData.valueEn} `
                                                    : `${appointment.statusData.valueVi} `}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        {appointment.statusId === 'S2' &&
                                            <button
                                                className="btn-cancel"
                                                onClick={(event) => this.handleCancelAppointment(appointment.id, event)}
                                            >
                                                <FormattedMessage id='patient.support.cancel' />
                                            </button>
                                        }
                                        {appointment.statusId === 'S4' &&
                                            <button
                                                className="btn-comment"
                                                onClick={(event) => this.handleAppointmentSuccess(event)}
                                            >
                                                <FormattedMessage id='patient.comment.comment' />
                                            </button>
                                        }
                                    </div>
                                </form>
                            ))
                        )}
                    </div>

                </div>
                <HomeFooter />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Support));
