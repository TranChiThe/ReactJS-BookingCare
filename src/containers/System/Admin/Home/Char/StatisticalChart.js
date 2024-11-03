import React, { Component } from 'react';
import BarChart from './BarChart';
import './StatisticalChart.scss';
import { getCountPatientByTime, getAppointmentByTime } from '../../../../../services/userService';
import { FormattedMessage } from 'react-intl';

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
            cancelledAppointment: ''
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
            this.setState({ patientData: res.data });
        } else {
            this.setState({ patientData: [] });
        }
    }

    getAppointmentByTime = async () => {
        const { selectedMonth, selectedYear } = this.state;
        let totalAppointment = await getAppointmentByTime("R2", selectedMonth, selectedYear);
        if (totalAppointment && totalAppointment.errCode === 0) {
            this.setState({ totalAppointment: totalAppointment.data });
        }
    }

    handleFilterChange = (event) => {
        this.setState({ selectedFilter: event.target.value, selectedMonth: '', selectedYear: '' }, this.getCountPatientByTime);
    };

    handleMonthChange = (event) => {
        this.setState({ selectedMonth: event.target.value }, this.getCountPatientByTime);
        this.getAppointmentByTime();
    };

    handleYearChange = (event) => {
        this.setState({ selectedYear: event.target.value }, this.getCountPatientByTime);
        this.getAppointmentByTime();
    };

    render() {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const years = Array.from({ length: 10 }, (_, i) => 2024 + i);
        const { totalAppointment, totalPatient, cancelledAppointment } = this.state;

        return (
            <div className="dashboard-container">
                <div className='dashboard-title'>
                    <FormattedMessage id="menu.manage-statistical.manage-statistical" />
                </div>
                <div className='dashboard-content'>
                    <div className="left-section">
                        <div className="metric-box">
                            <div className="metric-title">Total Appointments</div>
                            <div className="metric-value">{totalAppointment}</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">Total Revenue</div>
                            <div className="metric-value">$5000</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">Total Patients</div>
                            <div className="metric-value">300</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">New Appointments</div>
                            <div className="metric-value">20</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-title">Cancelled Appointments</div>
                            <div className="metric-value">5</div>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="date-filter">
                            <div className='form-group'>
                                <label>Filter By:</label>
                                <select value={this.state.selectedFilter} onChange={this.handleFilterChange}>
                                    <option value="weekly">Week</option>
                                    <option value="monthly">Month</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Month:</label>
                                <select value={this.state.selectedMonth} onChange={this.handleMonthChange}>
                                    <option value="">Month</option>
                                    {months.map((month) => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Year:</label>
                                <select value={this.state.selectedYear} onChange={this.handleYearChange}>
                                    <option value="">Year</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="chart-container">
                            <h2>Patient Count Chart</h2>
                            <BarChart data={this.state.patientData} selectedFilter={this.state.selectedFilter} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatisticalChart;
