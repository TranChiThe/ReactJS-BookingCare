import React, { Component } from 'react';
import { getDoctorComment } from '../../../../services/userService'
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../../utils'
import Pagination from '../../../../components/Pagination/Pagination';
import './Comment.scss';
class DoctorComments extends Component {
    state = {
        comments: [],
        currentPage: '1',
        totalPages: '1',
    };

    componentDidMount() {
        this.fetchComments();
    }

    fetchComments = async () => {
        try {
            let { currentPage } = this.state
            let res = await getDoctorComment(this.props.doctorId, currentPage, 4);
            if (res && res.errCode === 0) {
                this.setState({
                    comments: res.data,
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                })
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    formatDateVi = (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    formatDateEn = (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage }, this.fetchComments);
    };

    // render() {
    //     const { comments, currentPage, totalPages } = this.state;
    //     let { language } = this.props;
    //     return (
    //         <div className="doctor-comments">
    //             <h2><FormattedMessage id='patient.comment.patient-comment' /></h2>
    //             {comments && comments.length > 0 ? (
    //                 <div className="comment-list">
    //                     {comments.map((comment, index) => {
    //                         let nameVi = `${comment.patientComment?.lastName} ${comment.patientComment?.firstName}`
    //                         let nameEn = `${comment.patientComment?.firstName} ${comment.patientComment?.lastName}`
    //                         return (
    //                             <div key={index} className="comment-item">
    //                                 <h4>
    //                                     {language === LANGUAGES.VI ? nameVi : nameEn}
    //                                 </h4>
    //                                 {language === LANGUAGES.VI && (
    //                                     <p className="comment-date">
    //                                         Ngày khám: {this.formatDateVi(comment.examinationDate)}
    //                                     </p>
    //                                 )}
    //                                 {language === LANGUAGES.EN && (
    //                                     <p className="comment-date">
    //                                         Examination date: {this.formatDateEn(comment.examinationDate)}
    //                                     </p>
    //                                 )}
    //                                 {language === LANGUAGES.VI &&
    //                                     <p className="comment-content">
    //                                         Nội dung: {comment.content}
    //                                     </p>
    //                                 }
    //                                 {language === LANGUAGES.EN &&
    //                                     <p className="comment-content">
    //                                         Content: {comment.content}
    //                                     </p>
    //                                 }
    //                             </div>
    //                         )
    //                     })}
    //                 </div>
    //             ) : (
    //                 <p>Chưa có bình luận nào.</p>
    //             )}
    //             <div className='comment-pagination'>
    //                 <Pagination
    //                     currentPage={currentPage}
    //                     totalPages={totalPages}
    //                     onPageChange={this.handlePageChange}
    //                 />
    //             </div>
    //         </div>
    //     );
    // }
    render() {
        const { comments, currentPage, totalPages } = this.state;
        let { language } = this.props;

        return (
            <div className="doctor-comments">
                <h2><FormattedMessage id='patient.comment.patient-comment' /></h2>
                {comments && comments.length > 0 ? (
                    <div className="comment-list">
                        <div className="comment-columns">
                            {comments.map((comment, index) => {
                                let nameVi = `${comment.patientComment?.lastName} ${comment.patientComment?.firstName}`;
                                let nameEn = `${comment.patientComment?.firstName} ${comment.patientComment?.lastName}`;
                                return (
                                    <div key={index} className="comment-item">
                                        <h4>
                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                        </h4>
                                        {language === LANGUAGES.VI && (
                                            <p className="comment-date">
                                                Ngày khám: {this.formatDateVi(comment.examinationDate)}
                                            </p>
                                        )}
                                        {language === LANGUAGES.EN && (
                                            <p className="comment-date">
                                                Examination date: {this.formatDateEn(comment.examinationDate)}
                                            </p>
                                        )}
                                        {language === LANGUAGES.VI &&
                                            <p className="comment-content">
                                                Nội dung: {comment.content}
                                            </p>
                                        }
                                        {language === LANGUAGES.EN &&
                                            <p className="comment-content">
                                                Content: {comment.content}
                                            </p>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p><FormattedMessage id='patient.comment.notComment' /></p>
                )}
                <div className='comment-pagination'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(DoctorComments);

