import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { emitter } from '../../utils/emitter'
import { dateFilter } from 'react-bootstrap-table2-filter';
import Lightbox from 'react-image-lightbox';


class UserModalRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,
            arrCheck: {
                email: 'Email',
                password: 'Mật khẩu',
                firstName: 'Tên',
                lastName: 'Họ và tên lót',
                phoneNumber: 'Số điện thoại',
                address: 'Địa chỉ'
            },
        }
        // this.listenToEmitter();
    }

    // listenToEmitter() {
    //     emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
    //         this.setState({
    //             genderArr: [],
    //             positionArr: [],
    //             roleArr: [],
    //             previewImgURL: '',
    //             isOpen: false,
    //             arrCheck: {
    //                 email: 'Email',
    //                 password: 'Mật khẩu',
    //                 firstName: 'Tên',
    //                 lastName: 'Họ và tên lót',
    //                 phoneNumber: 'Số điện thoại',
    //                 address: 'Địa chỉ'
    //             }
    //         })
    //     })
    // }

    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleUserModal()
    }

    handleOnChangeInput = (event, id) => {
        // Get onchange value: event.target.value
        let coppyState = { ...this.state };
        coppyState[id] = event.target.value;
        this.setState({
            ...coppyState
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert(`Missing parameter: `, + arrInput[i])
                break;
            }
        }
        return isValid;
    }
    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            // call api create modal
            this.props.createNewUser(this.state);
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size='lg'
            >
                <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id="manage-user.add" /></ModalHeader>
                <ModalBody>
                    <div className='user-redux-container'>
                        <div className='user-redux-body'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-3 my-3'>
                                        <label><FormattedMessage id="manage-user.email" /></label>
                                        <input className='form-control' type='email'

                                        />
                                    </div>
                                    <div className='col-3 my-3'>
                                        <label><FormattedMessage id="manage-user.password" /></label>
                                        <input className='form-control' type='password'

                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-3'>
                                        <label><FormattedMessage id="manage-user.first-name" /></label>
                                        <input className='form-control' type='text'

                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id="manage-user.last-name" /></label>
                                        <input className='form-control' type='text'

                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-3'>
                                        <label><FormattedMessage id="manage-user.phone-number" /></label>
                                        <input className='form-control' type='number' min={0}

                                        />
                                    </div>
                                    <div className='col-6'>
                                        <label><FormattedMessage id="manage-user.address" /></label>
                                        <input className='form-control' type='text'

                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-3 mt-3'>
                                        <label><FormattedMessage id="manage-user.gender" /></label>
                                        <select className="form-control"
                                            onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                        >

                                        </select>
                                    </div>
                                    <div className='col-3 mt-3'>
                                        <label><FormattedMessage id="manage-user.position" /></label>
                                        <select className="form-control"
                                            onChange={(event) => { this.onChangeInput(event, 'position') }}
                                        >

                                        </select>
                                    </div>
                                    <div className='col-3 mt-3'>
                                        <label><FormattedMessage id="manage-user.role" /></label>
                                        <select className="form-control"
                                            onChange={(event) => { this.onChangeInput(event, 'role') }}
                                        >

                                        </select>
                                    </div>
                                    <div className='col-3 mt-3'>
                                        <label><FormattedMessage id="manage-user.avatar" /></label>
                                        <div className='preview-img-container'>
                                            <input id='priewImg' type='file' hidden
                                                onChange={(event) => this.handleOnChangeImage(event)}
                                            />
                                            <label className='label-upload' htmlFor='priewImg'>
                                                Tải ảnh
                                                <i className='fas fa-upload'></i>
                                            </label>
                                            <div className='preview-image'
                                                style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                                onClick={() => this.openPreviewImage()}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 mt-3'>
                                        <button className='btn btn-primary'
                                            onClick={() => this.handleSaveUser()}
                                        >
                                            <FormattedMessage id="manage-user.save" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {this.state.isOpen === true &&
                                <Lightbox
                                    mainSrc={this.state.previewImgURL}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                                />
                            }
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                        className="px-3"
                        onClick={() => { this.handleAddNewUser() }}>
                        Add new
                    </Button>{' '}
                    <Button color="secondary" className="px-3" onClick={() => { this.toggle() }}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserModalRedux);




