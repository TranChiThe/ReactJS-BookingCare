import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
// import { LANGUAGES } from '../../utils/constant';
// import { changeLanguageApp } from '../../store/actions/appActions';



class HandBook extends Component {

    render() {
        return (
            <div className='section-section section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cẩm nang</span>
                        <button className='btn-section'><FormattedMessage id="specialty.see-more"></FormattedMessage></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            <div className="section-customize">
                                <div className='bg-img section-handbook'> </div>
                                <div className='title-images'><FormattedMessage id="specialty.specialty-title1" /></div>
                            </div>
                            <div className="section-customize">
                                <div className='bg-img section-handbook'> </div>
                                <div className='title-images'><FormattedMessage id="specialty.specialty-title2" /></div>
                            </div>
                            <div className="section-customize">
                                <div className='bg-img section-handbook'> </div>
                                <div className='title-images'><FormattedMessage id="specialty.specialty-title3" /></div>
                            </div>
                            <div className="section-customize">
                                <div className='bg-img section-handbook'> </div>
                                <div className='title-images'><FormattedMessage id="specialty.specialty-title4" /></div>
                            </div>
                            <div className="section-customize">
                                <div className='bg-img section-handbook'> </div>
                                <div className='title-images'><FormattedMessage id="specialty.specialty-title5" /></div>
                            </div>
                            <div className="section-customize">
                                <div className='bg-img section-handbook'> </div>
                                <div className='title-images'><FormattedMessage id="specialty.specialty-title6" /></div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
