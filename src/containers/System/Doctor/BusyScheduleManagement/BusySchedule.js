import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import DatePicker from '../../../../components/Input/DatePicker';
import { toast } from 'react-toastify'
import _ from 'lodash'
import { doctorBusySchedule } from '../../../../services/userService'
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig';


class ManageBusySchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            dataSchedule: [],
            rangeTime: [],
            reason: '',
        }
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
    }

    componentDidMount() {
        this.props.getDetailInforDoctor();
        this.props.fetchScheduleHoursStart();
        this.props.createBulkScheduleDoctor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                arrDoctor: dataSelect,
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.isSelected = false;
                    return item;
                })
            }
            this.setState({
                rangeTime: data,
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                arrDoctor: dataSelect,
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handleOnchangeDatePicker = async (date) => {
        this.setState({
            currentDate: date[0],
        })
    }

    handleClickButtonTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, currentDate } = this.state;
        let { language } = this.props
        let result = [];
        let SwalConfig = createSwalConfig(this.props.intl)
        if (!currentDate) {
            if (language === LANGUAGES.EN) {
                toast.error('Invalid date!')
            } else if (language === LANGUAGES.VI) {
                toast.error('Ngày không hợp lệ!')
            }
            return;
        }
        let formatedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(item => {
                    let object = {};
                    object.doctorId = this.props.userInFo ? this.props.userInFo.id : '';
                    object.date = formatedDate;
                    object.timeType = item.keyMap;
                    object.reason = this.state.reason
                    result.push(object);
                })
            } else {
                if (language === LANGUAGES.EN) {
                    toast.error('Please select a busy time slot!')
                } else if (language === LANGUAGES.VI) {
                    toast.error('Vui lòng chọn khung giờ bận!')
                }
                return;
            }
        }
        let res = await doctorBusySchedule({
            arrSchedule: result,
            doctorId: this.props.userInFo ? this.props.userInFo.id : '',
            formatedDate: formatedDate,
            reason: this.state.reason
        });
        if (res && res.errCode === 1) {
            toast.error(<FormattedMessage id="toast.missing" />)
        }
        else if (res && res.errCode === 0) {
            Swal.fire(SwalConfig.successNotification(
                'notification.busy-schedule.textSuccess'
            ))
            this.setState(prevState => ({
                rangeTime: prevState.rangeTime.map(item => ({
                    ...item,
                    isSelected: false,
                    currentDate: new Date(new Date().setDate(new Date().getDate() + 7))
                }))
            }));
        } else if (res && res.errCode === 2) {
            toast.error(<FormattedMessage id='notification.busy-schedule.toast' />)
        } else {
            Swal.fire(SwalConfig.errorNotification(
                'notification.busy-schedule.textFail'
            ))
        }
    }

    handleTextareaChange(event) {
        this.setState({ reason: event.target.value });
    }

    render() {
        let { language } = this.props;
        let { rangeTime } = this.state;
        let nextWeek = new Date(new Date().setDate(new Date().getDate() + 7))
        console.log('check state: ', this.state)
        return (
            <React.Fragment>
                <div className='manage-schedule-container'>
                    <div className='manage-schedule-title'>
                        <FormattedMessage id="manage-schedule.busy-schedule-title" />
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="manage-schedule.reason" />
                                </label>
                                <textarea
                                    className="form-control reason-textarea"
                                    rows="2"
                                    placeholder="Nhập lý do..."
                                    value={this.state.reason}
                                    onChange={this.handleTextareaChange}
                                />
                            </div>
                            <div className='col-2 form-group'>
                                <label>
                                    <FormattedMessage id="manage-schedule.choose-date" />
                                </label>
                                <DatePicker
                                    placeholder={this.props.intl.formatMessage({ id: 'manage-schedule.choose-date' })}
                                    onChange={this.handleOnchangeDatePicker}
                                    className='form-control'
                                    selected={this.state.currentDate}
                                    minDate={nextWeek}
                                />
                            </div>
                            <div className={language === LANGUAGES.VI ? 'col-12 pick-hour-container' : 'col-12 pick-hour-container'}>
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <div className='' key={index}>
                                                <button className={item.isSelected === true ?
                                                    'btn btn-schedule active' : 'btn btn-schedule'}
                                                    onClick={() => this.handleClickButtonTime(item)}
                                                >
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-12'>
                                <button className='btn btn-primary btn-save-schedule'
                                    onClick={() => this.handleSaveSchedule()}
                                >
                                    <FormattedMessage id="manage-schedule.save" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div >

            </React.Fragment>

        )
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        detailDoctor: state.admin.detailDoctor,
        allScheduleTime: state.admin.allScheduleTime,
        bulkScheduleDoctor: state.admin.bulkScheduleDoctor,
        roleId: state.auth.role,
        userInFo: state.user.userInFo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailInforDoctor: (data) => dispatch(actions.fetchDetailInforDoctorStart(data)),
        fetchScheduleHoursStart: () => dispatch(actions.fetchScheduleHoursStart()),
        createBulkScheduleDoctor: (data) => dispatch(actions.saveBulkScheduleDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageBusySchedule));

