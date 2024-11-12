import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage, injectIntl } from "react-intl";
import * as actions from "../../../store/actions";
import { getDetailInForDoctor, doctorSearch } from "../../../services/userService";
import AllDoctors from "../Doctor/AllDoctors";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import Pagination from "../../../components/Pagination/Pagination";
import "./SearchBar.scss";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            suggestions: [],
            listDoctorFromParent: [],
            listClinic: [],
            listSpecialty: [],
            selectedClinic: "",
            selectedSpecialty: "",
            doctorId: "",
            clinicId: "",
            specialtyId: "",
            currentPage: 1,
            totalPages: 1,
            limit: 5,
        };
    }

    async componentDidMount() {
        this.props.getDetailInfoDoctor();
        this.props.getAllRequiredDoctorInfo();
        this.doctorSearch(this.state.searchTerm, '', '', this.state.currentPage);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let { resSpecialty } = this.props.allRequiredDoctorInfo;
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, "SPECIALTY");
            this.setState({
                listSpecialty: dataSelectSpecialty,
            });
        }

        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resClinic, resSpecialty } = this.props.allRequiredDoctorInfo;
            const dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, "SPECIALTY");
            const dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");
            if (
                dataSelectSpecialty !== this.state.listSpecialty ||
                dataSelectClinic !== this.state.listClinic
            ) {
                this.setState({
                    listSpecialty: dataSelectSpecialty,
                    listClinic: dataSelectClinic,
                });
            }
        }

        if (prevState.searchTerm !== this.state.searchTerm) {
            let specialty = this.state.selectedSpecialty
                ? this.state.selectedSpecialty.value
                : "";
            let clinic = this.state.selectedClinic
                ? this.state.selectedClinic.value
                : "";
            this.doctorSearch(this.state.searchTerm, specialty, clinic);
        }
        if (prevState.selectedSpecialty !== this.state.selectedSpecialty) {
            let specialty = this.state.selectedSpecialty
                ? this.state.selectedSpecialty.value
                : "";
            let clinic = this.state.selectedClinic
                ? this.state.selectedClinic.value
                : "";
            this.doctorSearch(this.state.searchTerm, specialty, clinic);
        }
        if (prevState.selectedClinic !== this.state.selectedClinic) {
            let specialty = this.state.selectedSpecialty
                ? this.state.selectedSpecialty.value
                : "";
            let clinic = this.state.selectedClinic
                ? this.state.selectedClinic.value
                : "";
            this.doctorSearch(this.state.searchTerm, specialty, clinic);
        }
    }

    handleKeyPress = (event) => {
        let { searchTerm, selectedSpecialty, selectedClinic } = this.state;
        if (event.key === "Enter") {
            this.doctorSearch(searchTerm, selectedSpecialty, selectedClinic);
        }
    };

    handleChange = async (event) => {
        let value = event.target.value;
        this.setState({ searchTerm: value });
        let { language } = this.state;
        let arrDoctor = this.state.listDoctorFromParent;
        if (value) {
            let dataDoctor = arrDoctor && arrDoctor.length > 0 ? arrDoctor : [];
            const filteredSuggestions = dataDoctor.filter((doctor) => {
                let nameVi = `${doctor.lastName} ${doctor.firstName}`;
                let nameEn = `${doctor.firstName} ${doctor.lastName}`;
                let fullName = language === LANGUAGES.VI ? nameVi : nameEn;
                let matchesName = fullName.toLowerCase().includes(value.toLowerCase());
                return matchesName;
            });

            this.setState({ suggestions: filteredSuggestions });
            let doctor_Info = value ? this.state.searchTerm : "";
            let specialty = this.state.selectedSpecialty
                ? this.state.selectedSpecialty.value
                : "";
            let clinic = this.state.selectedClinic
                ? this.state.selectedClinic.value
                : "";
            this.doctorSearch(doctor_Info, specialty, clinic);
        } else {
            this.setState({ suggestions: [] });
        }
    };

    handleChangeSelect = async (selectedOptions) => {
        this.setState({ selectedOptions });
        let { listSpecialty, listClinic } = this.state;
        let response = await getDetailInForDoctor(selectedOptions.value);
        if (response && response.data) {
            let specialtyId,
                clinicId,
                selectedSpecialty = "",
                selectedClinic = "";
            if (response.data.Doctor_Infor) {
                // get id value
                specialtyId = response.data.Doctor_Infor.specialtyId;
                clinicId = response.data.Doctor_Infor.clinicId;

                // Find the value in the selection list
                selectedSpecialty = listSpecialty.find((item) => {
                    return item && item.value === specialtyId;
                });
                selectedClinic = listClinic.find((item) => {
                    return item && item.value === clinicId;
                });
            }
            this.setState({
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
            });
        } else {
            this.setState({
                selectedSpecialty: "",
                selectedClinic: "",
            });
        }
    };

    handleSuggestionClick = async (suggestion) => {
        let nameEn = `${suggestion.firstName} ${suggestion.lastName}`;
        let nameVi = `${suggestion.lastName} ${suggestion.firstName}`;
        this.setState({
            searchTerm: this.props.language === LANGUAGES.VI ? nameVi : nameEn,
            suggestions: [],
        });
        let doctor_Info = this.props.language === LANGUAGES.VI ? nameVi : nameEn;
        let specialty = this.state.selectedSpecialty
            ? this.state.selectedSpecialty.value
            : "";
        let clinic = this.state.selectedClinic
            ? this.state.selectedClinic.value
            : "";
        this.doctorSearch(doctor_Info, specialty, clinic);
    };

    highlightMatchingText = (text, searchTerm) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: "yellow" }}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "SPECIALTY") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.specialtyData.valueVi}`;
                    let labelEn = `${item.specialtyData.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.name;
                    result.push(object);
                });
            }
            if (type === "CLINIC") {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
            }
        }
        return result;
    };

    handleOnchangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        });
    };

    doctorSearch = async (searchTerm, specialtyId, clinicId, page) => {
        const res = await doctorSearch(searchTerm, specialtyId, clinicId, page, this.state.limit);
        if (res && res.errCode === 0) {
            this.setState({
                listDoctorFromParent: res.data,
                totalPages: res.totalPages,
                currentPage: res.currentPage,
            });
        }
    };

    handlePageChange = async (pageNumber) => {
        this.setState({ currentPage: pageNumber }, async () => {
            console.log(`Fetching doctors for page: ${pageNumber}`);
            const { searchTerm, selectedSpecialty, selectedClinic, limit } = this.state;

            const res = await doctorSearch(
                searchTerm,
                selectedSpecialty?.value || '',
                selectedClinic?.value || '',
                pageNumber,
                limit
            );

            if (res && res.errCode === 0) {
                this.setState({
                    listDoctorFromParent: res.data,
                    totalPages: res.totalPages,
                    currentPage: res.currentPage,
                });
            } else {
                console.error(res.errMessage);
            }
        });
    };

    render() {
        const { searchTerm, suggestions, listSpecialty, listClinic } = this.state;
        console.log("check state: ", this.state);
        return (
            <React.Fragment>
                <HomeHeader />
                <div className="doctor-header">
                    <i class="fas fa-home home-specialty"></i>
                    / <FormattedMessage id="patient.see-more-doctors.title" />
                </div>
                <div className="search-container">
                    <div className="selected-options">
                        <div className=" select-specialty">
                            <Select
                                options={listSpecialty}
                                value={this.state.selectedSpecialty}
                                onChange={this.handleOnchangeSelectDoctorInfo}
                                placeholder={
                                    <FormattedMessage id="patient.doctor-search.specialty" />
                                }
                                isClearable
                                name="selectedSpecialty"
                            />
                        </div>
                        <div className=" select-clinic">
                            <Select
                                options={listClinic}
                                value={this.state.selectedClinic}
                                onChange={this.handleOnchangeSelectDoctorInfo}
                                placeholder={
                                    <FormattedMessage id="patient.doctor-search.clinic" />
                                }
                                isClearable
                                name="selectedClinic"
                            />
                        </div>
                    </div>
                    <div className=" search-item">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={this.handleChange}
                            placeholder={this.props.intl.formatMessage({
                                id: "patient.doctor-search.doctor",
                            })}
                            onKeyPress={this.handleKeyPress}
                        />
                    </div>

                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map((doctor, index) => {
                                let nameVi = `${doctor.lastName} ${doctor.firstName}`;
                                let nameEn = `${doctor.firstName} ${doctor.lastName}`;
                                return (
                                    <li
                                        key={index}
                                        onClick={() => this.handleSuggestionClick(doctor)}
                                    >
                                        <div className="doctor-info">
                                            <span className="doctor-name">
                                                {this.highlightMatchingText(
                                                    this.props.language === LANGUAGES.VI
                                                        ? nameVi
                                                        : nameEn,
                                                    searchTerm
                                                )}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <AllDoctors arrDoctorFromParent={this.state.listDoctorFromParent} />
                    <Pagination
                        currentPage={this.state.currentPage}
                        totalPages={this.state.totalPages}
                        onPageChange={this.handlePageChange}
                    />
                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        specialtyData: state.admin.specialties,
        detailDoctor: state.admin.detailDoctor,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSpecialtyStart: () => dispatch(actions.fetchSpecialtyStart()),
        getAllRequiredDoctorInfo: () => dispatch(actions.fetchAllRequiredDoctorStart()),
        getDetailInfoDoctor: (data) => dispatch(actions.fetchDetailInforDoctorStart(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SearchBar));
