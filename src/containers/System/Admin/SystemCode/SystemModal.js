import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as actions from '../../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../../utils';
import { toast } from 'react-toastify'
import _ from 'lodash';
import Swal from 'sweetalert2';
import createSwalConfig from '../../../../components/NotificationConfig/SwalConfig'
import { addSystemCode, editSystemCode } from '../../../../services/userService'


class SystemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyMap: '',
            type: '',
            valueEn: '',
            valueVi: '',
        };
    }

    async componentDidMount() {
        if (this.props.isEditModal && this.props.item) {
            const { keyMap, type, valueEn, valueVi } = this.props.item;
            this.setState({
                keyMap,
                type,
                valueEn,
                valueVi,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.isEditModal !== this.props.isEditModal && prevProps.item !== this.props.item) {
        //     const { keyMap, type, valueEn, valueVi } = this.props.item;
        //     this.setState({
        //         keyMap,
        //         type,
        //         valueEn,
        //         valueVi,
        //     });
        // }
    }

    toggle = () => {
        this.props.toggleCodeModal();
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleSaveCode = async () => {
        let SwalConfig = createSwalConfig(this.props.intl);
        let result = await Swal.fire(SwalConfig.confirmDialog());

        if (this.props.isEditModal) {
            if (result.isConfirmed) {
                let res = await editSystemCode({
                    keyMap: this.state.keyMap,
                    type: this.state.type,
                    valueVi: this.state.valueVi,
                    valueEn: this.state.valueEn
                })
                if (res && res.errCode === 0) {
                    Swal.fire(SwalConfig.successNotification('notification.system-code.textEditSuccess'))
                    this.toggle();
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
        } else {
            let res = await addSystemCode({
                keyMap: this.state.keyMap,
                type: this.state.type,
                valueVi: this.state.valueVi,
                valueEn: this.state.valueEn
            })
            if (res && res.errCode === 0) {
                Swal.fire(SwalConfig.successNotification('notification.system-code.textAddSuccess'))
                this.toggle();
                this.props.fetSystemCode()
            }
            else if (res && res.errCode === 1) {
                toast.error(<FormattedMessage id='toast.missing' />)
            }
            else if (res && res.errCode === 2) {
                toast.error(<FormattedMessage id='notification.system-code.already' />)
            }
            else {
                Swal.fire(SwalConfig.successNotification('notification.system-code.textAddFail'))
            }

        }
    }

    render() {
        let language = this.props.language;
        let { keyMap, type, valueEn, valueVi } = this.state;
        let { isEditModal, isOpen } = this.props;
        return (
            <div className='modal-container'>
                <Modal isOpen={isOpen} toggle={() => { this.toggle() }} className='modal-user-container' size='lg'>
                    <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id="manage-user.add" /></ModalHeader>
                    <ModalBody>
                        <div className='user-redux-container'>
                            <div className='user-redux-body'>
                                <div className='container'>
                                    <form>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="system-code.keyMap" /></label>
                                                    <input className='form-control' type='email'
                                                        value={keyMap}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'keyMap') }}
                                                        disabled={isEditModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="system-code.type" /></label>
                                                    <input className='form-control' type='text'
                                                        value={type}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'type') }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="system-code.valueVi" /></label>
                                                    <input className='form-control' type='text'
                                                        value={valueVi}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'valueVi') }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <label><FormattedMessage id="system-code.valueEn" /></label>
                                                    <input className='form-control' type='text'
                                                        value={valueEn}
                                                        onChange={(event) => { this.handleOnChangeInput(event, 'valueEn') }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                            className={this.props.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}
                            onClick={() => { this.handleSaveCode() }}>
                            {isEditModal ?
                                <FormattedMessage id="manage-user.save-change" /> :
                                <FormattedMessage id="system-code.add" />
                            }
                        </Button>
                        <Button color="secondary" className="px-3"
                            onClick={() => { this.toggle() }}>
                            <FormattedMessage id="manage-user.close" />
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
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
export default (connect(mapStateToProps, mapDispatchToProps)(injectIntl(SystemModal)));
