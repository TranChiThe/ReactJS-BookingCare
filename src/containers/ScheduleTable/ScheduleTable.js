import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LANGUAGES } from '../../utils';
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import { deleteDoctorSchedule } from '../../services/userService'
import { FormattedMessage, injectIntl } from 'react-intl';
import Swal from 'sweetalert2';
import createSwalConfig from '../../components/NotificationConfig/SwalConfig'
import './ScheduleTable.scss'


class ScheduleTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentNumber: props.weekNumber || 1,
            totalPages: 4,
            daysInWeek: [],
        };
    }

    async componentDidMount() {
        this.updateDaysInWeek(this.props.weekNumber);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.weekNumber !== this.props.weekNumber) {
            this.setState({ currentNumber: this.props.weekNumber }, () => {
                this.updateDaysInWeek(this.state.currentNumber);
            });
        }
    }

    updateDaysInWeek(weekNumber) {
        const startOfWeek = this.getStartOfWeek(weekNumber);
        const daysInWeek = this.getDaysInWeek(startOfWeek);
        this.setState({ daysInWeek });
    }

    getDaysInWeek(startOfWeek) {
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }
        return weekDays;
    }

    getStartOfWeek(weekNumber) {
        const today = new Date();
        const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay();
        const firstMonday = new Date(today.setDate(today.getDate() + mondayOffset));
        firstMonday.setHours(0, 0, 0, 0);
        firstMonday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
        return firstMonday;
    }

    renderButton = (timeType, status, date) => {
        let iconClass = '';
        let buttonClass = 'schedule-button';
        let buttonText = '';
        let { language } = this.props;

        switch (status) {
            case 'busy':
                iconClass = 'fas fa-times-circle';
                buttonClass += ' busy';
                buttonText = language === LANGUAGES.VI ? 'Lịch bận' : 'Busy Schedule';
                break;
            case 'available':
                iconClass = 'fas fa-check-circle';
                buttonClass += ' available';
                buttonText = language === LANGUAGES.VI ? 'Lịch làm việc' : 'Working Schedule';
                break;
            default:
                iconClass = 'fas fa-circle';
                buttonClass += ' empty';
                buttonText = language === LANGUAGES.VI ? 'Lịch trống' : 'Empty Schedule';
                break;
        }

        return (
            <div className='button-container'>
                <button className={buttonClass} onClick={() => this.handleScheduleClick(timeType, status, date)}>
                    <i className={iconClass}></i>
                    <span className="button-text">{buttonText}</span>
                </button>
                <div className="menu-container">
                    <button className="menu-button" onClick={() => this.toggleMenu(timeType, date)}>
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    {this.state.openMenu === `${timeType}-${date}` && (
                        <div className="menu-dropdown">
                            <button onClick={() => this.handleDelete(timeType, status, date)}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    handleScheduleClick = async (timeType, status, date) => {
        let roleId = this.props.roleId
        if (roleId === 'R2' || roleId === '') {
            toast.error(<FormattedMessage id='patient.custome-toast.no-access' />)
        } else {
            console.log('check date: ', this.getDateTimestamp(date))
        }
    }

    handleDelete = async (timeType, status, date) => {
        let roleId = this.props.roleId;
        const { fetchScheduleData } = this.props;
        const SwalConfig = createSwalConfig(this.props.intl);
        let dateTime = this.getDateTimestamp(date);

        try {
            if (roleId === 'R1' || roleId === 'R4') {
                const result = await Swal.fire(SwalConfig.confirmDialog());

                if (result.isConfirmed) {
                    let res = await deleteDoctorSchedule(timeType, status, dateTime);
                    if (res && res.errCode === 0) {
                        if (fetchScheduleData) {
                            fetchScheduleData();
                        }
                        await Swal.fire(SwalConfig.successNotification(
                            'notification.delete-success.deleteText'
                        ));
                    } else {
                        toast.error(<FormattedMessage id="toast.error" />);
                    }
                }
            } else if (roleId === 'R2') {
                // Role R2 only has access if status is 'busy'
                const result = await Swal.fire(SwalConfig.confirmDialog());

                if (status === 'busy') {
                    if (result.isConfirmed) {
                        let res = await deleteDoctorSchedule(timeType, status, dateTime);

                        if (res && res.errCode === 0) {
                            if (fetchScheduleData) {
                                fetchScheduleData();
                            }
                            await Swal.fire(SwalConfig.successNotification(
                                'notification.delete-success.deleteText'
                            ));

                        } else {
                            toast.error(<FormattedMessage id="toast.error" />);
                        }
                    }
                }
                else {
                    toast.error(<FormattedMessage id="toast.no-access" />);
                }
            } else {
                toast.error(<FormattedMessage id="toast.no-access" />);
            }
        } catch (error) {
            console.error("Error handling delete:", error);
            toast.error(<FormattedMessage id="toast.error" />);
        }
        this.setState({ openMenu: null });
    };

    toggleMenu = (timeType, date) => {
        const menuId = `${timeType}-${date}`;
        this.setState({ openMenu: this.state.openMenu === menuId ? null : menuId });
    };

    getDaysInWeek = (date) => {
        const weekDays = [];
        const currentDate = new Date(date);
        const firstDayOfWeek = currentDate.getDate() - currentDate.getDay() + 1;
        for (let i = 0; i < 7; i++) {
            weekDays.push(new Date(currentDate.setDate(firstDayOfWeek + i)));
        }
        return weekDays;
    };

    getFirstDayOfWeek = (date) => {
        const currentDate = new Date(date);
        const firstDayOfWeek = currentDate.getDate() - currentDate.getDay() + 1;
        currentDate.setDate(firstDayOfWeek);
        currentDate.setHours(0, 0, 0, 0);
        return currentDate.getTime();
    }

    getTimeType = (day) => {
        return new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    };

    getDateTimestamp = (date) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const dateOnly = new Date(year, month, day);
        return dateOnly.getTime();
    };

    render() {
        const { rangeTime, dataScheduleForWeek, currentNumber } = this.props;
        let { language } = this.props;
        let { daysInWeek } = this.state
        return (
            <div className="schedule-table">
                <div className="table-header">
                    <div className="header-item"></div>
                    {daysInWeek.map((day, index) => (
                        <div className="row-item" key={index}>
                            {language === LANGUAGES.VI
                                ? day.toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric'
                                })
                                : day.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric'
                                })}
                        </div>
                    ))}
                </div>
                <div className="table-body">
                    {rangeTime && Array.isArray(rangeTime) && rangeTime.length > 0 ? (
                        rangeTime.map((timeSlot, index) => (
                            <div className="table-row" key={index}>
                                <div className="row-item">
                                    {language === LANGUAGES.VI ? timeSlot.valueVi : timeSlot.valueEn}
                                </div>
                                {dataScheduleForWeek && Array.isArray(dataScheduleForWeek) ? (
                                    dataScheduleForWeek.map((daySchedule, dayIndex) => {
                                        let status = 'empty';

                                        if (daysInWeek && daysInWeek.length > dayIndex) {
                                            const timestamp = daysInWeek[dayIndex].getTime();
                                            const date = new Date(timestamp);
                                            date.setHours(0, 0, 0, 0);
                                            const timestampDate = this.getDateTimestamp(date);
                                            const timeTypeTimestamp = parseInt(daySchedule.timeType);
                                            if (daySchedule.timeType === timeTypeTimestamp.toString()) {
                                                if (daySchedule.busy.includes(timeSlot.keyMap)) {
                                                    status = 'busy';
                                                } else if (daySchedule.working.includes(timeSlot.keyMap)) {
                                                    status = 'available';
                                                }
                                            }
                                        } else {
                                            console.warn('daysInWeek is not valid or dayIndex is out of range');
                                        }

                                        return (
                                            <div className="row-item" key={dayIndex}>
                                                {this.renderButton(timeSlot.keyMap, status, daysInWeek[dayIndex])}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="row-item">No schedule available</div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="row-item">No time slots available</div>
                    )}
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInFo: state.user.userInFo,
        roleId: state.auth.role
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ScheduleTable));
