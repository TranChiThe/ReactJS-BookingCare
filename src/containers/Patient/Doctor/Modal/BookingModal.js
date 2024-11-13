import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES } from '../../../../utils'
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash'
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { postPatientBookAppointment, getProfileDoctorById } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from '../../../../components/LoadingComponent/LoadingOverlay';
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig';
import './BookingModal.scss'

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            doctorId: '',
            genders: '',
            selectedGender: '',
            timeType: '',
            selectedOption: 'option1',
            fullName: '',
            relativesPhoneNumber: '',
            isLoading: false,
            priceAppointment: []
        }
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    async componentDidMount() {
        this.props.fetchGender();
        await this.getPriceAppointment()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (prevProps.dataTime !== this.props.dataTime) {
            let doctorId = this.props.dataTime && !_.isEmpty(this.props.dataTime) ? this.props.dataTime.doctorId : ''
            let timeType = this.props.dataTime.timeType;
            this.setState({
                doctorId: doctorId,
                timeType: timeType,
            })
            this.getPriceAppointment()
        }
    }

    getPriceAppointment = async () => {
        let { dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : ''
        let res = await getProfileDoctorById(doctorId);
        if (res && res.errCode === 0) {
            this.setState({
                priceAppointment: res.data
            })
        }
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnchangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
        })
    }

    handleChangeSelect = async (selectedGender) => {
        this.setState({ selectedGender });
    }

    handleRadioChange(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi :
                dataTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                moment.unix(+ dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+ dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return `${time} - ${date}`;

        }
        return ``;
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return ''
    }

    handleConfirmBooking = async () => {
        let SwalConfig = createSwalConfig(this.props.intl)
        const {
            fullName,
            relativesPhoneNumber,
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            reason,
            birthday,
            selectedGender,
            doctorId,
            timeType,
        } = this.state;

        // Validate inputs
        if (!firstName || !lastName || !phoneNumber || !email || !address || !reason || !birthday || !selectedGender) {
            toast.error(<FormattedMessage id="toast.missing" />);
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error(<FormattedMessage id='toast.phoneNumber' />);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error(<FormattedMessage id='toast.email' />);
            return;
        }

        // Prepare data for submission
        let date = new Date().getTime();
        let birthdayTimestamp = (new Date(birthday).getTime());

        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let result = await Swal.fire(SwalConfig.confirmDialog())
        try {
            if (result.isConfirmed) {
                this.setState({ isLoading: true });
                let appointmentFee = this.state.priceAppointment ? this.state.priceAppointment.Doctor_Infor.priceTypeData.valueVi : ''
                let res = await postPatientBookAppointment({
                    fullName,
                    relativesPhoneNumber,
                    email,
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    reason,
                    birthday: birthdayTimestamp,
                    date: this.props.selectedDate,
                    scheduleTime: date,
                    doctorId,
                    genders: selectedGender?.value,
                    timeType,
                    language: this.props.language,
                    timeString,
                    doctorName,
                    appointmentFee
                });

                if (res && res.errCode === 0) {
                    Swal.fire(SwalConfig.successNotification('notification.patient.textSuccess'))
                    this.resetForm();
                    this.props.closeBookingModal();
                } else if (res && res.errCode !== 0) {
                    this.handleBookingError(res);
                }
                else {
                    Swal.fire(SwalConfig.successNotification('notification.patient.textFail'))
                }
            }

        } catch (error) {
            toast.error(<FormattedMessage id='notification.patient.error' />);
            console.error(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    resetForm = () => {
        this.setState({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: ''
        });
    }

    handleBookingError = (res) => {
        switch (res.errCode) {
            case 2:
                toast.error(<FormattedMessage id='notification.patient.already-appoitment' />);
                break;
            case 3:
                toast.error(<FormattedMessage id='notification.patient.morning' />);
                break;
            case 4:
                toast.error(<FormattedMessage id='notification.patient.afternoon' />);
                break;
            default:
                toast.error(<FormattedMessage id='notification.patient.error' />);
                break;
        }
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : ''
        return (
            <>
                {this.state.isLoading && <LoadingOverlay />}
                <Modal isOpen={isOpenModal} className={'booking-modal-container'}
                    size='xl'
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'><FormattedMessage id="patient.booking-modal.title" /></span>
                            <span className='right'
                                onClick={closeBookingModal}
                            >
                                <i className='fas fa-times'></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            <div className='doctor-info'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-12 form-group'>
                                    <form onSubmit={(e) => this.handleSubmit(e)}>
                                        <label>
                                            <input
                                                type="radio"
                                                value="option1"
                                                checked={this.state.selectedOption === 'option1'}
                                                onChange={this.handleRadioChange}
                                            />
                                            <FormattedMessage id="patient.booking-modal.option1" />
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                value="option2"
                                                checked={this.state.selectedOption === 'option2'}
                                                onChange={this.handleRadioChange}
                                            />
                                            <FormattedMessage id="patient.booking-modal.option2" />
                                        </label>
                                    </form>
                                </div>
                                {this.state.selectedOption === 'option2' &&
                                    <div className='relatives-information row'>
                                        <div className='booking-information col-12'> Thông tin người đặt lịch</div>
                                        <div className='col-6 form-group'>
                                            <input className='form-control'
                                                value={this.state.fullName}
                                                onChange={(event) => this.handleOnchangeInput(event, 'fullName')}
                                                placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.fullName" })}

                                            />
                                        </div>
                                        <div className='col-6 form-group'>
                                            <input className='form-control'
                                                value={this.state.relativesPhoneNumber}
                                                onChange={(event) => this.handleOnchangeInput(event, 'relativesPhoneNumber')}
                                                placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.phoneNumber" })}

                                            />
                                        </div>
                                    </div>
                                }
                                <div className='booking-information col-12'> Thông tin bệnh nhân</div>
                                <div className='col-6 form-group'>
                                    <input className='form-control'
                                        value={this.state.firstName}
                                        onChange={(event) => this.handleOnchangeInput(event, 'firstName')}
                                        placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.firstName" })}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <input className='form-control'
                                        value={this.state.lastName}
                                        onChange={(event) => this.handleOnchangeInput(event, 'lastName')}
                                        placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.lastName" })}

                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <input className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                        placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.phoneNumber" })}

                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <input className='form-control'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                        placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.email" })}

                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <input className='form-control'
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                        placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.address" })}

                                    />
                                </div>
                                <div className='col-12 form-group'>
                                    <input className='form-control'
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnchangeInput(event, 'reason')}
                                        placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.reason" })}

                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <DatePicker
                                        onChange={this.handleOnchangeDatePicker}
                                        className='form-control'
                                        selected={this.state.birthday}
                                        placeholder={this.props.intl.formatMessage({ id: "patient.booking-modal.birthday" })}

                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <Select
                                        placeholder={<FormattedMessage id="patient.booking-modal.gender" />}
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-confirm'
                                onClick={this.handleConfirmBooking}
                            >
                                <FormattedMessage id="patient.booking-modal.btnConfirm" />
                            </button>
                            <button className='btn-booking-cancel'
                                onClick={closeBookingModal}
                            >
                                <FormattedMessage id="patient.booking-modal.btnCancel" />
                            </button>
                        </div>
                    </div>
                </Modal >
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BookingModal));
