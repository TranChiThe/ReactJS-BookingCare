import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import image1 from '../../../assets/images/handbook/image1.png'
import image2 from '../../../assets/images/handbook/image2.jpg'
import image3 from '../../../assets/images/handbook/image3.jpg'

class HandBook extends Component {
    render() {
        return (
            <div className='section-section section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id='handbook.handbook' />
                        </span>
                        {/* <button className='btn-section'><FormattedMessage id="specialty.see-more"></FormattedMessage></button> */}
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            <div className="section-customize ">
                                <div className='bg-img section-handbook img-handbook'
                                    style={{ backgroundImage: `url(${image1})` }}
                                > </div>
                                {/* <div className='title-images'><FormattedMessage id="specialty.specialty-title1" /></div> */}
                            </div>
                            <div className="section-customize ">
                                <div className='bg-img section-handbook img-handbook'
                                    style={{ backgroundImage: `url(${image2})` }}
                                > </div>
                                {/* <div className='title-images'><FormattedMessage id="specialty.specialty-title2" /></div> */}
                            </div>
                            <div className="section-customize ">
                                <div className='bg-img section-handbook img-handbook'
                                    style={{ backgroundImage: `url(${image3})` }}
                                > </div>
                                {/* <div className='title-images'><FormattedMessage id="specialty.specialty-title2" /></div> */}
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
