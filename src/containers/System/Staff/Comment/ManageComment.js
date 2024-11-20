import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTIONS } from '../../../../utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import NumberFormat from 'react-number-format'
import Pagination from '../../../../components/Pagination/Pagination';
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig';
import { toast } from 'react-toastify';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { getAllDoctorCommentByDate, deleteDoctorComment } from '../../../../services/userService'
import moment from 'moment';
import './ManageComment.scss'

class commentRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            limit: 10,
            totalPages: 1,
            startDate: '',
            endDate: '',
            arrDoctor: [],
            selectedDoctor: '',
            arrComments: []
        }
    }

    async componentDidMount() {
        await this.props.getAllRequiredDoctorInfo()
        await this.props.fetchAllDoctorStart('', '');
        // await this.fetAllCommentDoctor()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                arrDoctor: dataSelect,
            })
        }
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                arrDoctor: dataSelect,
            });
        }
    }

    fetAllCommentDoctor = async () => {
        let { selectedDoctor, startDate, endDate, currentPage, limit } = this.state
        const startDateFormatted = moment(new Date(startDate)).format('YYYY-MM-DD HH:mm:ss');
        const endDateFormatted = moment(new Date(endDate)).format('YYYY-MM-DD HH:mm:ss');
        let res = await getAllDoctorCommentByDate(selectedDoctor?.value, startDateFormatted, endDateFormatted, currentPage, limit);
        if (res && res.errCode === 0) {
            this.setState({
                arrComments: res.data,
                currentPage: res.currentPage,
                totalPages: res.totalPages
            })
        } else {
            toast.error(<FormattedMessage id='toast.error' />)
        }
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor }, async () => {
            await this.fetAllCommentDoctor();
        });
    }
    handlecommentDelete = async (comment) => {
        let SwalConfig = createSwalConfig(this.props.intl)
        let result = await Swal.fire(SwalConfig.confirmDialog())
        if (result.isConfirmed) {
            let res = await deleteDoctorComment(comment.id);
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.comment.deleteSuccess'))
                this.fetAllCommentDoctor();
            } else {
                Swal.fire(SwalConfig.errorNotification('notification.comment.deleteFail'))
            }
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
        }
        return result;
    }

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage }, this.fetAllCommentDoctor);
    };

    handleOnchangeDatePickerStartDate = async (date) => {
        this.setState({
            startDate: date[0],
        }, this.fetAllCommentDoctor);
    }

    handleOnchangeDatePickerEndDate = async (date) => {
        this.setState({
            endDate: date[0]
        }, this.fetAllCommentDoctor);
    }
    formatDateVi = (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    formatDateEn = (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    render() {
        let { currentPage, totalPages, arrComments } = this.state
        let { language } = this.props
        return (
            <React.Fragment>
                <div className='comment-redux-container'>
                    <div className='comment-title'>
                        <FormattedMessage id="menu.admin.manage-comment" />
                    </div>
                    <div className='right-menu'>
                        <div className=' selected-doctor'>
                            <Select
                                placeholder={<FormattedMessage id="menu.manage-doctor.choose-doctor" />}
                                value={this.state.selectedOptions}
                                onChange={this.handleChangeSelect}
                                options={this.state.arrDoctor}
                            />
                        </div>
                        <div className=' seleted-date-start'>
                            <DatePicker
                                onChange={this.handleOnchangeDatePickerStartDate}
                                className='form-control'
                                selected={this.state.startDate}
                                placeholder={this.props.intl.formatMessage({ id: 'manage-comment.start-date' })}
                            />
                        </div>
                        <div className=' seleted-date-end'>
                            <DatePicker
                                onChange={this.handleOnchangeDatePickerEndDate}
                                className='form-control'
                                selected={this.state.endDate}
                                placeholder={this.props.intl.formatMessage({ id: 'manage-comment.end-date' })}
                            // minDate={nextday}
                            />
                        </div>
                    </div>
                    <div className='comment-redux-body'>
                        <div className='comment-manage-table'>
                            <div className="comments-container">
                                <table id="customers">
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            {/* <th><FormattedMessage id="manage-comment.doctor" /></th> */}
                                            <th><FormattedMessage id="manage-comment.patient" /></th>
                                            <th><FormattedMessage id="manage-comment.content" /></th>
                                            <th><FormattedMessage id="manage-comment.date" /></th>
                                            <th></th>
                                        </tr>
                                        {arrComments && arrComments.length > 0 &&
                                            arrComments.map((item, index) => {
                                                let doctorNameVi = `${item.doctorComment?.lastName} ${item.doctorComment?.firstName}`
                                                let doctorNameEn = `${item.doctorComment?.firstName} ${item.doctorComment?.lastName}`
                                                let patientNameVi = `${item.patientComment?.lastName} ${item.patientComment?.firstName}`
                                                let patientNameEn = `${item.patientComment?.firstName} ${item.patientComment?.lastName}`
                                                let examinationDate = moment(Number(item.examinationDate)).format('DD - MM - YYYY')
                                                return (
                                                    <tr className="" key={index}>
                                                        <td>{index + 1 + (this.state.currentPage - 1) * this.state.limit}</td>
                                                        {/* <td>{language === LANGUAGES.VI ? doctorNameVi : doctorNameEn}</td> */}
                                                        <td>{language === LANGUAGES.VI ? patientNameVi : patientNameEn}</td>
                                                        <td style={{ maxWidth: '500px', minWidth: '300px' }}>{item.content}</td>
                                                        <td>{language === LANGUAGES.VI ? this.formatDateVi(item.examinationDate) : this.formatDateEn(item.examinationDate)}</td>
                                                        <td>
                                                            <button className="btn-delete"
                                                                onClick={() => { this.handlecommentDelete(item) }}
                                                                onSubmit={() => { this.confirmcommentDelete() }}
                                                            >
                                                                <i className='fas fa-trash'></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                />
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listcomments: state.admin.data,
        currentPage: state.admin.currentPage,
        totalPages: state.admin.totalPages,
        roleId: state.auth.role,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllRequiredDoctorInfo: () => dispatch(actions.fetchAllRequiredDoctorStart()),
        fetchAllDoctorStart: (specialtyId, clinicId) => dispatch(actions.fetchAllDoctorStart(specialtyId, clinicId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(commentRedux));
