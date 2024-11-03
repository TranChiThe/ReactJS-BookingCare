import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu, staffMenu } from './menuApp';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import './Header.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
            showLanguageList: false, // Trạng thái hiển thị danh sách ngôn ngữ
        };
    }

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
        this.setState({ showLanguageList: false }); // Đóng danh sách sau khi chọn ngôn ngữ
    }

    toggleDarkMode = () => {
        this.props.toggleDarkMode(!this.props.darkMode);
    }

    toggleLanguageList = () => {
        this.setState({ showLanguageList: !this.state.showLanguageList });
    }

    componentDidMount() {
        let menu = [];
        let { userInFo } = this.props;
        if (userInFo && !_.isEmpty(userInFo)) {
            let role = userInFo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
            if (role === USER_ROLE.STAFF) {
                menu = staffMenu;
            }
        }
        this.setState({
            menuApp: menu,
        });

        document.addEventListener('click', this.handleClickOutside, true);
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

    render() {
        const { processLogout, language, userInFo, darkMode } = this.props;
        return (
            <div className={`header-container ${this.props.darkMode ? 'dark-mode' : ''}`}>
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className='languages'>
                    <span className='welcome'>
                        <FormattedMessage id="homeheader.welcome" />
                        {userInFo && userInFo.firstName ? userInFo.firstName : ' '}!
                    </span>

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

                    <div
                        className={`btn btn-logout ${darkMode ? 'dark-mode' : ''}`}
                        onClick={processLogout}
                        title='Log out'
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        LOG OUT
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInFo: state.user.userInFo,
        language: state.app.language,
        darkMode: state.darkMode.isDarkMode,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
        toggleDarkMode: () => dispatch(actions.toggleDarkMode()), // Dispatch action để thay đổi dark mode
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
