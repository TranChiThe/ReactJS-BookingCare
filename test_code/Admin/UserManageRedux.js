// import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
// import './UserManageRedux.scss';
// import * as actions from '../../../store/actions'
// import UserEditModalRedux from './UserEditModalRedux';


// class UserManage extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             userRedux: [],
//             userEdit: ''
//         }
//     }

//     async componentDidMount() {
//         this.props.fetchUserRedux();
//     }

//     componentDidUpdate(prevProps, prevState, snapshot) {
//         if (prevProps.listUsers !== this.props.listUsers) {
//             this.setState({
//                 userRedux: this.props.listUsers,
//             })
//         }
//     }

//     handUserDelete = (userId) => {
//         this.props.deleteUser(userId);
//     }

//     handleUserEdit = (user) => {
//         this.props.handleEditUserToggle();
//         this.setState({
//             userEdit: user
//         })
//         console.log('check user edit: ', this.state.userEdit);
//         console.log('check user: ', user);
//     }


//     render() {
//         let arrUsers = this.state.userRedux;
//         return (
//             <React.Fragment>
//                 <div className="users-container">
//                     <UserEditModalRedux
//                         currentUser={this.state.userEdit}
//                     />
//                     <table id="customers">
//                         <tbody>
//                             <tr>
//                                 <th>STT</th>
//                                 <th>Email</th>
//                                 <th>First Name</th>
//                                 <th>Last Name</th>
//                                 <th>Phone Number</th>
//                                 <th>Address</th>
//                                 <th>Gender</th>
//                                 <th>Actions</th>
//                             </tr>
//                             {arrUsers && arrUsers.length > 0 &&
//                                 arrUsers.map((item, index) => {
//                                     return (
//                                         <tr className="" key={index}>
//                                             <td>{index + 1}</td>
//                                             <td>{item.email}</td>
//                                             <td>{item.firstName}</td>
//                                             <td>{item.lastName}</td>
//                                             <td>{item.phoneNumber}</td>
//                                             <td>{item.address}</td>
//                                             <td>{item.gender}</td>
//                                             <td>
//                                                 <button className="btn-edit"
//                                                     onClick={() => this.handleUserEdit(item)}
//                                                 >
//                                                     <i className='fas fa-pencil-alt'></i>
//                                                 </button>
//                                                 <button className="btn-delete"
//                                                     onClick={() => this.handUserDelete(item.id)}
//                                                 >
//                                                     <i className='fas fa-trash'></i>
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     )
//                                 })
//                             }
//                         </tbody>
//                     </table>
//                 </div>
//             </React.Fragment>
//         );
//     }
// }

// const mapStateToProps = state => {
//     return {
//         listUsers: state.admin.users
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//         fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
//         deleteUser: (userId) => dispatch(actions.fetchDeleteUserStart(userId))
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
