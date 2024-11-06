import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./AppointmentManagement.scss"

class AppointmentManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            selectedStatus: 'confirmed', // Default status to filter
        };
    }

    async componentDidMount() {
        await this.fetchAppointments();
    }

    fetchAppointments = async () => {
        try {
            const res = await this.props.fetchAppointments(); // Adjust according to your API action
            if (res && res.errCode === 0) {
                this.setState({ appointments: res.data });
            } else {
                console.error('Error fetching appointments:', res.errMessage);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    handleStatusChange = (status) => {
        this.setState({ activeStatus: status });
    };

    render() {
        const { activeStatus, appointments } = this.state;

        return (
            <div className="appointment-doctor-list-container">
                <div className='appoitment-management-title'>
                    Quản lý lịch khám bệnh
                </div>
                <div className="status-buttons">
                    <button
                        className={`status-button ${activeStatus === 'Đã Xác Nhận' ? 'active' : ''}`}
                        onClick={() => this.handleStatusChange('Đã Xác Nhận')}
                    >
                        Đã Xác Nhận
                    </button>
                    <button
                        className={`status-button ${activeStatus === 'Đang Khám' ? 'active' : ''}`}
                        onClick={() => this.handleStatusChange('Đang Khám')}
                    >
                        Đang Khám
                    </button>
                    <button
                        className={`status-button ${activeStatus === 'Đã Khám Xong' ? 'active' : ''}`}
                        onClick={() => this.handleStatusChange('Đã Khám Xong')}
                    >
                        Đã Khám Xong
                    </button>
                    <button
                        className={`status-button ${activeStatus === 'Đã Hủy' ? 'active' : ''}`}
                        onClick={() => this.handleStatusChange('Đã Hủy')}
                    >
                        Đã Hủy
                    </button>
                </div>
                <div className="appointment-doctor-list-body">
                    <div className="appointment-manage-table">
                        <div className="appointment-container">
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Email</th>
                                        <th>Vị Trí</th>
                                        <th>Tên Đầy Đủ</th>
                                        <th>Số Điện Thoại</th>
                                        <th>Địa Chỉ</th>
                                        <th>Giới Tính</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments
                                        .filter(appointment => appointment.status === activeStatus) // Filter appointments by active status
                                        .map((appointment, index) => (
                                            <tr key={appointment.id}>
                                                <td>{index + 1}</td>
                                                <td>{appointment.email}</td>
                                                <td>{appointment.location}</td>
                                                <td>{appointment.fullName}</td>
                                                <td>{appointment.phone}</td>
                                                <td>{appointment.address}</td>
                                                <td>{appointment.gender}</td>
                                                <td>
                                                    {/* Actions like edit and delete buttons can go here */}
                                                    <button className="btn-edit">Edit</button>
                                                    <button className="btn-delete">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentManagement);
