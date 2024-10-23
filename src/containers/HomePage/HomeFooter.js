import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ChaBotComponent from '../../components/ChatBot/ChatBotComponent.js'

class HomeFooter extends Component {
    render() {
        return (
            <React.Fragment>
                <div className='home-footer'>
                    <div className='footer-info'>
                        <div className='footer-left'>
                            <div className='footer-title'>
                                <div className='logo'></div>
                                <p className='logo-title'>HealthCare</p>
                            </div>
                            <div className='footer-content form-group'>
                                <i class="fas fa-map-marker-alt"></i>
                                <p>Xuan Khanh, Ninh Kieu, Can Tho, VietNam</p>
                            </div>
                            <div className='footer-content form-group'>
                                <i class="fas fa-phone-volume"></i>
                                <p>1234567890</p>
                            </div>
                            <div className='footer-content form-group'>
                                <i class="fas fa-envelope"></i>
                                <p>healthcarecantho@gmail.com</p>
                            </div>
                        </div>
                        <div className='footer-center'>
                            <div className='center-title'>
                                <FormattedMessage id="homefooter.medical-service" />
                            </div>
                            <div className='specialty'><FormattedMessage id="homefooter.specialized-examination" /></div>
                            <div className='specialty'><FormattedMessage id="homefooter.general-examination" /></div>
                            <div className='specialty'><FormattedMessage id="homefooter.dental-examination" /></div>
                            <div className='specialty'><FormattedMessage id="homefooter.mental-health" /></div>
                            <div className='specialty'><FormattedMessage id="homefooter.medical-tests" /></div>
                        </div>
                        <div className='footer-right'>
                            <div>

                            </div>
                        </div>
                    </div>
                    <div className='footer-end'>
                        <p>
                            &copy;2024 HealthCare
                        </p>
                    </div>
                </div>
                <ChaBotComponent />
            </React.Fragment>
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
