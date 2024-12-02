import React, { Component } from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS } from '../../../../utils';
import Pagination from '../../../../components/Pagination/Pagination';
import Select from 'react-select'
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig';
import { toast } from 'react-toastify';
import { getSystemCode, deleteSystemCode } from '../../../../services/userService'
import SystemModal from './SystemModal';
import './ManageSystemCode.scss'

class ManageSystemCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrCodes: [],
            currentPage: 1,
            totalPages: 1,
            limit: 10,
            isOpenModalCode: false,
            isEditModal: false,
            selectedItem: '',
        }
    }

    async componentDidMount() {
        await this.fetSystemCode()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    fetSystemCode = async () => {
        let { currentPage, limit } = this.state
        let res = await getSystemCode(currentPage, limit);
        if (res && res.errCode === 0) {
            this.setState({
                arrCodes: res.data,
                currentPage: res.pagination?.currentPage,
                totalPages: res.pagination?.totalPages,
            })
        }
    }

    toggleCodeModal = () => {
        this.setState({
            isOpenModalCode: !this.state.isOpenModalCode,
        })
    }

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage }, this.fetSystemCode);
    };

    handleAddNewCode = async () => {
        this.setState({
            isOpenModalCode: true,
            isEditModal: false,
            selectedItem: ''
        })
    }

    handleCodeEdit = (item) => {
        this.setState({
            isOpenModalCode: true,
            isEditModal: true,
            selectedItem: item,
        });
    }

    handleCodeDelete = async (item) => {
        let SwalConfig = createSwalConfig(this.props.intl);
        let result = await Swal.fire(SwalConfig.confirmDialog());
        if (result.isConfirmed) {
            let res = await deleteSystemCode(item.id);
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.system-code.textEditSuccess'))
                this.toggleCodeModal()
                this.props.fetSystemCode()
            }
            else if (res && res.errCode === 1) {
                toast.error(<FormattedMessage id='toast.missing' />)
            }
            else if (res && res.errCode === 2) {
                toast.error(<FormattedMessage id='notification.system-code.doNotExist' />)
            }
            else {
                Swal.fire(SwalConfig.errorNotification('notification.system-code.textEditFail'))
            }
        }
    }

    render() {
        let arrCodes = this.state.arrCodes;
        let { currentPage, totalPages } = this.state
        return (
            <React.Fragment>
                {
                    this.state.isOpenModalCode &&
                    <SystemModal
                        isOpen={this.state.isOpenModalCode}
                        toggleCodeModal={this.toggleCodeModal}
                        isEditModal={this.state.isEditModal}
                        item={this.state.selectedItem}
                        fetSystemCode={this.fetSystemCode}
                    />
                }
                <div className='code-redux-container'>
                    <div className='code-title'>
                        <FormattedMessage id="menu.admin.system-code" />
                    </div>
                    <div className='control-row btn-create'>
                        <button className='btn btn-primary px-2 mx-3'
                            onClick={() => this.handleAddNewCode()}
                        >
                            <i className="fas fa-plus px-1"></i>
                            <FormattedMessage id="system-code.add" />
                        </button>
                    </div>
                    <div className='code-redux-body'>
                        <div className='code-manage-table'>
                            <div className="codes-container">
                                <table id="customers">
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            <th><FormattedMessage id="system-code.keyMap" /></th>
                                            <th><FormattedMessage id="system-code.type" /></th>
                                            <th><FormattedMessage id="system-code.valueVi" /></th>
                                            <th><FormattedMessage id="system-code.valueEn" /></th>
                                            <th></th>
                                        </tr>
                                        {arrCodes && arrCodes.length > 0 &&
                                            arrCodes.map((item, index) => {
                                                return (
                                                    <tr className="" key={index}>
                                                        <td>{index + 1 + (this.state.currentPage - 1) * this.state.limit}</td>
                                                        <td >{item.keyMap}</td>
                                                        <td>{item.type}</td>
                                                        <td>{item.valueVi}</td>
                                                        <td>{item.valueEn}</td>
                                                        <td>
                                                            <button className="btn-edit"
                                                                onClick={() => this.handleCodeEdit(item)}
                                                            >
                                                                <i className='fas fa-pencil-alt'></i>
                                                            </button>
                                                            <button className="btn-delete"
                                                                onClick={() => { this.handleCodeDelete(item) }}
                                                                onSubmit={() => { this.confirmcodeDelete() }}
                                                            >
                                                                <i className='fas fa-trash'></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                />
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,


    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageSystemCode));
