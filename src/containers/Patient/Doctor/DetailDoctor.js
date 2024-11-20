import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import { getDetailInForDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import HomeFooter from '../../HomePage/HomeFooter';
import DoctorExtraInfo from './DoctorExtraInfo';
import Comment from '../../System/Doctor/Comment/Comment'
import './DetailDoctor.scss';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: this.props.match?.params?.id || -1,
        };
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        this.fetchDoctorDetail();
    }

    async componentDidUpdate(prevProps) {
        const { id: prevId } = prevProps.match.params;
        const { id: currentId } = this.props.match.params;

        if (prevId !== currentId) {
            this.setState({ currentDoctorId: currentId }, this.fetchDoctorDetail);
        }
    }

    fetchDoctorDetail = async () => {
        const { currentDoctorId } = this.state;
        if (currentDoctorId) {
            const res = await getDetailInForDoctor(currentDoctorId);
            if (res && res.errCode === 0) {
                this.setState({ detailDoctor: res.data });
            }
        }
    };

    render() {
        const { detailDoctor } = this.state;
        const { language } = this.props;

        const nameVi = detailDoctor.positionData
            ? `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`
            : '';
        const nameEn = detailDoctor.positionData
            ? `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`
            : '';
        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div
                            className='content-left'
                            style={{ backgroundImage: `url(${detailDoctor.image || ''})` }}
                        />
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor.Doctor_Infor?.description && (
                                    <span>{language === LANGUAGES.VI ?
                                        detailDoctor.Doctor_Infor.description :
                                        detailDoctor.Doctor_Infor.descriptionEn}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfo doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                    </div>
                    <div className='detail-infor-doctor'>
                        {language === LANGUAGES.VI
                            ? detailDoctor.Doctor_Infor?.contentHTML && (
                                <div dangerouslySetInnerHTML={{ __html: detailDoctor.Doctor_Infor.contentHTML }} />
                            )
                            : detailDoctor.Doctor_Infor?.contentHTMLEn && (
                                <div dangerouslySetInnerHTML={{ __html: detailDoctor.Doctor_Infor.contentHTMLEn }} />
                            )}
                    </div>

                    <div className='comment-doctor'>
                        <Comment
                            doctorId={this.props.match?.params?.id}
                        />
                    </div>
                    <HomeFooter />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(DetailDoctor);
