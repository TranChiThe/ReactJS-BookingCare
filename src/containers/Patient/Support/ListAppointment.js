import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { deleteDoctorSchedule } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./ListAppointment.scss";

class ListAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() { }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    toggle = () => {
        this.props.handleChangeToggle();
    };

    render() {
        let { language } = this.props;
        let arrSchedule = [];
        return (
            <div className="appointment-list-container">
                <div className="appointment-list-body">
                    <div className="appointment-manage-table">
                        <div className="appointment-container">
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Ngày đặt lịch</th>
                                        <th>Họ tên bác sĩ</th>
                                        <th>Giờ khám</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {arrSchedule &&
                                        arrSchedule.length > 0 &&
                                        arrSchedule.map((item, index) => {
                                            let timeDataEn =
                                                item && item.timeTypeData
                                                    ? item.timeTypeData.valueEn
                                                    : "";
                                            let timeDataVi =
                                                item && item.timeTypeData
                                                    ? item.timeTypeData.valueVi
                                                    : "";
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {language === LANGUAGES.VI
                                                            ? timeDataVi
                                                            : timeDataEn}
                                                    </td>
                                                    <td style={{ padding: "0 100px" }}>
                                                        {item.maxNumber}
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => this.handleUserEdit(item)}
                                                        >
                                                            <i className="fas fa-pencil-alt"></i>
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => this.handleUserDelete(item.id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
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
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(ListAppointment);
