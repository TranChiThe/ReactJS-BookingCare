import React, { Component } from 'react';
import BarChart from './BarChart';
import './StatisticalChart.scss';
import { getCountPatientByTime, getAppointmentByTime } from '../../../../../services/userService';
import { FormattedMessage, injectIntl } from 'react-intl';
import NumberFormat from 'react-number-format';

class StatisticalChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFilter: 'monthly',
            selectedMonth: new Date().getMonth() + 1,
            selectedYear: new Date().getFullYear(),
            patientData: [],
            totalAppointment: '',
            totalPatient: '',
            newAppointment: '',
            cancelledAppointment: '',
            totalRevenue: ''
        };
    }

    async componentDidMount() {
        await this.getCountPatientByTime();
        await this.getAppointmentByTime();
    }

    getCountPatientByTime = async () => {
        const { selectedFilter, selectedMonth, selectedYear } = this.state;
        let res = await getCountPatientByTime(selectedFilter, selectedMonth, selectedYear);
        if (res && res.errCode === 0) {
            this.setState({
                patientData: res.data,
            });
        } else {
            this.setState({ patientData: [] });
        }
    }

    getAppointmentByTime = async () => {
        const { selectedMonth, selectedYear } = this.state;
        const statusIds = ['S1', 'S2', 'S3', 'S4', 'S5'];
        const totalAppointmentPromises = statusIds.map(statusId =>
            getAppointmentByTime(statusId, selectedMonth, selectedYear)
        );
        const results = await Promise.all(totalAppointmentPromises);
        let totalAppointment = 0;
        let newAppointment = 0;
        let cancelledAppointment = 0;
        let totalRevenue = 0;
        let totalPatient = 0;
        results.forEach((res, index) => {
            if (res && res.errCode === 0) {
                switch (statusIds[index]) {
                    case "S1":
                        totalAppointment += res.data.appointmentCount;
                        // totalPatient = res.data.totalPatient
                        break;
                    case "S2":
                        newAppointment += res.data.appointmentCount;
                        totalAppointment += res.data.appointmentCount;
                        // totalPatient = res.data?.totalPatient

                        break;
                    case "S3":
                        totalAppointment += res.data.appointmentCount;
                        // totalPatient = res.data?.totalPatient
                        totalPatient += res.data.totalPatient;

                        break;
                    case "S4":
                        totalRevenue += res.data.totalRevenue;
                        totalAppointment += res.data.appointmentCount;
                        // totalPatient = res.data?.totalPatient
                        totalPatient += res.data.totalPatient;

                        break;
                    case "S5":
                        cancelledAppointment += res.data.appointmentCount;
                        totalAppointment += res.data.appointmentCount;
                        // totalPatient = res.data?.totalPatient

                        break;
                    default:
                        break;
                }
            }
        });

        this.setState({
            totalAppointment,
            newAppointment,
            cancelledAppointment,
            totalRevenue,
            totalPatient
        });
    }

    handleFilterChange = (event) => {
        this.setState({ selectedFilter: event.target.value, selectedMonth: '', selectedYear: '' },
            () => {
                this.getAppointmentByTime();
                this.getCountPatientByTime()
            }
        );
    };

    handleMonthChange = (event) => {
        this.setState({ selectedMonth: event.target.value },
            () => {
                this.getAppointmentByTime();
                this.getCountPatientByTime()
            }
        );
    };

    handleYearChange = (event) => {
        this.setState({ selectedYear: event.target.value },
            () => {
                this.getAppointmentByTime();
                this.getCountPatientByTime()
            }
        );
    };

    render() {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const years = Array.from({ length: 10 }, (_, i) => 2024 + i);
        const { totalAppointment, cancelledAppointment, newAppointment, totalRevenue } = this.state;
        let totalPatient = this.state.totalPatient
        console.log('check state:', this.state)
        return (
            <div className="dashboard-container">
                <div className='dashboard-title'>
                    <FormattedMessage id="menu.manage-statistical.manage-statistical" />
                </div>
                <div className='dashboard-content'>
                    <div className="left-section">
                        <div className="metric-box">
                            <div className="metric-title">
                                <FormattedMessage id='admin.staff.totalAppointment' />
                            </div>
                            <div className="metric-value">{totalAppointment}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">
                                <FormattedMessage id='admin.staff.totalRevenue' />
                            </div>
                            <div className="metric-value">
                                <NumberFormat
                                    className='currency'
                                    value={totalRevenue}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'đ'}
                                />
                            </div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">
                                <FormattedMessage id='admin.staff.totalPatient' />
                            </div>
                            <div className="metric-value">{totalPatient}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">
                                <FormattedMessage id='admin.staff.newAppointment' />
                            </div>
                            <div className="metric-value">{newAppointment}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">
                                <FormattedMessage id='admin.staff.cancelledAppointment' />
                            </div>
                            <div className="metric-value">{cancelledAppointment}</div>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="date-filter">
                            <div className='form-group'>
                                <label>
                                    <FormattedMessage id='admin.staff.filter' />
                                </label>
                                <select value={this.state.selectedFilter} onChange={this.handleFilterChange}>
                                    <option value="weekly">
                                        {this.props.intl.formatMessage({ id: 'admin.staff.week' })}
                                    </option>
                                    <option value="monthly">
                                        {this.props.intl.formatMessage({ id: 'admin.staff.month' })}
                                    </option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <FormattedMessage id='admin.staff.month' />
                                </label>
                                <select value={this.state.selectedMonth} onChange={this.handleMonthChange}>
                                    <option value="">
                                        {this.props.intl.formatMessage({ id: 'admin.staff.month' })}
                                    </option>
                                    {months.map((month) => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <FormattedMessage id='admin.staff.year' />
                                </label>
                                <select value={this.state.selectedYear} onChange={this.handleYearChange}>
                                    <option value="">
                                        {this.props.intl.formatMessage({ id: 'admin.staff.year' })}
                                    </option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="chart-container">
                            <h2>
                                <FormattedMessage id='admin.staff.statistics' />
                            </h2>
                            <BarChart data={this.state.patientData} selectedFilter={this.state.selectedFilter} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (injectIntl(StatisticalChart));
