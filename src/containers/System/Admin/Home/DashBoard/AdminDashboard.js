import React, { Component } from 'react';
import './AdminDashboard.scss';

class AdminDashboard extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="admin-dashboard">
                    <div className='admin-title'>
                        Admin Dashboard
                    </div>
                    <div className='dashboard-content'>
                        <div className="data-boxes">
                            <div className="data-box box-users">
                                <i className="fas fa-user-circle"></i>
                                <h2>Total Users</h2>
                                <p>1,200</p>
                            </div>
                            <div className="data-box box-doctors">
                                <i className="fas fa-user-md"></i>
                                <h2>Doctors</h2>
                                <p>150</p>
                            </div>
                            <div className="data-box box-appointments">
                                <i className="fas fa-calendar-check"></i>
                                <h2>Appointments</h2>
                                <p>3,200</p>
                            </div>
                            <div className="data-box box-feedback">
                                <i className="fas fa-comments"></i>
                                <h2>Feedback</h2>
                                <p>80</p>
                            </div>
                        </div>
                        <div className="chart-container">
                            <h2>Monthly Revenue</h2>
                            {/* Your chart component goes here */}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AdminDashboard;
