import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getExtraInfoDoctorById } from '../../../services/userService'
import NumberFormat from 'react-number-format'
import './DoctorExtraInfo.scss'

class DoctorExtraInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {},
        }
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status,
        })
    }

    render() {
        let { isShowDetailInfo, extraInfo } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className='name-title'></div>
                <div className='doctor-extra-info-container'>
                    <div className='content-up'>
                        <div className='address-text'><FormattedMessage id="patient.doctor-info.text-address" /></div>
                        <div className='clinic-name'>
                            {extraInfo && extraInfo.clinicTypeData && language === LANGUAGES.VI ?
                                extraInfo.clinicTypeData.valueVi : ''}
                            {extraInfo && extraInfo.clinicTypeData && language === LANGUAGES.EN ?
                                extraInfo.clinicTypeData.valueEn : ''}
                        </div>
                        <div className='detail-address'>
                            {extraInfo && extraInfo.Clinic && language === LANGUAGES.VI ?
                                extraInfo.Clinic.address : ''}
                            {extraInfo && extraInfo.Clinic && language === LANGUAGES.EN ?
                                extraInfo.Clinic.addressEn : ''}
                        </div>
                    </div>
                    <div className='content-down'>
                        {isShowDetailInfo === false ?
                            <div className='short-info'>
                                <FormattedMessage id="patient.doctor-info.price" />
                                {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI &&
                                    <NumberFormat
                                        className='currency'
                                        value={extraInfo.priceTypeData.valueVi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'đ'}
                                    />
                                }
                                {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN &&
                                    <NumberFormat
                                        className='currency'
                                        value={extraInfo.priceTypeData.valueEn}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                    />
                                }
                                <span onClick={() => this.showHideDetailInfo(true)}>
                                    <FormattedMessage id="patient.doctor-info.detail-view" />
                                </span>

                            </div>
                            :
                            <React.Fragment>
                                <div className='title-price'>
                                    <FormattedMessage id="patient.doctor-info.price" />
                                </div>
                                <div className='detail-info'>
                                    <div className='price'>
                                        <span className='left'>
                                            <FormattedMessage id="patient.doctor-info.price" />
                                        </span>
                                        <span className='right'>
                                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI &&
                                                <NumberFormat
                                                    className='currency'
                                                    value={extraInfo.priceTypeData.valueVi}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'đ'}
                                                />
                                            }
                                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN &&
                                                <NumberFormat
                                                    className='currency'
                                                    value={extraInfo.priceTypeData.valueEn}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'$'}
                                                />
                                            }
                                        </span>
                                    </div>
                                    <div className='note'>
                                        {extraInfo && extraInfo.nameClinic ?
                                            extraInfo.note : ''}
                                    </div>
                                </div>
                                <div className='payment'>
                                    <FormattedMessage id="patient.doctor-info.note" />
                                    {extraInfo && extraInfo.paymentTypeData && language === LANGUAGES.VI ?
                                        extraInfo.paymentTypeData.valueVi : ''}
                                    {extraInfo && extraInfo.paymentTypeData && language === LANGUAGES.EN ?
                                        extraInfo.paymentTypeData.valueEn : ''}
                                </div>
                                <div className='hide-Price'>
                                    <span onClick={() => this.showHideDetailInfo(false)}>
                                        <FormattedMessage id="patient.doctor-info.hidden-view" />
                                    </span>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
