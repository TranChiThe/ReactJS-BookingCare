export const adminMenu = [
    {
        name: 'menu.admin.home',
        menus: [
            {
                name: 'menu.home.dashboard', link: '/system/overview'
            },
            {
                name: 'menu.home.statistical-chart', link: '/system/statistical-chart'
            },
            {
                name: 'menu.admin.system-code', link: '/system/system-code'
            },
        ]
    },
    {
        name: 'menu.admin.user',
        menus: [
            {
                name: 'menu.admin.crud-redux', link: '/system/manage-user'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
        ]
    },

    {
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },
        ]
    },
    {
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.schedule',
        menus: [
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor-manage/manage-schedule'
            },
            {
                name: 'menu.doctor.busy-schedule', link: '/doctor-manage/manage-busy-schedule'
            },

        ],

    },
    {
        name: 'menu.doctor.patient',
        menus: [
            {
                name: 'menu.doctor.manage-patient-appointment', link: '/doctor-manage/manage-appointment'
            },
        ]
    }

];


export const staffMenu = [
    {
        name: 'menu.admin.home',
        menus: [
            {
                name: 'menu.home.statistical-chart', link: '/staff-manage/statistical-chart'
            },

        ]
    },
    {
        name: 'menu.staff.doctor',
        menus: [
            {
                name: 'menu.staff.doctor-schedule', link: '/staff-manage/doctor-schedule'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/staff-manage/manage-doctor-infomation'
            },
        ]
    },

    {
        name: 'menu.staff.patient',
        menus: [
            {
                name: 'menu.staff.patient-appointment', link: '/staff-manage/manage-patient-appointment'
            },
        ]
    },
];