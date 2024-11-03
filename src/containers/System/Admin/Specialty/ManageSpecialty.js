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
import { getSpecialtyById, getAllClinic, getAllDetailClinicById } from '../../../../services/userService'
import './ManageSpecialty.scss'
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedSpecialty: '',
            selectedClinic: '',
            arrClinic: [],
            arrSpecialty: [],
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            hasOldData: false
        }
    }

    async componentDidMount() {
        this.props.fetchSpecialtyStart();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let dataSelectSpecialty = this.buildDataInputSelectSpecialty(this.props.specialtyData)
            this.setState({
                arrSpecialty: dataSelectSpecialty,
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
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html,
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

    handleSaveSpecialty = async () => {
        let { hasOldData } = this.state;
        let data = this.props.saveSpecialtyInFo({
            name: this.state.selectedSpecialty.value,
            image: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown,
            actions: hasOldData === false ? CRUD_ACTIONS.CREATE : CRUD_ACTIONS.EDIT,
        });
        if (data) {
            toast.success('oke')
            this.setState({
                selectedSpecialty: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                previewImgURL: '',
                hasOldData: false,
            })
        }
    }

    handleChangeSelectSpecialty = async (selectedSpecialty) => {
        this.setState({ selectedSpecialty })
        let response = await getSpecialtyById({
            name: selectedSpecialty.value,
        });
        if (response && response.data && response.data.image) {
            this.setState({
                descriptionHTML: response.data.descriptionHTML,
                descriptionMarkdown: response.data.descriptionMarkdown,
                imageBase64: response.data.image ?
                    new Buffer.from(response.data.image, 'base64').toString('binary')
                    :
                    '',
                hasOldData: true,
                previewImgURL: response.data.image ?
                    new Buffer.from(response.data.image, 'base64').toString('binary')
                    :
                    '',
            })
        } else {
            this.setState({
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
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


    render() {
        let { hasOldData, arrSpecialty } = this.state
        return (
            <div className='manage-specialty-container'>
                <div className='manage-specialty-title'>
                    <FormattedMessage id="manage-specialty.title" />
                </div>
                <div className='manage-specialty-content'>
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
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className='col-12'>
                            <button className='btn-save-specialty'
                                onClick={() => this.handleSaveSpecialty()}
                            >
                                {hasOldData === true ?
                                    <span><FormattedMessage id="menu.manage-doctor.save-infor" /></span> :
                                    <span><FormattedMessage id="menu.manage-doctor.create-infor" /></span>
                                }
                            </button>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
