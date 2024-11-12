import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getDashBoardInfo } from '../../../../../services/userService'
import './AdminDashboard.scss';

class AdminDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalUser: 0,
            totalDoctor: 0,
            totalPatient: 0,
            totalFeedBack: 0,
            totalAppointment: 0,

        }
    }

    async componentDidMount() {
        await this.fetDashBoardInfo()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    fetDashBoardInfo = async () => {
        let user = await getDashBoardInfo('user');
        let doctor = await getDashBoardInfo('doctor');
        let patient = await getDashBoardInfo('patient');
        let appointment = await getDashBoardInfo('appointment');
        if ((user && user.errCode === 0) ||
            (doctor && doctor.errCode === 0) ||
            (patient && patient.errCode === 0) ||
            (appointment && appointment.errCode === 0)) {
            this.setState({
                totalUser: user.data.userCount + patient.data.patientCount,
                totalDoctor: doctor.data.doctorCount,
                totalAppointment: appointment.data.appointmentCount
            })
        }
    }


    render() {
        let { totalUser, totalDoctor, totalAppointment } = this.state
        return (
            <React.Fragment>
                <div className="admin-dashboard">
                    <div className='admin-title'>
                        <FormattedMessage id='admin.dashboard.admin' />
                    </div>
                    <div className='dashboard-content'>
                        <div className="data-boxes">
                            <div className="data-box box-users">
                                <i className="fas fa-user-circle"></i>
                                <h2>
                                    <FormattedMessage id='admin.dashboard.user' />
                                </h2>
                                <p>{totalUser}</p>
                            </div>
                            <div className="data-box box-doctors">
                                <i className="fas fa-user-md"></i>
                                <h2>
                                    <FormattedMessage id='admin.dashboard.doctor' />
                                </h2>
                                <p>{totalDoctor}</p>
                            </div>
                            <div className="data-box box-appointments">
                                <i className="fas fa-calendar-check"></i>
                                <h2>
                                    <FormattedMessage id='admin.dashboard.appointment' />
                                </h2>
                                <p>{totalAppointment}</p>
                            </div>
                            <div className="data-box box-feedback">
                                <i className="fas fa-comments"></i>
                                <h2>
                                    <FormattedMessage id='admin.dashboard.feedback' />
                                </h2>
                                <p>80</p>
                            </div>
                        </div>
                        <div className="chart-container">
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AdminDashboard;
