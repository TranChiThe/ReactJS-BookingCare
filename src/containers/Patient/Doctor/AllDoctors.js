import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import DoctorExtraInfo from './DoctorExtraInfo';
import SpecialtyInfo from '../Specialty/SpecialtyInfo';
import './AllDoctors.scss';

class AllDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
        };
    }

    componentDidMount() {
        this.updateDoctorsList();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.arrDoctorFromParent !== this.props.arrDoctorFromParent) {
            this.updateDoctorsList();
        }
    }

    updateDoctorsList = () => {
        this.setState({
            arrDoctors: this.props.arrDoctorFromParent,
        });
    };

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    };

    renderDoctorName = (doctor) => {
        const { language } = this.props;
        const nameVi = `${doctor.positionData.valueVi}, ${doctor.lastName} ${doctor.firstName}`;
        const nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName}`;
        return language === LANGUAGES.VI ? nameVi : nameEn;
    };

    render() {
        const { arrDoctors } = this.state;

        return (
            <React.Fragment>
                <div className='specialty-container-search'>
                    <div className='specialty-body'>
                        {arrDoctors && arrDoctors.length > 0 ? (
                            arrDoctors.map((doctor, index) => {
                                const imageBase64 = doctor.image
                                    ? new Buffer.from(doctor.image, 'base64').toString('binary')
                                    : '';

                                return (
                                    <div className='specialty-item' key={index}
                                        onClick={() => this.handleViewDetailDoctor(doctor)}>
                                        <div className='content-left'>
                                            <div className='image'
                                                style={{ backgroundImage: `url(${imageBase64})` }} />
                                        </div>
                                        <div className='content-right'>
                                            <div className='doctor-info'>
                                                {this.renderDoctorName(doctor)} -
                                            </div>
                                            <div className='doctor-info'>
                                                <SpecialtyInfo specialtyIdFromParent={doctor.Doctor_Infor.specialtyId} />
                                            </div>
                                            <div className='clinic-info'>
                                                <DoctorExtraInfo doctorIdFromParent={doctor.id} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className='doctor-notification'>
                                <FormattedMessage id="patient.doctor-search.doctor-notify" />
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(AllDoctors));
