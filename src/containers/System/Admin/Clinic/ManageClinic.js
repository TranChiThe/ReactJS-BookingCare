import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTIONS } from '../../../../utils';
import * as actions from '../../../../store/actions';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../../../utils';
import { createNewClinic } from '../../../../services/userService'
import './ManageClinic.scss'
import { toast } from 'react-toastify';
import { saveInfoSuccess, saveInfoFail, editInfoSuccess, editInfoFail } from '../../../../components/NotificationConfig/notificationConfig.js'
const mdParser = new MarkdownIt();

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            introductionHTML: '',
            introductionMarkdown: '',
            proStrengthHTML: '',
            proStrengthMarkdown: '',
            equipmentHTML: '',
            equipmentMarkdown: '',
            hasOldData: false
        }
    }

    async componentDidMount() {
        this.props.fetchSpecialtyStart();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    handleOnchangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = (field, { html, text }) => {
        this.setState({
            [`${field}Markdown`]: text,
            [`${field}HTML`]: html,
        })
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

    handleSaveClinic = async () => {
        let { hasOldData } = this.state;
        let data = await createNewClinic({
            name: this.state.name,
            image: this.state.imageBase64,
            address: this.state.address,
            introductionHTML: this.state.introductionHTML,
            introductionMarkdown: this.state.introductionMarkdown,
            proStrengthHTML: this.state.proStrengthHTML,
            proStrengthMarkdown: this.state.proStrengthMarkdown,
            equipmentHTML: this.state.equipmentHTML,
            equipmentMarkdown: this.state.equipmentMarkdown,
            // actions: hasOldData === false ? CRUD_ACTIONS.CREATE : CRUD_ACTIONS.EDIT,
        });
        if (data && data.errCode === 0) {
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                introductionHTML: '',
                introductionMarkdown: '',
                proStrengthHTML: '',
                proStrengthMarkdown: '',
                equipmentHTML: '',
                equipmentMarkdown: '',
                previewImgURL: '',
                hasOldData: false
            })
            saveInfoSuccess(this.props.language)
        } else {
            saveInfoFail(this.props.language)
        }
    }

    // handleChangeSelect = async (selectedOption) => {
    //     this.setState({ selectedOption })
    //     let response = await getSpecialtyById({
    //         name: selectedOption.value,
    //     });
    //     if (response && response.data && response.data.image) {
    //         this.setState({
    //             descriptionHTML: response.data.descriptionHTML,
    //             descriptionMarkdown: response.data.descriptionMarkdown,
    //             imageBase64: response.data.image ?
    //                 new Buffer.from(response.data.image, 'base64').toString('binary')
    //                 :
    //                 '',
    //             hasOldData: true,
    //             previewImgURL: response.data.image ?
    //                 new Buffer.from(response.data.image, 'base64').toString('binary')
    //                 :
    //                 '',
    //         })
    //     } else {
    //         this.setState({
    //             imageBase64: '',
    //             descriptionHTML: '',
    //             descriptionMarkdown: '',
    //             previewImgURL: '',
    //             hasOldData: false,
    //         })
    //     }

    // }

    buildDataInputSelect = (inputData) => {
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

    render() {
        let { hasOldData } = this.state
        return (
            <div className='manage-clinic-container'>
                <div className='manage-clinic-title'><FormattedMessage id="menu.admin.manage-clinic" /></div>
                <div className='add-new-clinic row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="manage-clinic.clinic-name" /></label>
                        <input className='form-control' type='text' value={this.state.name}
                            onChange={(event) => this.handleOnchangeInput(event, 'name')}
                        />
                    </div>
                    <div className='col-4'>
                        <label className='upload'></label>
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
                    <div className='col-6 clinic-address'>
                        <label><FormattedMessage id="manage-clinic.address" /></label>
                        <input className='form-control' type='text' value={this.state.address}
                            onChange={(event) => this.handleOnchangeInput(event, 'address')}
                        />
                    </div>
                    <div className='col-12 detail-clinic'>
                        <label className='description'>
                            <FormattedMessage id="manage-clinic.description" />
                        </label>
                        <MdEditor style={{ height: '300px', }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={(data) => this.handleEditorChange('introduction', data)}
                            value={this.state.introductionMarkdown}
                        />
                    </div>
                    <div className='col-12 detail-clinic'>
                        <label className='description'>
                            <FormattedMessage id="manage-clinic.pro-strength" />
                        </label>
                        <MdEditor style={{ height: '300px', }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={(data) => this.handleEditorChange('proStrength', data)}
                            value={this.state.proStrengthMarkdown}
                        />
                    </div>
                    <div className='col-12 detail-clinic'>
                        <label className='description'>
                            <FormattedMessage id="manage-clinic.equipment" />
                        </label>
                        <MdEditor style={{ height: '300px', }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={(data) => this.handleEditorChange('equipment', data)}
                            value={this.state.equipmentMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveClinic()}
                        >
                            {hasOldData === true ?
                                <span><FormattedMessage id="menu.manage-doctor.save-infor" /></span> :
                                <span><FormattedMessage id="menu.manage-doctor.create-infor" /></span>
                            }
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        specialtyData: state.admin.specialties
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchSpecialtyStart: () => dispatch(actions.fetchSpecialtyStart()),
        saveSpecialtyInFo: (data) => dispatch(actions.saveSpecialtyInfo(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
