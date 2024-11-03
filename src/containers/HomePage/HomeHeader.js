import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';
import { FaTooth } from "react-icons/fa";
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import * as actions from '../../store/actions';
import './HomeHeader.scss';


class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLanguageList: false,
        };
    }
    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
        this.setState({ showLanguageList: false });
    }

    toggleLanguageList = () => {
        this.setState({ showLanguageList: !this.state.showLanguageList });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (event) => {
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown && !dropdown.contains(event.target)) {
            this.setState({ showLanguageList: false });
        }
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/home');
        }
    }
    handleClickSearch = () => {
        if (this.props.history) {
            this.props.history.push('/home-search');
        }
    }
    handleSupport = () => {
        if (this.props.history) {
            this.props.history.push('/user-support');
        }
    }

    render() {
        let settings = {
            dots: true,
            infinite: true,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 3500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        let language = this.props.language;
        let { darkMode } = this.props
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo' onClick={() => this.returnToHome()}></div>
                            <div className='logo-text' onClick={() => this.returnToHome()}>HealthCare</div>
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
                            <div className='support'
                                onClick={() => this.handleSupport()}
                            >
                                <i className="fas fa-question-circle"></i>
                                <FormattedMessage id="homeheader.support" />
                            </div>

                            {this.state.showLanguageList && (
                                <div className={`language-list ${darkMode ? 'dark-mode' : ''}`}>
                                    <div
                                        className={`language-item ${language === LANGUAGES.VI ? 'active' : ''}`}
                                        onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
                                    >
                                        <span className="flag-icon flag-icon-vi"></span>
                                    </div>
                                    <div
                                        className={`language-item ${language === LANGUAGES.EN ? 'active' : ''}`}
                                        onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
                                    >
                                        <span className="flag-icon flag-icon-en"></span>
                                    </div>
                                </div>
                            )}

                            <div className='languages'>
                                <div className="language-dropdown">
                                    <div className="selected-language" onClick={this.toggleLanguageList}>
                                        <span className={`flag-icon ${language === LANGUAGES.VI ? 'flag-icon-vi' : 'flag-icon-en'}`}></span>
                                        <i className="fas fa-chevron-down"></i>
                                    </div>
                                    {this.state.showLanguageList && (
                                        <div className={`language-list ${darkMode ? 'dark-mode' : ''}`}>
                                            <div
                                                className={`language-item ${language === LANGUAGES.VI ? 'active' : ''}`}
                                                onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
                                            >
                                                <span className="flag-icon flag-icon-vi"></span>
                                            </div>
                                            <div
                                                className={`language-item ${language === LANGUAGES.EN ? 'active' : ''}`}
                                                onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
                                            >
                                                <span className="flag-icon flag-icon-en"></span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`btn-dark-mode ${this.props.darkMode ? 'dark-mode' : ''}`}
                                    onClick={this.toggleDarkMode}
                                    title='Toggle Dark Mode'
                                >
                                    <i className={this.props.darkMode === true ? 'fas fa-moon' : 'fas fa-sun'}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.isShowBanner === true &&
                    <Slider {...settings}>
                        <div className='home-header-banner'>
                            <div className='content-up'>
                                <div className='title1'><FormattedMessage id="banner.title1" /></div>
                                <div className='title2'><FormattedMessage id="banner.title2" /></div>
                                <div className='search' >
                                    <i class="fas fa-search"></i>
                                    <input type='text'
                                        placeholder={this.props.intl.formatMessage({ id: "patient.home-search.search" })}
                                        onClick={() => this.handleClickSearch()}
                                    />
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
                                            <i className='fa-tooth'><FaTooth /></i>
                                        </div>
                                        <div className='child-text'><FormattedMessage id="banner.child5" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                }
            </React.Fragment >
        );
    }

}

// Connect state redux to react
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        darkMode: state.darkMode.isDarkMode,
    };
};

// Fire event redux
const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (laguage) => dispatch(changeLanguageApp(laguage)),
        toggleDarkMode: () => dispatch(actions.toggleDarkMode()), // Dispatch action để thay đổi dark mode

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader)));

