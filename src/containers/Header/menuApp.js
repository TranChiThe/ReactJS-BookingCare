export const adminMenu = [
    {
        // Quản lý người dùng
        name: 'menu.admin.user',
        menus: [
            {
                // Quản lý danh sách nhân viên
                name: 'menu.admin.manage-admin', link: '/system/user-admin'
            },
            {
                // Quản lý danh sách bác sĩ
                name: 'menu.admin.crud-redux', link: '/system/manage-user'
            },
            {
                // Quản lý thông tin bác sĩ
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },
            {
                // Quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
        ]
    },

    {
        // Quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },
        ]
    },
    {
        // Quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
        ]
    },
    {
        // Quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.schedule',
        menus: [
            {
                // Quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', link: '/doctor-manage/manage-schedule'
            },
        ],

    },
    {
        name: 'menu.doctor.patient',
        menus: [
            {
                // Quản lý lịch hẹn khám bệnh
                name: 'menu.doctor.manage-patient-appointment', link: '/doctor-manage/manage-appointment'
            },
            {
                // Quản lý lịch hẹn khám bệnh
                name: 'menu.doctor.manage-patient-record', link: '/doctor-manage/manage-record'
            }
        ]
    }

];


export const staffMenu = [
    {
        // Quản lý người dùng
        name: 'menu.admin.user',
        menus: [
            {
                // Quản lý danh sách bác sĩ
                name: 'menu.admin.crud-redux', link: '/staff-manage/manage-doctor'
            },

            {
                // Quản lý danh sách bác sĩ
                name: 'menu.admin.crud-redux', link: '/system/manage-user'
            },
            {
                // Quản lý thông tin bác sĩ
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },
            {
                // Quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
        ]
    },

    {
        // Quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },
        ]
    },
    {
        // Quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
        ]
    },
    {
        // Quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
            },
        ]
    },
];