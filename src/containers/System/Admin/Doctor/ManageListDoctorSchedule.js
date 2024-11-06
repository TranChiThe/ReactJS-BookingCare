import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils';
import { deleteDoctorSchedule } from '../../../../services/userService';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { SwalConfig } from '../../../../components/NotificationConfig/notificationSwal';
import { notificationEn } from '../../../../components/NotificationConfig/notificationEn';
import { notificationVi } from '../../../../components/NotificationConfig/notificationVi';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ManageListDoctorSchedule.scss';



class ManageListDoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    toggle = () => {
        this.props.handleChangeToggle();
    }

    handleUserDelete = async (appointmentId) => {
        let { language } = this.props;
        if (language === LANGUAGES.EN) {
            Swal.fire(SwalConfig.confirmDialog(notificationEn.title, notificationEn.text, notificationEn.confirm, notificationEn.cancel))
                .then((result) => {
                    if (result.isConfirmed) {
                        deleteDoctorSchedule(appointmentId);
                        this.props.handleScheduleSearch();
                        Swal.fire(SwalConfig.successNotification(notificationEn.deleteTitle, notificationEn.deleteText));
                        this.props.handleScheduleSearch();
                        this.props.fetchScheduleData()
                    }
                });
        } else if (language === LANGUAGES.VI) {
            Swal.fire(SwalConfig.confirmDialog(notificationVi.title, notificationVi.text, notificationVi.confirm, notificationVi.cancel))
                .then((result) => {
                    if (result.isConfirmed) {
                        deleteDoctorSchedule(appointmentId);
                        this.props.handleScheduleSearch();
                        Swal.fire(SwalConfig.successNotification(notificationVi.deleteTitle, notificationVi.deleteText));
                        this.props.handleScheduleSearch();
                        this.props.fetchScheduleData()
                    }
                });
        }
    };

    render() {
        const { language, isOpen } = this.props;
        let arrSchedule = this.props.dataSchedule
        let doctorName = this.props.selectedDoctor ? this.props.selectedDoctor.label : ''
        return (
            <Modal isOpen={isOpen} className={'list-doctor-schedule'}
                size='lg'
            >
                <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id="manage-schedule.schedule-information" />{doctorName}</ModalHeader>
                <div className='doctor-container'>
                    <div className='user-doctor-body'>
                        <div className='doctor-manage-table'>
                            <div className="users-container">
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th><FormattedMessage id="manage-schedule.schedule" /></th>
                                            <th><FormattedMessage id="manage-schedule.maxNumber" /></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {arrSchedule && arrSchedule.length > 0 &&
                                            arrSchedule.map((item, index) => {
                                                let timeDataEn = item && item.timeTypeData ? item.timeTypeData.valueEn : '';
                                                let timeDataVi = item && item.timeTypeData ? item.timeTypeData.valueVi : ''
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{language === LANGUAGES.VI ? timeDataVi : timeDataEn}</td>
                                                        <td style={{ padding: '0 100px' }}>{item.maxNumber}</td>

                                                        <td>
                                                            <button className="btn-delete" onClick={() => this.handleUserDelete(item.id)}>
                                                                <i className='fas fa-trash'></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalFooter>
                    <Button color="secondary" className="px-3"
                        onClick={() => { this.toggle() }}>
                        <FormattedMessage id="manage-user.close" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default connect(mapStateToProps)(ManageListDoctorSchedule);

