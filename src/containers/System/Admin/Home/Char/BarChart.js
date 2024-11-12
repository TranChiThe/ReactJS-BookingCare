import React, { Component, createRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

Chart.register(...registerables);

class MixedChart extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = createRef();
        this.mixedChart = null;
    }

    componentDidMount() {
        this.initializeChart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data || prevProps.selectedFilter !== this.props.selectedFilter) {
            this.initializeChart();
        }
        if (prevProps.language !== this.props.language) {
            this.initializeChart()
        }
    }

    componentWillUnmount() {
        if (this.mixedChart) {
            this.mixedChart.destroy();
        }
    }

    initializeChart() {
        const { data, selectedFilter } = this.props;
        const ctx = this.canvasRef.current.getContext('2d');
        const patient = this.props.intl.formatMessage({ id: 'admin.staff.totalPatient' });
        const appointment = this.props.intl.formatMessage({ id: 'admin.staff.totalAppointment' });

        const chartData = {

            labels: [],
            datasets: [
                {
                    label: patient,
                    data: [],
                    order: 2,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    maxBarThickness: 40,
                },
                {
                    label: appointment,
                    data: [],
                    type: 'line',
                    order: 1,
                    fill: false,
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1,
                    borderWidth: 0.75,
                },
            ],
        };

        if (data) {
            const currentYear = new Date().getFullYear();

            if (selectedFilter === 'weekly') {
                let weeksData = data.weeklyCounts ? data.weeklyCounts : []
                chartData.labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'];
                chartData.datasets[0].data = weeksData;
                chartData.datasets[1].data = weeksData.map((value) => value * 1.02);
            }
            else if (selectedFilter === 'monthly') {
                let monthsData = data.monthlyCounts ? data.monthlyCounts : []
                chartData.labels = [
                    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
                    'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10',
                    'Tháng 11', 'Tháng 12'
                ];
                chartData.datasets[0].data = monthsData;
                chartData.datasets[1].data = monthsData.map((value) => value * 1.02);
            }
            else if (selectedFilter === 'yearly') {
                let yearsData = data.yearlyCounts ? data.yearlyCounts : []
                chartData.labels = [
                    currentYear.toString(),
                    (currentYear + 1).toString(),
                    (currentYear + 2).toString(),
                    (currentYear + 3).toString(),
                    (currentYear + 4).toString()
                ];
                chartData.datasets[0].data = yearsData;
                chartData.datasets[1].data = yearsData.map((value) => value * 1.02);
            }
        } else {
            console.error('Dữ liệu không hợp lệ:', data);
        }

        const options = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
        };

        if (this.mixedChart) {
            this.mixedChart.destroy();
        }

        this.mixedChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: options,
        });
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} />
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        language: state.app.language,
        detailDoctor: state.admin.detailDoctor,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MixedChart));
