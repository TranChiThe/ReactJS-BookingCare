import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';


class MedicalFacility extends Component {

    render() {
        return (
            <div className='section-section section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="medicalFacility.medical"></FormattedMessage></span>
                        <button className='btn-section'><FormattedMessage id="specialty.see-more"></FormattedMessage></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-medical-facility'> </div>
                                    <div className='title-images'><FormattedMessage id="medicalFacility.medical-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-medical-facility'> </div>
                                    <div className='title-images'><FormattedMessage id="medicalFacility.medical-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-medical-facility'> </div>
                                    <div className='title-images'><FormattedMessage id="medicalFacility.medical-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-medical-facility'> </div>
                                    <div className='title-images'><FormattedMessage id="medicalFacility.medical-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-medical-facility'> </div>
                                    <div className='title-images'><FormattedMessage id="medicalFacility.medical-title1" /></div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
