import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import DoctorExtraInfo from './DoctorExtraInfo';
import SpecialtyInfo from '../Specialty/SpecialtyInfo';
import './AllDoctors.scss'

class AllDoctors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
        }
    }

    async componentDidMount() {
        this.setState({
            arrDoctors: this.props.arrDoctorFromParent
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
        if (prevProps.arrDoctorFromParent !== this.props.arrDoctorFromParent) {
            this.setState({
                arrDoctors: this.props.arrDoctorFromParent
            })
        }
    }

    handleViewDetailDoctor(doctor) {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }

    render() {
        let arrDoctors = this.state.arrDoctors;
        return (
            <React.Fragment>
                <div className='specialty-container'>
                    <div className='specialty-body'>
                        {arrDoctors && arrDoctors.length > 0 &&
                            arrDoctors.map((item, index) => {
                                let imageBase64 = '';
                                if (item.image) {
                                    imageBase64 = new Buffer.from(item.image, 'base64').toString('binary');
                                }
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`
                                return (
                                    <div className='specialty-item'
                                        onClick={() => this.handleViewDetailDoctor(item)}
                                    >
                                        <div className='content-left'>
                                            <div className='image'
                                                style={{ backgroundImage: `url(${imageBase64})` }}
                                            >
                                            </div>
                                        </div>

                                        <div className='content-right' >
                                            <div className='doctor-info'>
                                                {this.props.language === LANGUAGES.VI ? nameVi : nameEn} -
                                            </div>
                                            <div className='doctor-info'>
                                                <SpecialtyInfo specialtyIdFromParent={item.Doctor_Infor.specialtyId} />
                                            </div>
                                            <div className='clinic-info'>
                                                <DoctorExtraInfo
                                                    doctorIdFromParent={item.id}
                                                />
                                            </div>
                                            <div>

                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>
                    {arrDoctors && arrDoctors.length === 0 &&
                        <div className='doctor-notification'>
                            <FormattedMessage id="patient.doctor-search.doctor-notify" />
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllDoctors));
