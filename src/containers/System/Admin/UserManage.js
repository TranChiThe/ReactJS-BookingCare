import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="users-container">
                <table id="customers">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>

                        <tr className="">
                            <td>{'item.email'}</td>
                            <td>{'item.firstName'}</td>
                            <td>{'item.lastName'}</td>
                            <td>{'item.address'}</td>
                            <td>
                                <button className="btn-edit"
                                >

                                </button>
                                <button className="btn-delete"

                                >
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
