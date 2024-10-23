import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, dateFormat } from '../../../../utils';
import Select from 'react-select';
import DatePicker from '../../../../components/Input/DatePicker';
import { toast } from 'react-toastify'
import _ from 'lodash'
import { saveBulkScheduleDoctor, getScheduleDoctorByDate, getAllDoctorSchedule } from '../../../../services/userService'
import ManageListDoctorSchedule from './ManageListDoctorSchedule';
import { saveScheduleInfoSuccess, saveScheduleInfoFail } from '../../../../components/NotificationConfig/notificationConfig'
import './ManageSchedule.scss'


class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctor: [],
            selectedDoctor: {},
            currentDate: '',
            dataSchedule: [],
            isShowTable: false,
        }
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
        if (prevState.currentDate !== this.state.currentDate) {
            this.handleScheduleSearch()
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
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let { language } = this.props
        let result = [];
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            if (language === LANGUAGES.EN) {
                toast.error('Please select the doctor you want to schedule an appointment with!')
            } else if (language === LANGUAGES.VI) {
                toast.error('Vui lòng chọn bác sĩ cần tạo lịch khám!')
            }
            return;
        }
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
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = item.keyMap;
                    result.push(object);
                })
                console.log('check selected time:', selectedTime)
            } else {
                if (language === LANGUAGES.EN) {
                    toast.error('Please select an appointment time!')
                } else if (language === LANGUAGES.VI) {
                    toast.error('Vui lòng chọn khung giờ khám bệnh!')
                }
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate,
        });
        if (res) {
            saveScheduleInfoSuccess(this.props.language);
            this.setState({
                selectedDoctor: {},
            })
        } else {
            saveScheduleInfoFail(this.props.language);
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
                        isShowTable: true
                    })
                } else {
                    this.setState({
                        isShowTable: false
                    })
                }

            }
        }
    }

    getAllDoctorSchedule = async () => {
        let data = await getAllDoctorSchedule();
    }

    render() {
        let { language } = this.props;
        let { rangeTime } = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        return (
            <React.Fragment>
                <div className='manage-schedule-container'>
                    <div className='manage-schedule-title'>
                        <FormattedMessage id="manage-schedule.title" />
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-4 form-group'>
                                <label>
                                    <FormattedMessage id="manage-schedule.choose-doctor" />
                                </label>
                                <Select
                                    placeholder={<FormattedMessage id="manage-schedule.choose-doctor" />}
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.arrDoctor}
                                />
                            </div>
                            <div className='col-2'>
                                <label>
                                    <FormattedMessage id="manage-schedule.choose-date" />
                                </label>
                                <DatePicker
                                    placeholder={''}
                                    onChange={this.handleOnchangeDatePicker}
                                    className='form-control'
                                    selected={this.state.currentDate}
                                    minDate={yesterday}
                                />
                            </div>
                            <div className='col-2'>
                                <button className='schedule-search'
                                    onClick={() => this.handleScheduleSearch()}
                                >
                                    <FormattedMessage id="manage-schedule.search" />
                                </button>
                            </div>
                            <div className={language === LANGUAGES.VI ? 'col-8 pick-hour-container' : 'col-8 pick-hour-container'}>
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <div className=''>
                                                <button className={item.isSelected === true ?
                                                    'btn btn-schedule active' : 'btn btn-schedule'}
                                                    key={index}
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
                {this.state.isShowTable &&
                    <ManageListDoctorSchedule
                        dataSchedule={this.state.dataSchedule}
                        handleScheduleSearch={this.handleScheduleSearch}
                    />
                }


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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);