import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format'
import './ManageListDoctorSchedule.scss'

class ManageListDoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }



    render() {
        return (
            <div className='doctor-container'>
                <div className='user-doctor-body'>
                    <div className='doctor-manage-table'>
                        <div className="users-container">
                            <table id="customers">
                                <tbody>
                                    <tr>
                                        <th></th>
                                        <th>Email</th>
                                        <th>Full Name</th>
                                        <th>Position</th>
                                        <th>Schedule</th>
                                        <th>Date</th>
                                        <th>Note</th>
                                        <th></th>
                                    </tr>
                                    {/* {arrUsers && arrUsers.length > 0 &&
                                    arrUsers.map((item, index) => {
                                        let nameVi = item.lastName + ' ' + item.firstName
                                        let nameEn = item.firstName + ' ' + item.lastName
                                        let positionVi = item && item.positionData ? item.positionData.valueVi : '';
                                        let positionEn = item && item.positionData ? item.positionData.valueEn : '';
                                        let genderVi = item && item.genderData ? item.genderData.valueVi : '';
                                        let genderEn = item && item.genderData ? item.genderData.valueEn : '';

                                        return (
                                            <tr className="" key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.email}</td>
                                                <td>{this.props.language === LANGUAGES.VI ? positionVi : positionEn}</td>
                                                <td>{this.props.language === LANGUAGES.VI ? nameVi : nameEn}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>{item.address}</td>
                                                <td>{this.props.language === LANGUAGES.VI ? genderVi : genderEn}</td>
                                                <td>
                                                    <button className="btn-edit"
                                                        onClick={() => this.handleUserEdit(item)}
                                                    >
                                                        <i className='fas fa-pencil-alt'></i>
                                                    </button>
                                                    <button className="btn-delete"
                                                        onClick={() => { this.handUserDelete(item) }}
                                                        onSubmit={() => { this.confirmUserDelete() }}
                                                    >
                                                        <i className='fas fa-trash'></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                } */}
                                </tbody>
                            </table>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageListDoctorSchedule);
