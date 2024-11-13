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
import { LANGUAGES } from '../../../utils'
import image1 from '../../../assets/images/medical-facility/cs1.jpg'
import './DetailClinic.scss';
import { toast } from 'react-toastify';

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
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
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
            try {
                const res = await getAllDetailClinicById(id);
                if (res && res.errCode === 0) {
                    const data = res.data;
                    const arrDoctorId = data?.doctorClinic?.map(item => item.doctorId) || [];
                    this.setState({
                        dataDetailClinic: res.data,
                        arrDoctorId: arrDoctorId,
                    });
                } else {
                    toast.error('Không thể tải dữ liệu phòng khám')
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phòng khám:", error);
                toast.error('Lỗi khi lấy dữ liệu phòng khám')
            }
        }
    };


    render() {
        const { arrDoctorId, dataDetailClinic, activeIndex, hideMenu } = this.state;
        let { language } = this.props;
        const menuItems = [
            { label: <FormattedMessage id="patient.detail-clinic.introduction" />, target: 'introduction' },
            { label: <FormattedMessage id="patient.detail-clinic.doctor" />, target: 'doctors' },
            { label: <FormattedMessage id="patient.detail-clinic.proStrength" />, target: 'proStrength' },
            { label: <FormattedMessage id="patient.detail-clinic.equipment" />, target: 'equipment' }
        ];
        let imageBase64;
        if (dataDetailClinic.image) {
            imageBase64 = new Buffer.from(dataDetailClinic.image, 'base64').toString('binary');
        }
        return (
            <div className='detail-clinic-container'>
                <HomeHeader />
                <div className='background-home-clinic'>
                    <div
                        className="clinic-image"
                        style={{
                            backgroundImage: `url(${dataDetailClinic.image ? imageBase64 : image1})`
                        }}
                    >
                    </div>
                </div>
                <div className='detail-clinic-body'>
                    <div className='clinic-info'>
                        <div className='clinic-header'>
                            <div className='clinic-name-title'>
                                {language === LANGUAGES.VI ? dataDetailClinic.clinicData?.valueVi : dataDetailClinic.clinicData?.valueEn}
                            </div>
                            <div className='clinic-address'>
                                {language === LANGUAGES.VI ? dataDetailClinic.address : dataDetailClinic.addressEn}
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
                        <div className={`clinic-menu-bar ${hideMenu ? 'hide' : ''}`} >
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
                        {language === LANGUAGES.VI
                            ? dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.introductionHTML }}></div>
                            )
                            : dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.introductionHTMLEn }}></div>
                            )
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
                    {language === LANGUAGES.VI
                        ? dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.proStrengthHTML }}></div>
                        )
                        : dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.proStrengthHTMLEn }}></div>
                        )
                    }
                </div>

                <div className='equipment-clinic' id='equipment'>
                    {language === LANGUAGES.VI
                        ? dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.equipmentHTML }}></div>
                        )
                        : dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.equipmentHTMLEn }}></div>
                        )
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

