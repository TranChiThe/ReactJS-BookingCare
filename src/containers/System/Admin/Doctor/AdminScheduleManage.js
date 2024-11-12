import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import * as actions from '../../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, dateFormat } from '../../../../utils';
import Select from 'react-select';
import DatePicker from '../../../../components/Input/DatePicker';
import { toast } from 'react-toastify'
import _ from 'lodash'
import { saveBulkScheduleDoctor, getScheduleDoctorByDate, getScheduleDoctorForWeek, getDetailInForDoctor } from '../../../../services/userService'
import ScheduleTable from '../../../ScheduleTable/ScheduleTable';
import Pagination from '../../../../components/Pagination/Pagination';
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig';
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
            dataScheduleForWeek: [],
            currentPage: 1,
            totalPages: 4,
            weekDates: [],
            //filter
            listSpecialty: [],
            listClinic: [],
            selectedSpecialty: '',
            selectedClinic: '',
        };
    }

    async componentDidMount() {
        this.props.fetchAllDoctorStart('', '');
        this.props.fetchScheduleHoursStart();
        this.props.createBulkScheduleDoctor();
        this.props.getAllRequiredDoctorInfo();
        await this.fetchScheduleData();
        this.calculateWeekDates();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resSpecialty } = this.props.allRequiredDoctorInfo
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')

            this.setState({
                arrDoctor: dataSelect,
                listSpecialty: dataSelectSpecialty,
            })
        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')

            this.setState({
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            })
        }
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                arrDoctor: dataSelect,
            });
        }

    }

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

    fetchScheduleData = async () => {
        const { selectedDoctor, currentPage } = this.state;
        try {
            let res = await getScheduleDoctorForWeek(selectedDoctor?.value, currentPage);
            if (res && res.errCode === 0) {
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

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor }, async () => {
            await this.fetchScheduleData();
        });
        let { listSpecialty, listClinic } = this.state;
        let response = await getDetailInForDoctor(selectedDoctor.value);
        if (response && response.data) {
            let specialtyId, clinicId, selectedSpecialty = '', selectedClinic = '';
            if (response.data.Doctor_Infor) {
                specialtyId = response.data.Doctor_Infor.specialtyId;
                clinicId = response.data.Doctor_Infor.clinicId;

                // Find the value in the selection list
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })

            }
            this.setState({
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
            })
        } else {
            this.setState({
                selectedSpecialty: '',
                selectedClinic: '',
            })
        }
    };

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "USERS") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`
                    let labelEn = `${item.firstName} ${item.lastName}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === "SPECIALTY") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.specialtyData.valueVi}`
                    let labelEn = `${item.specialtyData.valueEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.name;
                    result.push(object);
                })
            }
            if (type === "CLINIC") {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id;
                    result.push(object);
                })
            }
        }
        return result;
    }

    handleOnchangeSelectDoctorInfo = async (selectedOption, name) => {
        let { selectedSpecialty, selectedClinic } = this.state
        let specialtyId = selectedSpecialty ? selectedSpecialty.value : '';
        let clinicId = selectedClinic ? selectedClinic.value : ''
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        }, async () => {
            await this.props.fetchAllDoctorStart(specialtyId, clinicId);
        })

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
        let SwalConfig = createSwalConfig(this.props.intl)
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
                    object.currentNumber = 0;
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
            currentNumber: 0,
        });

        if (res && res.errCode === 0) {
            Swal.fire(SwalConfig.successNotification('notification.schedule.textSuccess'))
            this.fetchScheduleData();
            // Reset trạng thái các khung giờ đã chọn
            this.setState(prevState => ({
                rangeTime: prevState.rangeTime.map(item => ({
                    ...item,
                    isSelected: false
                }))
            }));
        } else if (res && res.errCode === 2) {
            toast.error(<FormattedMessage id='notification.schedule.toast' />)
        } else {
            Swal.fire(SwalConfig.errorNotification('notification.schedule.textFail'))
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

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage }, () => {
            this.fetchScheduleData();
        });
    };

    handleFilterButton = async () => {
        let { selectedSpecialty, selectedClinic } = this.state
        let specialtyId = selectedSpecialty ? selectedSpecialty.value : '';
        let clinicId = selectedClinic ? selectedClinic.value : ''
        await this.props.fetchAllDoctorStart(specialtyId, clinicId);
    }

    render() {
        let { language } = this.props;
        let { rangeTime, dataScheduleForWeek, currentPage, totalPages } = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        console.log('check state: ', this.state)
        return (

            <React.Fragment>
                <div className='manage-schedule-container'>
                    <div className='manage-schedule-title'>
                        <FormattedMessage id="manage-schedule.title" />
                    </div>
                    <div className='filter-doctor-container'>
                        <div className='filter-information'>
                            <div className='selected-item'>
                                <Select
                                    placeholder={<FormattedMessage id="menu.manage-doctor.specialty" />}
                                    value={this.state.selectedSpecialty}
                                    onChange={this.handleOnchangeSelectDoctorInfo}
                                    options={this.state.listSpecialty}
                                    name="selectedSpecialty"
                                    isClearable
                                />
                            </div>
                            <div className='selected-item'>
                                <Select
                                    placeholder={<FormattedMessage id="menu.manage-doctor.clinic" />}
                                    value={this.state.selectedClinic}
                                    onChange={this.handleOnchangeSelectDoctorInfo}
                                    options={this.state.listClinic}
                                    name="selectedClinic"
                                    isClearable
                                />
                            </div>
                            <button className='btn-confirm'
                                onClick={() => this.handleFilterButton()}
                            >
                                <i class="fas fa-filter"></i>
                                <FormattedMessage id='menu.admin.filter' />
                            </button>
                        </div>
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
                                    placeholder={this.props.intl.formatMessage({ id: 'manage-schedule.choose-date' })}
                                    onChange={this.handleOnchangeDatePicker}
                                    className='form-control'
                                    selected={this.state.currentDate}
                                    minDate={yesterday}
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
        roleId: state.auth.role,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorStart: (specialtyId, clinicId) => dispatch(actions.fetchAllDoctorStart(specialtyId, clinicId)),
        getDetailInforDoctor: (data) => dispatch(actions.fetchDetailInforDoctorStart(data)),
        fetchScheduleHoursStart: () => dispatch(actions.fetchScheduleHoursStart()),
        createBulkScheduleDoctor: (data) => dispatch(actions.saveBulkScheduleDoctor(data)),
        getAllRequiredDoctorInfo: () => dispatch(actions.fetchAllRequiredDoctorStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageSchedule));
