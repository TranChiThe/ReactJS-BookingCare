import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, dateFormat } from '../../../../utils';
import Select from 'react-select';
import DatePicker from '../../../../components/Input/DatePicker';
import { toast } from 'react-toastify'
import _ from 'lodash'
import { saveBulkScheduleDoctor, getScheduleDoctorByDate } from '../../../../services/userService'
import ManageListDoctorSchedule from './ManageListDoctorSchedule';
import { saveScheduleInfoSuccess, saveScheduleInfoFail, saveInfoSuccess } from '../../../../components/NotificationConfig/notificationConfig'
import './AdminScheduleManage.scss'

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctor: [],
            selectedDoctor: '',
            currentDate: '',
            dataSchedule: [],
            isOpenModal: false,
            rangeTime: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctorStart();
        this.props.getDetailInforDoctor();
        this.props.fetchScheduleHoursStart();
        this.props.createBulkScheduleDoctor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                arrDoctor: dataSelect,
            });
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
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                arrDoctor: dataSelect,
            });
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
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    handleOnchangeDatePicker = async (date) => {
        this.setState({
            currentDate: date[0],
        });
    }

    handleClickButtonTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });
            this.setState({
                rangeTime: rangeTime
            });
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let { language } = this.props;
        let result = [];
        if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
            if (language === LANGUAGES.EN) {
                toast.error('Please select the doctor you want to schedule an appointment with!');
            } else if (language === LANGUAGES.VI) {
                toast.error('Vui lòng chọn bác sĩ cần tạo lịch khám!');
            }
            return;
        }
        if (!currentDate) {
            if (language === LANGUAGES.EN) {
                toast.error('Invalid date!');
            } else if (language === LANGUAGES.VI) {
                toast.error('Ngày không hợp lệ!');
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
                });
                console.log('check selected time:', selectedTime);
            } else {
                if (language === LANGUAGES.EN) {
                    toast.error('Please select an appointment time!');
                } else if (language === LANGUAGES.VI) {
                    toast.error('Vui lòng chọn khung giờ khám bệnh!');
                }
                return;
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate,
        });

        if (res && res.errCode === 0) {
            // saveScheduleInfoSuccess(this.props.language);
            saveInfoSuccess(this.props.language)
            // Reset trạng thái các khung giờ đã chọn
            this.setState(prevState => ({
                rangeTime: prevState.rangeTime.map(item => ({
                    ...item,
                    isSelected: false
                }))
            }));
        } else {
            saveScheduleInfoFail(this.props.language);
        }
    }

    handleScheduleSearch = async () => {
        let { currentDate, selectedDoctor } = this.state;
        let date = new Date(currentDate).getTime();
        if (selectedDoctor.value && date) {
            let res = await getScheduleDoctorByDate(selectedDoctor.value, date);
            if (res && res.errCode === 0) {
                if (res.data !== '') {
                    this.setState({
                        dataSchedule: res.data,
                        isOpenModal: true
                    });
                } else {
                    this.setState({
                        isOpenModal: false
                    });
                }
            }
        }
    }

    handleChangeToggle = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal
        });
    }

    render() {
        let { language } = this.props;
        let { rangeTime, dataSchedule } = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        console.log('check date: ', this.state);
        return (
            <React.Fragment>
                <div className='list-schedule-doctor'>
                    <ManageListDoctorSchedule
                        dataSchedule={this.state.dataSchedule}
                        handleChangeToggle={this.handleChangeToggle}
                        isOpen={this.state.isOpenModal}
                        handleScheduleSearch={this.handleScheduleSearch}
                        selectedDoctor={this.state.selectedDoctor}
                    />
                </div>
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
                            <div className='col-2 form-group'>
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
                                        );
                                    })
                                }
                            </div>
                            <div className='col-12'>
                                <button className='btn btn-primary btn-save-schedule'
                                    onClick={() => this.handleSaveSchedule()}
                                >
                                    <FormattedMessage id="manage-schedule.save-schedule" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </React.Fragment>
        );
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
        roleId: state.auth.role
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
