import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import './MedicalFacility.scss'


class MedicalFacility extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataClinics: [],
        }
    }

    async componentDidMount() {
        let response = await getAllClinic()
        if (response && response.errCode === 0) {
            this.setState({
                dataClinics: response.data ? response.data : []
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {
        let { dataClinics } = this.state;
        return (
            <div className='section-section section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="medicalFacility.medical"></FormattedMessage></span>
                        <button className='btn-section'><FormattedMessage id="medicalFacility.see-more"></FormattedMessage></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div className="section-customize clinic-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div className='customize-border'>
                                                <div className='bg-img-clinic section-medical-facility'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                >
                                                </div>
                                                <div className='clinic-name'>{item.name}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }


                        </Slider>
                    </div>
                </div>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
