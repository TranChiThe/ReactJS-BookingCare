import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format'
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import { getAllSpecialty } from '../../../services/userService'
import { withRouter } from 'react-router';
import './AllSpecialty.scss'

class AllSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrSpecialty: [],
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                arrSpecialty: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.name}`)
        }
    }

    render() {
        let { arrSpecialty } = this.state
        return (
            <React.Fragment>
                <HomeHeader />
                <div className='specialty-container'>
                    <div className='specialty-header'>
                        <i class="fas fa-home home-specialty"></i>
                        / <FormattedMessage id='patient.see-more-specialty.title' />
                    </div>
                    <div className='specialty-body'>
                        {arrSpecialty && arrSpecialty.length > 0 &&
                            arrSpecialty.map((item, index) => {
                                return (
                                    <div className='specialty-item'
                                        onClick={() => this.handleViewDetailSpecialty(item)}
                                    >
                                        <div className='content-left'>
                                            <div className='image'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                            </div>
                                        </div>

                                        <div className='content-right'>
                                            {this.props.language === LANGUAGES.VI ? item.specialtyData.valueVi : item.specialtyData.valueEn}
                                        </div>
                                    </div>
                                )
                            })
                        }


                    </div>
                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialty));
