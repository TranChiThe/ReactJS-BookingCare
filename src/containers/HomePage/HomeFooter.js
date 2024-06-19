import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
// import { LANGUAGES } from '../../utils/constant';
// import { changeLanguageApp } from '../../store/actions/appActions';



class HomeFooter extends Component {

    render() {
        return (
            <div className='home-footer'>
                <div className='footer-info'>
                    <div className='footer-left'>
                        <div className='footer-content'>
                            <i class="fas fa-map-marker-alt"></i>
                            <p>Xuan Khanh, Ninh Kieu, Can Tho, VietNam</p>
                        </div>
                        <div className='footer-content'>
                            <i class="fas fa-phone-volume"></i>
                            <p>1234567890</p>
                        </div>
                        <div className='footer-content'>
                            <i class="fas fa-envelope"></i>
                            <p>healthcare@gmail.com</p>
                        </div>
                    </div>
                    <div className='footer-center'>
                        <div>
                            <img src='../../' />
                        </div>
                    </div>
                    <div className='footer-right'>
                        <div>
                            <p>hello</p>
                        </div>
                    </div>
                </div>
                <div className='footer-end'>
                    <p>
                        &copy;2024 HealthCare
                    </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
