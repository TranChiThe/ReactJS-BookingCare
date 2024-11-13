import React, { Component } from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { getDetailInForDoctor, saveDetailDoctorService, updateDetailDoctorService, deleteDetailDoctorService } from '../../../services/userService'
import Swal from 'sweetalert2';
import createSwalConfig from '../../../components/NotificationConfig/SwalConfig'
import { toast } from 'react-toastify';
import './ManageDoctor.scss'

const mdParser = new MarkdownIt();


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //save info doctor markdown
            contentMarkDown: '',
            contentHTML: '',
            selectedOptions: '',
            description: '',
            contentMarkDownEn: '',
            contentHTMLEn: '',
            descriptionEn: '',
            arrDoctor: [],
            // save info doctor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            note: '',
            noteEn: '',
            clinicId: '',
            specialtyId: '',
            isUpdate: false,
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctorStart('', '');
        this.props.getDetailInfoDoctor();
        this.props.getAllRequiredDoctorInfo();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                arrDoctor: dataSelect,
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')

            this.setState({
                arrDoctor: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            })
            this.handleSetState()

        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        let { language } = this.props;
        if (language === LANGUAGES.VI) {
            this.setState({
                contentMarkDown: text,
                contentHTML: html,
            })
        } else if (language === LANGUAGES.EN) {
            this.setState({
                contentMarkDownEn: text,
                contentHTMLEn: html,
            })
        }

    }

    handleSetState = () => {
        this.setState({
            selectedOptions: '',
            contentHTML: '',
            contentMarkDown: '',
            description: '',
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            selectedClinic: '',
            note: '',
            ontentMarkDownEn: '',
            contentHTMLEn: '',
            descriptionEn: '',
            noteEn: ''
        })
    }

    handleSaveDoctorInfo = async () => {
        let SwalConfig = createSwalConfig(this.props.intl)
        let { selectedOptions } = this.state;
        if (!selectedOptions?.value) {
            toast.error(<FormattedMessage id='notification.doctor-info.selectedDoctor' />)
            return;
        }
        let res = await saveDetailDoctorService({
            language: this.props.language,
            contentHTML: this.state.contentHTML,
            contentMarkDown: this.state.contentMarkDown,
            description: this.state.description,
            contentHTMLEn: this.state.contentHTMLEn,
            contentMarkDownEn: this.state.contentMarkDownEn,
            descriptionEn: this.state.descriptionEn,
            doctorId: this.state.selectedOptions.value,
            clinicId: this.state.selectedClinic.value,
            specialtyId: this.state.selectedSpecialty.value,
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            selectedSpecialty: this.state.selectedSpecialty.value,
            selectedClinic: this.state.selectedClinic.value,
            note: this.state.note,
            noteEn: this.state.noteEn
        })
        if (res && res.errCode === 0) {
            Swal.fire(SwalConfig.successNotification('notification.doctor-info.textSuccess'))
            this.handleSetState();
        }
        else if (res && res.errCode === 1) {
            toast.error(<FormattedMessage id='toast.missing' />)
        }
        else if (res && res.errCode === 2) {
            toast.error(<FormattedMessage id='notification.doctor-info.already' />)
        }
        else if (res && res.errCode === 3) {
            toast.error(<FormattedMessage id='toast.viUpdate' />)
        }
        else {
            Swal.fire(SwalConfig.errorNotification('notification.doctor-info.textFail'))
        }
    }

    handleUpdateDoctorInfo = async () => {
        let SwalConfig = createSwalConfig(this.props.intl)
        let selectedOptions = this.state;
        if (selectedOptions?.value === '') {
            toast.error(<FormattedMessage id='notification.doctor-info.selectedDoctor' />)
            return;
        }
        let result = await Swal.fire(SwalConfig.confirmDialog())
        if (result.isConfirmed) {
            let res = await updateDetailDoctorService({
                language: this.props.language,
                contentHTML: this.state.contentHTML,
                contentMarkDown: this.state.contentMarkDown,
                description: this.state.description,
                contentHTMLEn: this.state.contentHTMLEn,
                contentMarkDownEn: this.state.contentMarkDownEn,
                descriptionEn: this.state.descriptionEn,
                doctorId: this.state.selectedOptions.value,
                clinicId: this.state.selectedClinic.value,
                specialtyId: this.state.selectedSpecialty.value,
                selectedPrice: this.state.selectedPrice.value,
                selectedPayment: this.state.selectedPayment.value,
                selectedProvince: this.state.selectedProvince.value,
                selectedSpecialty: this.state.selectedSpecialty.value,
                selectedClinic: this.state.selectedClinic.value,
                note: this.state.note,
                noteEn: this.state.nameEn
            })
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.doctor-info.textUpdateSuccess'))
                this.handleSetState();
            }
            else if (res && res.errCode === 1) {
                toast.error(<FormattedMessage id='toast.missing' />)
            }
            else if (res && res.errCode === 2) {
                toast.error(<FormattedMessage id='notification.doctor-info.doNotExists' />)
            }
            else {
                Swal.fire(SwalConfig.errorNotification('notification.doctor-info.textUpdateFail'))
            }
        }
    }

    handleDeleteDoctorInfo = async () => {
        let SwalConfig = createSwalConfig(this.props.intl)
        let result = await Swal.fire(SwalConfig.confirmDialog())
        if (result.isConfirmed) {
            let res = await deleteDetailDoctorService(this.state.selectedOptions?.value)
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.doctor-info.textUpdateSuccess'))
                this.handleSetState();
            }
            else if (res && res.errCode === 1) {
                toast.error(<FormattedMessage id='toast.missing' />)
            }
            else if (res && res.errCode === 2) {
                toast.error(<FormattedMessage id='notification.doctor-info.doNotExists' />)
            }
            else {
                Swal.fire(SwalConfig.errorNotification('notification.doctor-info.textUpdateFail'))
            }
        }
    }

    handleChangeSelect = async (selectedOptions) => {
        let { language } = this.props;
        this.setState({ selectedOptions });
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;
        let response = await getDetailInForDoctor(selectedOptions.value);
        if (response && response.data) {
            let note = '',
                priceId = '', paymentId = '', provinceId = '', specialtyId, clinicId,
                selectedPrice = '', selectedPayment = '', selectedProvince = '',
                selectedSpecialty = '', selectedClinic = '';
            if (response.data.Doctor_Infor) {
                // get id value
                priceId = response.data.Doctor_Infor.priceId;
                paymentId = response.data.Doctor_Infor.paymentId;
                provinceId = response.data.Doctor_Infor.provinceId;
                specialtyId = response.data.Doctor_Infor.specialtyId;
                clinicId = response.data.Doctor_Infor.clinicId;

                // Find the value in the selection list
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })

            }
            this.setState({
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
            })
            if (language === LANGUAGES.VI) {
                this.setState({
                    contentHTML: response.data.Doctor_Infor?.contentHTML || '',
                    contentMarkDown: response.data.Doctor_Infor?.contentMarkDown || '',
                    description: response.data.Doctor_Infor?.description || '',
                    note: response.data.Doctor_Infor?.note || '',
                })
            } else if (language === LANGUAGES.EN) {
                this.setState({
                    contentHTMLEn: response.data.Doctor_Infor?.contentHTMLEn || '',
                    contentMarkDownEn: response.data.Doctor_Infor?.contentMarkDownEn || '',
                    descriptionEn: response.data.Doctor_Infor?.descriptionEn || '',
                    noteEn: response.data.Doctor_Infor?.noteEn || '',
                })
            }
        } else {
            this.handleSetState()
        }
    };

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
            if (this.state.isUpdate) {
                // await this.props.fetchAllDoctorStart(specialtyId, clinicId);
                this.handleFilterButton()
            }
        })

    }

    handleOnchangeText = (event, id) => {
        const { language } = this.props;
        let stateCopy = { ...this.state };
        if (language === LANGUAGES.VI) {
            stateCopy[id] = event.target.value;
        } else {
            stateCopy[`${id}En`] = event.target.value;
        }
        this.setState({
            ...stateCopy
        });
    }

    numberFormatEn = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);

    numberFormatVi = (value) =>
        new Intl.NumberFormat('vi', {
            style: 'currency',
            currency: 'VND'
        }).format(value);

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
            if (type === "PRICE") {
                inputData.map((item, index) => {
                    let object = {};
                    let priceEn = `${item.valueEn}`
                    let priceVi = `${item.valueVi}`
                    let labelVi = this.numberFormatVi(priceVi)
                    let labelEn = this.numberFormatEn(priceEn);
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === "PAYMENT" || type === "PROVINCE") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap;
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
                    let labelVi = `${item.name}`
                    let labelEn = `${item.nameEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id;
                    result.push(object);
                })
            }
        }
        return result;
    }

    handelUpdateButton = () => {
        this.setState({
            isUpdate: !this.state.isUpdate,
        })
    }

    handleFilterButton = async () => {
        let { selectedSpecialty, selectedClinic } = this.state
        let specialtyId = selectedSpecialty ? selectedSpecialty.value : '';
        let clinicId = selectedClinic ? selectedClinic.value : ''
        await this.props.fetchAllDoctorStart(specialtyId, clinicId);
        this.setState({
            selectedOptions: ''
        })
    }

    render() {
        let { isUpdate, selectedOptions } = this.state;
        let { language } = this.props;
        console.log('check state: ', this.state)
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id="menu.manage-doctor.title" />
                </div>
                <div className='manage-doctor-content'>
                    <div className='filter-doctor-container'>
                        <div className='update-doctor row'>
                            <div className=''>
                                <button onClick={() => this.handelUpdateButton()}>
                                    <i className={!isUpdate ? 'fas fa-edit' : 'fas fa-plus'} ></i>
                                    {!isUpdate ?
                                        <FormattedMessage id="admin.admin.edit-clinic" /> :
                                        <FormattedMessage id="admin.admin.create-clinic" />
                                    }
                                </button>
                                {isUpdate &&
                                    <button onClick={() => this.handleDeleteDoctorInfo()} className={`delete-btn ${!selectedOptions.value ? 'disabled' : ''}`}>
                                        <i className='fas fa-trash' ></i>
                                        <FormattedMessage id="admin.admin.delete" />
                                    </button>
                                }
                            </div>
                        </div>
                        {isUpdate &&
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
                        }
                    </div>
                    <div className='more-infor'>
                        <div className='content-left form-group'>
                            <div className='doctor-selected'>
                                <label><FormattedMessage id="menu.manage-doctor.choose-doctor" /></label>
                                <Select
                                    placeholder={<FormattedMessage id="menu.manage-doctor.choose-doctor" />}
                                    value={this.state.selectedOptions}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.arrDoctor}
                                />
                            </div>
                        </div>
                        <div className='content-right form-group'>
                            <div className='doctor-description' style={{ paddingLeft: '40px' }}>
                                <label><FormattedMessage id="menu.manage-doctor.description" /></label>
                                <textarea className='form-control' rows='4'
                                    onChange={(event) => this.handleOnchangeText(event, 'description')}
                                    value={language === LANGUAGES.VI ? this.state.description : this.state.descriptionEn}
                                    placeholder={this.props.intl.formatMessage({ id: 'menu.manage-doctor.description' })}
                                >
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="menu.manage-doctor.specialty" /></label>
                            <Select
                                placeholder={<FormattedMessage id="menu.manage-doctor.specialty" />}
                                value={this.state.selectedSpecialty}
                                onChange={this.handleOnchangeSelectDoctorInfo}
                                options={this.state.listSpecialty}
                                name="selectedSpecialty"
                                isClearable
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="menu.manage-doctor.clinic" /></label>
                            <Select
                                placeholder={<FormattedMessage id="menu.manage-doctor.clinic" />}
                                value={this.state.selectedClinic}
                                onChange={this.handleOnchangeSelectDoctorInfo}
                                options={this.state.listClinic}
                                name="selectedClinic"
                                isClearable
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="menu.manage-doctor.price" /></label>
                            <Select
                                placeholder={<FormattedMessage id="menu.manage-doctor.price" />}
                                value={this.state.selectedPrice}
                                onChange={this.handleOnchangeSelectDoctorInfo}
                                options={this.state.listPrice}
                                name="selectedPrice"
                                isClearable
                            />
                        </div>
                    </div>
                    <div className='more-info-extra'>
                        <div className='row'>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="menu.manage-doctor.payment" /></label>
                                <Select
                                    placeholder={<FormattedMessage id="menu.manage-doctor.payment" />}
                                    value={this.state.selectedPayment}
                                    onChange={this.handleOnchangeSelectDoctorInfo}
                                    options={this.state.listPayment}
                                    name="selectedPayment"
                                    isClearable
                                />
                            </div>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="menu.manage-doctor.province" /></label>
                                <Select
                                    placeholder={<FormattedMessage id="menu.manage-doctor.province" />}
                                    value={this.state.selectedProvince}
                                    onChange={this.handleOnchangeSelectDoctorInfo}
                                    options={this.state.listProvince}
                                    name="selectedProvince"
                                    isClearable
                                />
                            </div>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="menu.manage-doctor.note" /></label>
                                <input className='form-control'
                                    onChange={(event) => this.handleOnchangeText(event, 'note')}
                                    value={language === LANGUAGES.VI ? this.state.note : this.state.noteEn}
                                    placeholder={this.props.intl.formatMessage({ id: 'menu.manage-doctor.note' })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mange-doctor-editor'>
                        <label><FormattedMessage id="menu.manage-doctor.content" /></label>
                        <MdEditor style={{ height: '300px', }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={language === LANGUAGES.VI ? this.state.contentMarkDown : this.state.contentMarkDownEn}
                        />
                    </div>
                    {!isUpdate &&
                        <button className='create-content-doctor'
                            onClick={() => this.handleSaveDoctorInfo()}
                        >
                            <span><FormattedMessage id="menu.manage-doctor.create-infor" /></span>
                        </button>
                    }

                    {isUpdate &&
                        <button className='save-content-doctor'
                            onClick={() => this.handleUpdateDoctorInfo()}
                        >
                            <span><FormattedMessage id="menu.manage-doctor.save-infor" /></span>
                        </button>
                    }
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailDoctor: state.admin.detailDoctor,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorStart: (specialtyId, clinicId) => dispatch(actions.fetchAllDoctorStart(specialtyId, clinicId)),
        getDetailInfoDoctor: (data) => dispatch(actions.fetchDetailInforDoctorStart(data)),
        getAllRequiredDoctorInfo: () => dispatch(actions.fetchAllRequiredDoctorStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageDoctor));
