import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTIONS } from '../../../../utils';
import * as actions from '../../../../store/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../../../utils';
import { getSpecialtyById, createNewSpecialty, updateSpecialty, deleteSpecialty } from '../../../../services/userService'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig';
import './ManageSpecialty.scss'

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSpecialty: '',
            arrSpecialty: [],
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: '',
            isUpdate: false
        }
    }

    async componentDidMount() {
        this.props.fetchSpecialtyStart()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let dataSelectSpecialty = this.buildDataInputSelectSpecialty(this.props.specialtyData)
            this.setState({
                arrSpecialty: dataSelectSpecialty,
                selectedSpecialty: '',
                previewImgURL: ''
            })
        }
        if (prevProps.specialtyData !== this.props.specialtyData) {
            let dataSelect = this.buildDataInputSelectSpecialty(this.props.specialtyData)
            this.setState({
                arrSpecialty: dataSelect,
            })
        }
    }

    handleOnchangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        let { language } = this.props;
        if (language === LANGUAGES.VI) {
            this.setState({
                descriptionMarkdown: text,
                descriptionHTML: html,
            })
        } else if (language === LANGUAGES.EN) {
            this.setState({
                descriptionMarkdownEn: text,
                descriptionHTMLEn: html,
            })
        }

    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                imageBase64: base64
            });
        }
    }

    handleSetState = () => {
        this.setState({
            selectedSpecialty: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: '',
            previewImgURL: '',
        })
    }

    handleSaveSpecialty = async () => {
        let { selectedSpecialty, imageBase64, descriptionHTML, descriptionMarkdown, descriptionHTMLEn, descriptionMarkdownEn } = this.state
        let SwalConfig = createSwalConfig(this.props.intl)
        let res = await createNewSpecialty({
            language: this.props.language,
            name: selectedSpecialty?.value,
            image: imageBase64,
            descriptionHTML: descriptionHTML,
            descriptionMarkdown: descriptionMarkdown,
            descriptionHTMLEn: descriptionHTMLEn,
            descriptionMarkdownEn: descriptionMarkdownEn
        })
        if (res && res.errCode === 0) {
            Swal.fire(SwalConfig.successNotification('notification.specialty.textSuccess'))
            this.handleSetState()
        }
        else if (res && res.errCode === 1) {
            toast.error(<FormattedMessage id='toast.missing' />);
        }
        else if (res && res.errCode === 2) {
            toast.error(<FormattedMessage id='notification.specialty.already' />);
        }
        else if (res && res.errCode === 3) {
            toast.error(<FormattedMessage id='notification.specialty.doNotExists' />);
        }
        else {
            Swal.fire(SwalConfig.errorNotification('notification.specialty.textFail'))

        }
    }

    handleUpdateSpecialty = async () => {
        let { selectedSpecialty, imageBase64, descriptionHTML, descriptionMarkdown, descriptionHTMLEn, descriptionMarkdownEn } = this.state
        let SwalConfig = createSwalConfig(this.props.intl)
        let result = await Swal.fire(SwalConfig.confirmDialog())
        if (result.isConfirmed) {
            let res = await updateSpecialty({
                language: this.props.language,
                name: selectedSpecialty?.value,
                image: imageBase64,
                descriptionHTML: descriptionHTML,
                descriptionMarkdown: descriptionMarkdown,
                descriptionHTMLEn: descriptionHTMLEn,
                descriptionMarkdownEn: descriptionMarkdownEn
            })
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.specialty.textUpdateSuccess'))
                this.handleSetState()
            }
            else if (res && res.errCode === 1) {
                toast.error(<FormattedMessage id='toast.missing' />);
            }
            else if (res && res.errCode === 2) {
                toast.error(<FormattedMessage id='notification.specialty.doNotExists' />);
            }
            else {
                Swal.fire(SwalConfig.errorNotification('notification.specialty.textUpdateFail'))
            }
        }

    }

    handelDeleteButton = async () => {
        let SwalConfig = createSwalConfig(this.props.intl)
        let result = await Swal.fire(SwalConfig.confirmDialog())
        if (result.isConfirmed) {
            let res = await deleteSpecialty(this.state.selectedSpecialty?.value)
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.specialty.textUpdateSuccess'))
                this.handleSetState()
            } else if (res && res.errCode === 1) {
                toast.error(<FormattedMessage id='toast.missing' />);
            } else if (res && res.errCode == 2) {
                toast.error(<FormattedMessage id='notification.specialty.doNotExists' />);
            } else {
                Swal.fire(SwalConfig.errorNotification('notification.specialty.textUpdateFail'))
            }
        }
    }

    handleChangeSelectSpecialty = async (selectedSpecialty) => {
        let { language } = this.props;
        this.setState({ selectedSpecialty })
        let response = await getSpecialtyById({
            name: selectedSpecialty.value,
        });
        if (response && response.data && response.data.image) {
            this.setState({
                imageBase64: response.data.image ?
                    new Buffer.from(response.data.image, 'base64').toString('binary')
                    :
                    '',
                previewImgURL: response.data.image ?
                    new Buffer.from(response.data.image, 'base64').toString('binary')
                    :
                    '',
            })
            if (language === LANGUAGES.VI) {
                this.setState({
                    descriptionHTML: response.data.descriptionHTML,
                    descriptionMarkdown: response.data.descriptionMarkdown,
                })
            } else if (language === LANGUAGES.EN) {
                this.setState({
                    descriptionHTMLEn: response.data.descriptionHTMLEn,
                    descriptionMarkdownEn: response.data.descriptionMarkdownEn,
                })
            }
        } else {
            this.setState({
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                descriptionHTMLEn: '',
                descriptionMarkdownEn: '',
                previewImgURL: '',
                hasOldData: false,
            })
        }
    }

    buildDataInputSelectSpecialty = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.valueVi}`;
                let labelEn = `${item.valueEn}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    handelUpdateButton = () => {
        this.setState({
            isUpdate: !this.state.isUpdate,
        })
    }

    render() {
        let { hasOldData, arrSpecialty, isUpdate } = this.state
        let { language } = this.props;
        console.log('check language: ', this.props.language)
        return (
            <div className='manage-specialty-container'>
                <div className='manage-specialty-title'>
                    <FormattedMessage id="manage-specialty.title" />
                </div>
                <div className='manage-specialty-content'>
                    <div className='update-specialty row'>
                        <div className='col-4 from-group'>
                            <button onClick={() => this.handelUpdateButton()}>
                                <i className={!isUpdate ? 'fas fa-edit' : 'fas fa-plus'} ></i>
                                {!isUpdate ?
                                    <FormattedMessage id="admin.admin.edit-clinic" /> :
                                    <FormattedMessage id="admin.admin.create-clinic" />
                                }
                            </button>
                            {isUpdate &&
                                <button onClick={() => this.handelDeleteButton()} className={`delete-btn ${!this.state.selectedSpecialty.value ? 'disabled' : ''}`}>
                                    <i className='fas fa-trash' ></i>
                                    <FormattedMessage id="admin.admin.delete" />
                                </button>
                            }
                        </div>
                    </div>
                    <div className='add-new-specialty row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="manage-specialty.choose-specialty" /></label>
                            <Select
                                placeholder={<FormattedMessage id="manage-specialty.choose-specialty" />}
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelectSpecialty}
                                options={arrSpecialty}
                            />
                        </div>

                        <div className='col-4'>
                            <label className='upload'>
                            </label>
                            <div className='preview-img-container'>
                                <input id='priewImg' type='file' hidden
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                />
                                <label className='label-upload' htmlFor='priewImg'>
                                    <FormattedMessage id="manage-specialty.upload-image" />
                                    <i className='fas fa-upload'></i>
                                </label>
                                <div className='preview-image'
                                    style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                    onClick={() => this.openPreviewImage()}
                                >
                                </div>
                            </div>
                        </div>
                        <div className='col-12'>
                            <label className='description'>
                                <FormattedMessage id="manage-specialty.specialty-detail" />
                            </label>
                            <MdEditor style={{ height: '300px', }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={language === LANGUAGES.VI ? this.state.descriptionMarkdown : this.state.descriptionMarkdownEn}
                            />
                        </div>
                        <div className='col-12'>
                            {!isUpdate &&
                                <button button className='btn-create-specialty'
                                    onClick={() => this.handleSaveSpecialty()}
                                >
                                    <span><FormattedMessage id="menu.manage-doctor.create-infor" /></span>
                                </button>
                            }
                            {isUpdate &&
                                <button className='btn-save-specialty'
                                    onClick={() => this.handleUpdateSpecialty()}
                                >
                                    <span><FormattedMessage id="menu.manage-doctor.save-infor" /></span>
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        specialtyData: state.admin.specialties,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchSpecialtyStart: () => dispatch(actions.fetchSpecialtyStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageSpecialty));
