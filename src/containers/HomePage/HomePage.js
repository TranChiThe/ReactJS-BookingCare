import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility'
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About';
import HomeFooter from './HomeFooter';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './HomePage.scss'

class HomePage extends Component {

    render() {
        let setting = {
            dots: false,
            infinite: false,
            speed: 800,
            slidesToShow: 4,
            slidesToScroll: 2,
        };
        let setting2 = {
            dots: false,
            infinite: true,
            speed: 800,
            slidesToShow: 2,
            autoplay: true,
            autoplaySpeed: 3000,
            slidesToScroll: 1
        }
        return (
            <div>
                <HomeHeader
                    isShowBanner={true} />
                <Specialty
                    setting={setting} />
                <MedicalFacility
                    setting={setting} />
                <OutStandingDoctor
                    setting={setting} />
                <HandBook
                    setting={setting2} />
                {/* <About /> */}
                <HomeFooter />
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
