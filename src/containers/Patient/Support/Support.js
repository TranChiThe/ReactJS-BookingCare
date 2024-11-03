import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import ListAppointment from "./ListAppointment";
import "./Support.scss";

class DefaultClass extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() { }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
    }
  }

  render() {
    return (
      <>
        <HomeHeader />
        <div className="patient-support-container">
          <div className="support-tile">Quản lý lịch khám bệnh</div>
          <div className="support-body-container">
            <div className="search-container">
              <div className="search-item-support">
                <input
                  className="form-control"
                  placeholder="Nhập mã hồ sơ..."
                />
              </div>
            </div>
            <div className="">
              <ListAppointment />
            </div>
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
