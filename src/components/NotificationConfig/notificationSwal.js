import React from 'react';

export const SwalConfig = {
    confirmDialog: (title, text, confirm, cancel) => ({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirm, // Xác nhận
        cancelButtonText: cancel// Hủy bỏ
    }),
    successNotification: (title, text) => ({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'// OK
    }),
    errorNotification: (title, text) => ({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK' // OK
    })
};

