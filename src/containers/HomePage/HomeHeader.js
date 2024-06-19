import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';

class HomeHeader extends Component {

    changeLanguage = (language) => {
        // fire redux event: actions
        this.props.changeLanguageAppRedux(language);
    }

    render() {
        let language = this.props.language;
        let placeholder = <FormattedMessage id="specialty.specialty-title6" />
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo'>

                            </div>
                            <div className='logo-text'>HealthCare</div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.specialty" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.search-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.choose-a-clinic" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.choose-a-good-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.examination-package" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.general-health-check" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <i className="fas fa-question-circle"></i>
                                <FormattedMessage id="homeheader.support" />
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span
                                onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span
                                onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                    </div>
                </div>
                <div className='home-header-banner'>
                    <div className='content-up'>
                        <div className='title1'><FormattedMessage id="banner.title1" /></div>
                        <div className='title2'><FormattedMessage id="banner.title2" /></div>
                        <div className='search' >
                            <i class="fas fa-search"></i>
                            <input type='text' placeholder={placeholder} />
                        </div>
                    </div>
                    <div className='content-down'>
                        <div className='home-option'>
                            <div className='child-option'>
                                <div className='child-icon'>
                                    <i class="far fa-hospital"></i>
                                </div>
                                <div className='child-text'><FormattedMessage id="banner.child1" /></div>
                            </div>
                            <div className='child-option'>
                                <div className='child-icon'>
                                    <i class="fas fa-notes-medical"></i>
                                </div>
                                <div className='child-text'><FormattedMessage id="banner.child2" /></div>
                            </div>
                            <div className='child-option'>
                                <div className='child-icon'>
                                    <i className="fas fa-flask"></i>
                                </div>
                                <div className='child-text'><FormattedMessage id="banner.child3" /></div>
                            </div>
                            <div className='child-option'>
                                <div className='child-icon'>
                                    <i class="fas fa-user-md"></i>
                                </div>
                                <div className='child-text'><FormattedMessage id="banner.child4" /></div>
                            </div>
                            <div className='child-option'>
                                <div className='child-icon'>
                                    <i class="fas fa-briefcase-medical"></i>
                                </div>
                                <div className='child-text'><FormattedMessage id="banner.child5" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }

}

// Connect state redux to react
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

// Fire event redux
const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (laguage) => dispatch(changeLanguageApp(laguage)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
