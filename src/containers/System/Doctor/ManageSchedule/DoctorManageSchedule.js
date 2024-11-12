import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import { getScheduleDoctorByDate, getScheduleDoctorForWeek } from '../../../../services/userService'
import ScheduleTable from '../../../ScheduleTable/ScheduleTable';
import * as actions from '../../../../store/actions'
import Pagination from '../../../../components/Pagination/Pagination';
import './DoctorManageSchedule.scss'
import { toast } from 'react-toastify';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: '',
            arrSchedule: {},
            rangeTime: [],
            dataScheduleForWeek: [],
            currentPage: 1,
            totalPages: 4,
            weekDates: []
        }
    }

    async componentDidMount() {
        this.props.fetchScheduleHoursStart();
        this.fetchScheduleData();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
        if (prevState.currentDate !== this.state.currentDate) {
            let doctorId = this.props.userInFo ? this.props.userInFo.id : ''
            let { currentDate } = this.state;
            let dateSchedule = new Date(currentDate).getTime();
            let res = await getScheduleDoctorByDate(doctorId, dateSchedule)
            if (res && res.errCode === 0) {
                this.setState({
                    arrSchedule: res.data
                })
            }
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.isSelected = false;
                    return item;
                });
            }
            this.setState({
                rangeTime: data,
            });
        }
    }

    handleOnchangeDatePicker = async (date) => {
        let { currentDate } = this.state;
        let dateSchedule = new Date(currentDate).getTime();
        let doctorId = this.props.userInFo ? this.props.userInFo.id : ''
        this.setState({
            currentDate: date[0],
        })
        let res = await getScheduleDoctorByDate(doctorId, dateSchedule)
        if (res && res.errCode === 0) {
            this.setState({
                arrSchedule: res.data
            })
        }
    }

    fetchScheduleData = async () => {
        try {
            let res = await getScheduleDoctorForWeek(this.props.userInFo?.id, this.state.currentPage);
            if (res && res.errCode === 0) {
                // Chuyển đổi dữ liệu thành mảng lịch trình
                const schedulesArray = Object.keys(res.data).map(key => ({
                    timeType: key,
                    ...res.data[key]
                }));

                this.setState({
                    dataScheduleForWeek: schedulesArray
                });
            } else {
                console.error('Error fetching schedule data: ', res?.message || 'Unknown error');
                toast.error(<FormattedMessage id='toast.error' />)
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            toast.error(<FormattedMessage id='toast.error' />)
        }
    };

    calculateWeekDates = () => {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(firstDayOfWeek);
            date.setDate(firstDayOfWeek.getDate() + i);
            return date.getTime();
        });
        this.setState({ weekDates });
    }

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage }, () => {
            this.fetchScheduleData();
        });
    };

    render() {
        const { language } = this.props;
        let { rangeTime, dataScheduleForWeek, currentPage, totalPages } = this.state
        return (
            <div className='doctor-manage-schedule-container'>
                <div className='manage-schedule-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <ScheduleTable
                    rangeTime={rangeTime}
                    dataScheduleForWeek={dataScheduleForWeek}
                    weekNumber={currentPage}
                    fetchScheduleData={this.fetchScheduleData}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInFo: state.user.userInFo,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchScheduleHoursStart: () => dispatch(actions.fetchScheduleHoursStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
