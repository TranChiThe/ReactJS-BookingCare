import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../../utils';
import { createNewSpecialty } from '../../../services/userService'
import './ManageSpecialty.scss'
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nameVi: '',
            nameEn: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
        }
    }

    async componentDidMount() {

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
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Success')
            this.setState({
                nameVi: '',
                nameEn: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })
        } else {
            toast.error('Fail')
        }
    }

    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='manage-specialty-title'>Quan ly chuyen khoa</div>
                <div className='add-new-specialty row'>
                    <div className='col-4 form-group'>
                        <label>Ten chuyen khoa (VietNam)</label>
                        <input className='form-control' type='text'
                            value={this.state.nameVi}
                            onChange={(event) => this.handleOnchangeInput(event, 'nameVi')}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>Ten chuyen khoa(English)</label>
                        <input className='form-control' type='text'
                            value={this.state.nameEn}
                            onChange={(event) => this.handleOnchangeInput(event, 'nameEn')}
                        />
                    </div>
                    <div className='col-4'>
                        <label><FormattedMessage id="manage-user.avatar" /></label>
                        <div className='preview-img-container'>
                            <input id='priewImg' type='file' hidden
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <label className='label-upload' htmlFor='priewImg'>
                                <FormattedMessage id="manage-user.image" />
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
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
