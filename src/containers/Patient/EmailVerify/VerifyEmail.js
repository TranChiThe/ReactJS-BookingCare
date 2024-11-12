import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import { postVerifyBookAppointment } from '../../../services/userService'
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import './VerifyEmail.scss'

class VerifyEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let patientId = urlParams.get('patientId');
            let date = urlParams.get('date');
            let timeType = urlParams.get('timeType');
            let res = await postVerifyBookAppointment({
                token: token,
                // doctorId: doctorId
                patientId: patientId,
                date: date,
                timeType: timeType
            })
            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    render() {
        let { statusVerify, errCode } = this.state;
        return (
            <React.Fragment>
                <HomeHeader />
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div className='info-booking'>
                            Loading data....
                        </div>
                        :
                        <div className={`info-booking ${errCode === 0 ? 'success' : 'error'}`}>
                            <div className="icon">
                                {errCode === 0 ? '✅' : '❌'}
                            </div>
                            <div className="message">
                                {errCode === 0 ? <FormattedMessage id='notification.patient.textConfirm' /> : <FormattedMessage id='notification.patient.textConfirmFail' />}
                            </div>
                            <div className="description">
                                {errCode === 0 ? <FormattedMessage id='notification.patient.descriptionConfirm' /> : <FormattedMessage id='notification.patient.descriptionFail' />}
                            </div>
                        </div>
                    }
                </div>

                <HomeFooter />
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
