import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format'
import DatePicker from '../../../../components/Input/DatePicker';
import { getScheduleDoctorByDate } from '../../../../services/userService'
import './ManageSchedule.scss'


class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: '',
            arrSchedule: {},
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
        if (prevState.currentDate !== this.state.currentDate) {
            let { currentDate } = this.state;
            let dateSchedule = new Date(currentDate).getTime();
            let res = await getScheduleDoctorByDate('14', dateSchedule)
            if (res && res.errCode === 0) {
                this.setState({
                    arrSchedule: res.data
                })
            }
        }
    }

    handleOnchangeDatePicker = async (date) => {
        let { currentDate } = this.state;
        let dateSchedule = new Date(currentDate).getTime();
        this.setState({
            currentDate: date[0],
        })
        let res = await getScheduleDoctorByDate('14', dateSchedule)
        if (res && res.errCode === 0) {
            this.setState({
                arrSchedule: res.data
            })
        }
    }

    render() {
        const { language } = this.props;
        let { arrSchedule } = this.state
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        return (
            <div className='doctor-container'>
                <div className='manage-schedule-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-2'>
                            <label>
                                <FormattedMessage id="manage-schedule.choose-date" />
                            </label>
                            <DatePicker
                                placeholder={''}
                                onChange={this.handleOnchangeDatePicker}
                                className='form-control'
                                selected={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                    </div>
                </div>
                <div className='user-doctor-body'>
                    <div className='doctor-manage-table'>
                        <div className="users-container">
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th><FormattedMessage id="manage-schedule.full-name" /></th>
                                        <th><FormattedMessage id="manage-schedule.schedule" /></th>
                                        <th><FormattedMessage id="manage-schedule.currentNumber" /></th>
                                        <th><FormattedMessage id="manage-schedule.maxNumber" /></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {arrSchedule && arrSchedule.length > 0 &&
                                        arrSchedule.map((item, index) => {
                                            let nameVi = item.doctorData.lastName + ' ' + item.doctorData.firstName;
                                            let nameEn = item.doctorData.firstName + ' ' + item.doctorData.lastName;
                                            let positionVi = item && item.positionData ? item.positionData.valueVi : '';
                                            let positionEn = item && item.positionData ? item.positionData.valueEn : '';
                                            let timeDataEn = item && item.timeTypeData ? item.timeTypeData.valueEn : '';
                                            let timeDataVi = item && item.timeTypeData ? item.timeTypeData.valueVi : ''
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{language === LANGUAGES.VI ? nameVi : nameEn}</td>
                                                    <td>{language === LANGUAGES.VI ? timeDataVi : timeDataEn}</td>
                                                    <td style={{ padding: '0 100px' }}>{item.currentNumber ? item.currentNumber : 0}</td>
                                                    <td style={{ padding: '0 100px' }}>{item.maxNumber}</td>

                                                    <td>
                                                        <button className="btn-edit" onClick={() => this.handleUserEdit(item)}>
                                                            <i className='fas fa-pencil-alt'></i>
                                                        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
