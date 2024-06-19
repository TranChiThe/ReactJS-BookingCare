import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
// import { LANGUAGES } from '../../utils/constant';
// import { changeLanguageApp } from '../../store/actions/appActions';



class Specialty extends Component {

    render() {
        return (
            <div className='section-section section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="specialty.specialty"></FormattedMessage></span>
                        <button className='btn-section'><FormattedMessage id="specialty.see-more"></FormattedMessage></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-specialty'> </div>
                                    <div className='title-images'><FormattedMessage id="specialty.specialty-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-specialty'> </div>
                                    <div className='title-images'><FormattedMessage id="specialty.specialty-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-specialty'> </div>
                                    <div className='title-images'><FormattedMessage id="specialty.specialty-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-specialty'> </div>
                                    <div className='title-images'><FormattedMessage id="specialty.specialty-title1" /></div>
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className='customize-border'>
                                    <div className='bg-img section-specialty'> </div>
                                    <div className='title-images'><FormattedMessage id="specialty.specialty-title1" /></div>
                                </div>
                            </div>

                        </Slider>
                    </div>
                </div >
            </div >
        );
    }

}

// Connect state redux to react
const mapStateToProps = state => {
    return {
    };
};

// Fire event redux
const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
