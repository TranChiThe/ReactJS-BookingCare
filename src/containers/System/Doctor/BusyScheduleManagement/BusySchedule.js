import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, dateFormat } from '../../../../utils';
import Select from 'react-select';
import DatePicker from '../../../../components/Input/DatePicker';
import { toast } from 'react-toastify'
import _ from 'lodash'
import { getScheduleDoctorByDate, doctorBusySchedule } from '../../../../services/userService'
import { saveBusyScheduleInfoFail, saveBusyScheduleInfoSuccess } from '../../../../components/NotificationConfig/notificationConfig'
// import './AdminScheduleManage.scss'


class ManageBusySchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctor: [],
            selectedDoctor: '',
            currentDate: '',
            dataSchedule: [],
            isOpenModal: false,
            rangeTime: [],
            reason: '',
        }
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllDoctorStart();
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

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
    };

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
        if (res) {
            saveBusyScheduleInfoSuccess(this.props.language);
            this.setState(prevState => ({
                rangeTime: prevState.rangeTime.map(item => ({
                    ...item,
                    isSelected: false
                }))
            }));
        } else {
            saveBusyScheduleInfoFail(this.props.language);
        }
    }

    handleScheduleSearch = async () => {
        let { currentDate, selectedDoctor } = this.state;
        let date = new Date(currentDate).getTime();
        if (selectedDoctor.value && date) {
            let res = await getScheduleDoctorByDate(selectedDoctor.value, date)
            if (res && res.errCode === 0) {
                if (res.data !== '') {
                    this.setState({
                        dataSchedule: res.data,
                        isOpenModal: true
                    })
                } else {
                    this.setState({
                        isOpenModal: false
                    })
                }

            }
        }
    }

    handleChangeToggle = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal
        })
    }

    handleTextareaChange(event) {
        this.setState({ reason: event.target.value });
    }

    render() {
        let { language } = this.props;
        let { rangeTime } = this.state;
        console.log('check date: ', this.state);
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
                                    placeholder={''}
                                    onChange={this.handleOnchangeDatePicker}
                                    className='form-control'
                                    selected={this.state.currentDate}
                                    minDate={new Date()}
                                />
                            </div>
                            <div className='col-2 form-group'>
                                <button className='schedule-search'
                                    onClick={() => this.handleScheduleSearch()}
                                >
                                    <FormattedMessage id="manage-schedule.search" />
                                </button>
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
        fetchAllDoctorStart: () => dispatch(actions.fetchAllDoctorStart()),
        getDetailInforDoctor: (data) => dispatch(actions.fetchDetailInforDoctorStart(data)),
        fetchScheduleHoursStart: () => dispatch(actions.fetchScheduleHoursStart()),
        createBulkScheduleDoctor: (data) => dispatch(actions.saveBulkScheduleDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBusySchedule);

