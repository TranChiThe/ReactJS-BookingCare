import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import { getAllDetailClinicById } from '../../../services/userService';
import _ from 'lodash';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import './DetailClinic.scss';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            activeIndex: '',
            hideMenu: false,
        };
    }

    async componentDidMount() {
        this.getDataClinic();
    }

    componentWillUnmount() {
    }

    handleClick = (index, targetId) => {
        this.setState({
            activeIndex: index,
            hideMenu: true
        });
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        if (targetId === 'introduction') {
            this.setState({
                hideMenu: false
            })
        }
    };

    getDataClinic = async () => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            const id = this.props.match.params.id;
            const res = await getAllDetailClinicById({ id });
            if (res && res.errCode === 0) {
                const data = res.data;
                const arrDoctorId = data?.doctorClinic?.map(item => item.doctorId) || [];
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    };

    render() {
        const { arrDoctorId, dataDetailClinic, activeIndex, hideMenu } = this.state;
        const menuItems = [
            { label: <FormattedMessage id="patient.detail-clinic.introduction" />, target: 'introduction' },
            { label: <FormattedMessage id="patient.detail-clinic.doctor" />, target: 'doctors' },
            { label: <FormattedMessage id="patient.detail-clinic.proStrength" />, target: 'proStrength' },
            { label: <FormattedMessage id="patient.detail-clinic.equipment" />, target: 'equipment' }
        ];
        console.log('check state:', this.state.dataDetailClinic)
        return (
            <div className='detail-clinic-container'>
                <HomeHeader />
                <div className='background-home-clinic'>
                    <div className='clinic-image'
                        style={{ backgroundImage: `url(${dataDetailClinic && dataDetailClinic.image ? dataDetailClinic.image : ''})` }}
                    >
                    </div>

                </div>
                <div className='detail-clinic-body'>
                    <div className='clinic-info'>
                        <div className='clinic-header'>
                            <div className='clinic-name-title'>
                                {dataDetailClinic.name}
                            </div>
                            <div className='clinic-address'>
                                {dataDetailClinic.address}
                            </div>
                        </div>
                        {hideMenu &&
                            <div className='right-side-menu'>
                                {menuItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={index === activeIndex ? 'menu-item active' : 'menu-item'}
                                        onClick={() => this.handleClick(index, item.target)}>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        }
                        <div className={`clinic-menu-bar ${hideMenu ? 'hide' : ''}`}>
                            <div className='clinic-menu'>
                                {menuItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={index === activeIndex ? 'active' : ''}
                                        onClick={() => this.handleClick(index, item.target)}
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='description-clinic' id='introduction'>
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.introductionHTML }}></div>
                        }
                    </div>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => (
                            <div className='each-doctor' key={index} id='doctors'>
                                <div className='clinic-content-left'>
                                    <div className='profile-doctor'>
                                        <ProfileDoctor
                                            doctorId={item}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        />
                                    </div>
                                </div>
                                <div className='clinic-content-right'>
                                    <div className='doctor-schedule'>
                                        <DoctorSchedule
                                            doctorIdFromParent={item}
                                        />
                                    </div>
                                    <div className='doctor-extra-info'>
                                        <DoctorExtraInfo
                                            doctorIdFromParent={item}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className='pro-strength-clinic' id='proStrength'>
                    {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                        <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.proStrengthHTML }}></div>
                    }
                </div>

                <div className='equipment-clinic' id='equipment'>
                    {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                        <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.equipmentHTML }}></div>
                    }
                </div>

                <HomeFooter />
            </div >
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);

