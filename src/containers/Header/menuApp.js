export const adminMenu = [
    { // Quản lý người dùng
        name: 'menu.admin.user',
        menus: [
            {
                name: 'menu.admin.manage-admin', link: '/system/user-admin'
            },
            {
                name: 'menu.admin.crud-redux', link: '/system/manage-user'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },
            // subMenus: [
            //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
            //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
            // ]
            { // Quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
        ]
    },

    { // Quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },
            // subMenus: [
            //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
            //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
            // ]

        ]
    },
    { // Quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
            // subMenus: [
            //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
            //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
            // ]
        ]
    },
    { // Quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
            },
            // subMenus: [
            //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
            //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
            // ]
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.user',
        menus: [
            { // Quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
        ]
    }

];