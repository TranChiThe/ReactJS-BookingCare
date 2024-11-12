import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getAllDetailSpecialtyById } from '../../../services/userService'

class SpecialtyInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {},
        }
    }

    async componentDidMount() {
        if (this.props.specialtyIdFromParent) {
            let res = await getAllDetailSpecialtyById({
                name: this.props.specialtyIdFromParent,
                location: 'ALL'
            });
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
        if (prevProps.specialtyIdFromParent !== this.props.specialtyIdFromParent) {
            let res = await getAllDetailSpecialtyById({
                name: this.props.specialtyIdFromParent,
                location: 'ALL'
            });
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status,
        })
    }

    render() {
        let { isShowDetailInfo, extraInfo } = this.state;
        let { language } = this.props;
        let specialtyVi = extraInfo.specialtyData ? extraInfo.specialtyData.valueVi : '';
        let specialtyEn = extraInfo.specialtyData ? extraInfo.specialtyData.valueEn : '';
        return (
            <div>
                {extraInfo && extraInfo.specialtyData &&
                    language === LANGUAGES.VI ? specialtyVi : specialtyEn
                }
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyInfo);
