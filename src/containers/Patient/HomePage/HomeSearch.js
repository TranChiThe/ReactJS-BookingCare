import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import { getAllCodeService, getHomeSearch } from '../../../services/userService'
import SpecialtyInfo from '../Specialty/SpecialtyInfo';
import './HomeSearch.scss'

class HomeSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listFilterData: [],
            searchTerm: '',
            filterOptions: [],
            selectedFilter: '',
        }
    }

    async componentDidMount() {
        await this.loadFilterOptions();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            this.loadFilterOptions();
        }
    }

    loadFilterOptions = async () => {
        try {
            let res = await getAllCodeService("FILTER");
            if (res && res.errCode === 0) {
                const filterOptions = this.buildDataInputSelect(res.data);
                let selectedFilter = filterOptions.length > 0 ? filterOptions[0] : null;
                this.setState({ filterOptions, selectedFilter }, () => {
                    // Gọi tìm kiếm ngay sau khi đặt giá trị mặc định
                    this.getHomeSearch();
                });
            }
        } catch (error) {
            console.error("Failed to load filter options", error);
        }
    }

    handleFilterChange = (selectedFilterOption) => {
        this.setState({ selectedFilter: selectedFilterOption }, () => {
            this.getHomeSearch();
        });
    }

    handleInputChange = (event) => {
        let value = event.target.value;
        this.setState({ searchTerm: value }, () => {
            this.getHomeSearch();
        });
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.forEach((item) => {
                let object = {};
                let labelVi = `${item.valueVi}`;
                let labelEn = `${item.valueEn}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    }

    getHomeSearch = async () => {
        const { selectedFilter, searchTerm } = this.state;
        try {
            let res = await getHomeSearch(selectedFilter?.value || '', searchTerm || '');
            if (res && res.errCode === 0) {
                this.setState({ listFilterData: res.data });
            }
        } catch (error) {
            console.error("Search failed", error);
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.name}`)
        }
    }

    handleViewDetailDoctor(doctor) {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }

    render() {
        let { listFilterData } = this.state
        let { language } = this.props;
        console.log('check state: ', listFilterData)
        return (
            <>
                <HomeHeader />
                <div className='home-container'>
                    <div className="search-container">
                        <div className="search-box">
                            <Select
                                className="filter"
                                value={this.state.selectedFilter}
                                onChange={this.handleFilterChange}
                                options={this.state.filterOptions}
                                placeholder="Select filter..."
                            />
                            <input
                                type="text"
                                className="search-input"
                                value={this.state.searchTerm}
                                onChange={this.handleInputChange}
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    <div className="result-container">
                        <div className="column">
                            <h2>
                                <FormattedMessage id="patient.home-search.medical-facility" />
                            </h2>
                            {listFilterData.dataClinic && listFilterData.dataClinic.length > 0 ? (
                                listFilterData.dataClinic.map((clinic, index) => {
                                    let imageBase64 = '';
                                    let clinicVi = clinic.clinicData.valueVi
                                    let clinicEn = clinic.clinicData.valueEn;
                                    if (clinic.image) {
                                        imageBase64 = new Buffer.from(clinic.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <div key={index} className="item">
                                            <div className='information'
                                                onClick={() => this.handleViewDetailClinic(clinic)}
                                            >
                                                <div className='image'
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                ></div>
                                                <div>{language === LANGUAGES.VI ? clinicVi : clinicEn}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div>
                                    <FormattedMessage id="patient.home-search.none-facility" />
                                </div>
                            )}
                        </div>

                        <div className="column">
                            <h2>
                                <FormattedMessage id="patient.home-search.specialty" />
                            </h2>
                            {listFilterData.dataSpecialty && listFilterData.dataSpecialty.length > 0 ? (
                                listFilterData.dataSpecialty.map((specialty, index) => {
                                    let imageBase64 = '';
                                    if (specialty.image) {
                                        imageBase64 = new Buffer.from(specialty.image, 'base64').toString('binary');
                                    }
                                    let specialtyVi = specialty.specialtyData.valueVi
                                    let specialtyEn = specialty.specialtyData.valueEn;
                                    return (
                                        <div key={index} className="item">
                                            <div className='information'
                                                onClick={() => this.handleViewDetailSpecialty(specialty)}
                                            >
                                                <div className='image'
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                ></div>
                                                <div>{language === LANGUAGES.VI ? specialtyVi : specialtyEn}</div>
                                            </div>

                                        </div>
                                    )
                                })
                            ) : (
                                <div>
                                    <FormattedMessage id="patient.home-search.none-specialty" />
                                </div>
                            )}
                        </div>

                        <div className="column">
                            <h2>
                                <FormattedMessage id="patient.home-search.doctor" />
                            </h2>
                            {listFilterData.dataDoctor && listFilterData.dataDoctor.length > 0 ? (
                                listFilterData.dataDoctor.map((doctor, index) => {
                                    let imageBase64 = '';
                                    if (doctor.image) {
                                        imageBase64 = new Buffer.from(doctor.image, 'base64').toString('binary');
                                    }
                                    let nameVi = `${doctor.lastName} ${doctor.firstName}`
                                    let nameEn = `${doctor.firstName} ${doctor.lastName}`
                                    let positionVi = `${doctor.positionData ? doctor.positionData.valueVi : ''}`
                                    let positionEn = `${doctor.positionData ? doctor.positionData.valueEn : ''}`
                                    return (
                                        <div key={index} className="item">
                                            <div className='information'
                                                onClick={() => this.handleViewDetailDoctor(doctor)}
                                            >
                                                <div className='image'
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                ></div>
                                                <div>{language === LANGUAGES.VI ? positionVi : positionEn},&nbsp;
                                                    {language === LANGUAGES.VI ? nameVi : nameEn}
                                                    <br></br>
                                                    <SpecialtyInfo specialtyIdFromParent={doctor.Doctor_Infor.specialtyId} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div>
                                    <FormattedMessage id="patient.home-search.none-doctor" />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                <HomeFooter />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeSearch);
