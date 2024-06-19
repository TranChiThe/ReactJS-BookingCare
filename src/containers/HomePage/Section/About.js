import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
// import { LANGUAGES } from '../../utils/constant';
// import { changeLanguageApp } from '../../store/actions/appActions';



class About extends Component {

    render() {
        return (
            <div className='section-section section-about'>
                <div className='section-about-header'>
                    Truyền thông nói về HealthCare
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400"
                            src="https://www.youtube.com/embed/OASGscJQXp0"
                            title="BookingCare: Hệ thống đặt khám trực tuyến" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>Hệ thống đặt lịch khám bệnh healthcare là một công cụ hiệu quả giúp quản lý và sắp xếp lịch hẹn khám bệnh một cách thông minh và tiện lợi.
                            Với sự tích hợp công nghệ, người dùng có thể dễ dàng truy cập vào hệ thống từ bất kỳ nơi đâu thông qua điện thoại di động hoặc máy tính,
                            tiết kiệm thời gian và công sức.
                            <br></br>
                            Hệ thống cung cấp cho bệnh nhân một giao diện thân thiện và dễ sử dụng,
                            cho phép họ xem lịch trình khám bệnh của mình,
                            chọn ngày và giờ phù hợp,
                            cũng như thay đổi hoặc hủy bỏ lịch hẹn khi cần thiết.
                            Đồng thời, các nhà quản lý bệnh viện và phòng khám cũng được hỗ trợ trong việc tổ chức lịch trình khám bệnh của các bác sĩ và nhân viên y tế một cách hiệu quả,
                            giúp giảm thiểu thời gian chờ đợi và tăng cường trải nghiệm của người dùng.
                        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
