import React, { Component } from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import './ManageDoctor.scss'
import { getDetailInForDoctor, saveDetailDoctorService } from '../../../services/userService'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
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
            arrDoctor: [],
            hasOldData: false,
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
            clinicId: '',
            specialtyId: '',
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctorStart();
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
            let { resPrice, resPayment, resProvince, resSpecialty } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')

            this.setState({
                arrDoctor: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty
            })
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
                listClinic: dataSelectClinic
            })
        }
        if (this.props.success !== prevProps.success && this.props.success) {
            Swal.fire('Success', 'Doctor details saved successfully!', 'success');
        }

        // Kiểm tra missing
        if (this.props.missing !== prevProps.missing && this.props.missing) {
            Swal.fire('Warning', 'Missing required doctor information.', 'warning');
        }

        // Kiểm tra error
        if (this.props.error !== prevProps.error && this.props.error) {
            Swal.fire('Error', 'Error saving doctor details.', 'error');
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkDown: text,
            contentHTML: html,
        })
    }

    handleSaveDoctorInfo = async () => {
        let { hasOldData } = this.state;
        let data = this.props.saveDetailInfoDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkDown: this.state.contentMarkDown,
            description: this.state.description,
            doctorId: this.state.selectedOptions.value,
            clinicId: this.state.selectedClinic.value,
            specialtyId: this.state.selectedSpecialty.value,
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            selectedSpecialty: this.state.selectedSpecialty.value,
            selectedClinic: this.state.selectedClinic.value,
            note: this.state.note,
            actions: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
        })
        console.log('check data: ', data)
        let { loading, success, missing, error } = this.props;
        if (this.props.loading) {
            // Hiển thị thông báo loading
        } else if (this.props.success) {
            Swal.fire('Success', 'Doctor details saved successfully!', 'success');
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
                hasOldData: false,
            });
        } else if (this.props.missing) {
            Swal.fire('Warning', 'Doctor details are missing some required information.', 'warning');
        } else if (this.props.error) {
            Swal.fire('Error', 'Something went wrong while saving doctor details.', 'error');
        }
        console.log('check props ', this.props)
    }

    handleChangeSelect = async (selectedOptions) => {
        this.setState({ selectedOptions });
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;
        let response = await getDetailInForDoctor(selectedOptions.value);
        if (response && response.data && response.data.MarkDown) {
            let markdown = response.data.MarkDown;
            let note = '',
                priceId = '', paymentId = '', provinceId = '', specialtyId, clinicId,
                selectedPrice = '', selectedPayment = '', selectedProvince = '',
                selectedSpecialty = '', selectedClinic = '';
            if (response.data.Doctor_Infor) {
                note = response.data.Doctor_Infor.note;
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
                contentHTML: markdown.contentHTML,
                contentMarkDown: markdown.contentMarkDown,
                description: markdown.description,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
                hasOldData: true,
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkDown: '',
                description: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
                hasOldData: false
            })
        }
    };

    handleOnchangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        })
    }

    handleOnchangeText = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value68yy
        this.setState({
            ...stateCopy
        })
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
                    object.value = item.id;
                    result.push(object);
                })
            }
        }

        return result;
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id="menu.manage-doctor.title" />
                </div>
                <div className='manage-doctor-content'>
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
                            <div className='doctor-description'>
                                <label><FormattedMessage id="menu.manage-doctor.description" /></label>
                                <textarea className='form-control' rows='4'
                                    onChange={(event) => this.handleOnchangeText(event, 'description')}
                                    value={this.state.description}
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
                                />
                            </div>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="menu.manage-doctor.note" /></label>
                                <input className='form-control'
                                    onChange={(event) => this.handleOnchangeText(event, 'note')}
                                    value={this.state.note}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mange-doctor-editor'>
                        <label><FormattedMessage id="menu.manage-doctor.content" /></label>
                        <MdEditor style={{ height: '300px', }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkDown}
                        />
                    </div>
                    <button className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                        onClick={() => this.handleSaveDoctorInfo()}
                    >
                        {hasOldData === true ?
                            <span><FormattedMessage id="menu.manage-doctor.save-infor" /></span> :
                            <span><FormattedMessage id="menu.manage-doctor.create-infor" /></span>
                        }
                    </button>
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
        loading: state.admin.loading,
        success: state.admin.success,
        error: state.admin.error,
        missing: state.admin.missing,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorStart: () => dispatch(actions.fetchAllDoctorStart()),
        getDetailInfoDoctor: (data) => dispatch(actions.fetchDetailInforDoctorStart(data)),
        getAllRequiredDoctorInfo: () => dispatch(actions.fetchAllRequiredDoctorStart()),
        saveDetailInfoDoctor: (data) => dispatch(actions.saveDetailInforDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
