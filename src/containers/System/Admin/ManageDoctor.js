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
import { getDetailInForDoctor } from '../../../services/userService'
const mdParser = new MarkdownIt();


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkDown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            arrDoctor: [],
            hasOldData: false,
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctorStart();
        // this.props.getDetailInforDoctor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                arrDoctor: dataSelect,
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                arrDoctor: dataSelect,
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkDown: text,
            contentHTML: html,
        })
    }

    handleSaveContentMarkDown = () => {
        let { hasOldData } = this.state;
        let data = this.props.saveDetailInforDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkDown: this.state.contentMarkDown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            actions: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
        })
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        // let response = await this.props.getDetailInforDoctor(selectedDoctor.value);
        let response = await getDetailInForDoctor(selectedDoctor.value);
        if (response && response.data && response.data.MarkDown) {
            let markdown = response.data.MarkDown
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkDown: markdown.contentMarkDown,
                description: markdown.description,
                hasOldData: true,
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkDown: '',
                description: '',
                hasOldData: false
            })
        }
        console.log(`Option selected:`, response)
        console.log('check doctor: ', selectedDoctor);
    };

    handleOnchangeDesc = (event) => {
        this.setState({
            description: event.target.value,
        })
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let lableVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language === LANGUAGES.VI ? lableVi : labelEn
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    Thêm thông tin chi tiết bác sĩ
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <div className='doctor-selected'>
                            <lable><FormattedMessage id="menu.detail-doctor.choose-doctor" /> </lable>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.arrDoctor}
                            />
                        </div>
                    </div>
                    <div className='content-right form-group'>
                        <div className='doctor-description'>
                            <label><FormattedMessage id="menu.detail-doctor.description" /></label>
                            <textarea className='form-control' rows='4'
                                onChange={(event) => this.handleOnchangeDesc(event)}
                                value={this.state.description}
                            >
                            </textarea>
                        </div>
                    </div>
                </div>
                <div className='mange-doctor-editor'>
                    <label><FormattedMessage id="menu.detail-doctor.content" /></label>
                    <MdEditor style={{ height: '500px', }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkDown}
                    />
                </div>
                <button className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                    onClick={() => this.handleSaveContentMarkDown()}
                >
                    {hasOldData === true ?
                        <span>Lưu thông tin</span> :
                        <span>Tạo thông tin</span>
                    }
                </button>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailDoctor: state.admin.detailDoctor,
        allDoctors: state.admin.allDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorStart: () => dispatch(actions.fetchAllDoctorStart()),
        getDetailInforDoctor: (data) => dispatch(actions.fetchDetailInforDoctorStart(data)),
        saveDetailInforDoctor: (data) => dispatch(actions.saveDetailInforDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
