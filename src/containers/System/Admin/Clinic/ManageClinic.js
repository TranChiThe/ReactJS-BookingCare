import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../../../utils';
import { getAllClinic, getAllDetailClinicById, updateClinicInformation, createNewClinic } from '../../../../services/userService'
import { toast } from 'react-toastify';
import { saveInfoSuccess, saveInfoFail, editInfoSuccess, editInfoFail } from '../../../../components/NotificationConfig/notificationConfig.js'
import './ManageClinic.scss'

const mdParser = new MarkdownIt();

class ManageClinicInfo extends Component {

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
            arrClinic: [],
            selectedClinic: '',
            isUpdate: false,
        }
    }

    async componentDidMount() {
        this.getAllClinic();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    getAllClinic = async () => {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            let arrClinic = this.buildDataInputSelect(res.data)
            this.setState({
                arrClinic: arrClinic
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

    handleUpdateClinic = async () => {
        let data = await updateClinicInformation({
            id: this.state.selectedClinic ? this.state.selectedClinic.value : '',
            name: this.state.name,
            image: this.state.imageBase64,
            address: this.state.address,
            introductionHTML: this.state.introductionHTML,
            introductionMarkdown: this.state.introductionMarkdown,
            proStrengthHTML: this.state.proStrengthHTML,
            proStrengthMarkdown: this.state.proStrengthMarkdown,
            equipmentHTML: this.state.equipmentHTML,
            equipmentMarkdown: this.state.equipmentMarkdown,
        });
        this.getAllClinic()
        if (data && data.errCode === 0) {
            this.setState({
                selectedClinic: '',
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
            })
            saveInfoSuccess(this.props.language)
        } else {
            saveInfoFail(this.props.language)
        }
    }

    handleSaveClinic = async () => {
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

    handleChangeSelect = async (selectedClinic) => {
        this.setState({ selectedClinic })
        let response = await getAllDetailClinicById({
            id: selectedClinic.value,
        });
        if (response && response.data && response.data.image) {
            this.setState({
                name: response.data.name,
                address: response.data.address,
                introductionHTML: response.data.introductionHTML,
                introductionMarkdown: response.data.introductionMarkdown,
                proStrengthHTML: response.data.proStrengthHTML,
                proStrengthMarkdown: response.data.proStrengthMarkdown,
                equipmentHTML: response.data.equipmentHTML,
                equipmentMarkdown: response.data.equipmentMarkdown,
                imageBase64: response.data.image ?
                    new Buffer.from(response.data.image, 'base64').toString('binary')
                    :
                    '',
                previewImgURL: response.data.image ?
                    new Buffer.from(response.data.image, 'base64').toString('binary')
                    :
                    '',
            })
        } else {
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
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handelUpdateButton = () => {
        this.setState({
            isUpdate: !this.state.isUpdate,
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
            selectedClinic: '',
        })
    }

    render() {
        let { arrClinic, selectedClinic, isUpdate } = this.state
        console.log('check state: ', this.state)
        return (
            <div className='manage-clinic-container'>
                <div className='manage-clinic-title'>
                    <FormattedMessage id="menu.admin.manage-clinic" />
                </div>
                <div className='manage-clinic-content'>
                    <div className='update-clinic row'>
                        <div className='col-4 from-group'>
                            <button onClick={() => this.handelUpdateButton()}>
                                <i className={!isUpdate ? 'fas fa-edit' : 'fas fa-plus'} ></i>
                                {!isUpdate ?
                                    <FormattedMessage id="admin.admin.edit-clinic" /> :
                                    <FormattedMessage id="admin.admin.create-clinic" />
                                }
                            </button>
                        </div>
                        <div className='col-4 form-group'>
                            <div className={`selected-clinic ${!isUpdate ? 'disabled' : ''}`}>
                                <label><FormattedMessage id="manage-clinic.clinic-name" /></label>
                                <Select
                                    placeholder={<FormattedMessage id="manage-clinic.clinic-name" />}
                                    value={selectedClinic}
                                    onChange={this.handleChangeSelect}
                                    options={arrClinic}
                                />
                            </div>
                        </div>
                    </div>
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
                        {this.state.isUpdate &&
                            <div className='col-12'>
                                <button className='btn-save-specialty'
                                    onClick={() => this.handleUpdateClinic()}
                                >

                                    <span><FormattedMessage id="menu.manage-doctor.save-infor" /></span>
                                </button>
                            </div>
                        }
                        {!this.state.isUpdate &&
                            <div className='col-12'>
                                <button className='btn-save-specialty'
                                    onClick={() => this.handleSaveClinic()}
                                >

                                    <span><FormattedMessage id="menu.manage-doctor.create-infor" /></span>
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinicInfo);
