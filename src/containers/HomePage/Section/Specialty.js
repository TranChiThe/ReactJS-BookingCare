import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../../services/userService';
import { dateFilter } from 'react-bootstrap-table2-filter';
import './Specialty.scss'
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';


class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSpecialty: [],
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : [],
            })
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.id}`)
        }
    }

    render() {
        let { dataSpecialty } = this.state;
        let { language } = this.props;
        return (
            <div className='section-section section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.specialty-popular"></FormattedMessage></span>
                        <button className='btn-section'><FormattedMessage id="homepage.more-info"></FormattedMessage></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            {dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div className="section-customize specialty-child" key={index}>
                                            <div className='customize-border'>
                                                <div className='bg-img section-specialty'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                    onClick={() => this.handleViewDetailSpecialty(item)}
                                                >

                                                </div>
                                                <div className='specialty-name'>{language === LANGUAGES.VI ? item.nameVi : item.nameEn}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div >
            </div >
        );
    }

}

// Connect state redux to react
const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

// Fire event redux
const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
