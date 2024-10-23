import { SwalConfig } from "./notificationSwal";
import { notificationVi } from "./notificationVi";
import { notificationEn } from "./notificationEn";
import Swal from 'sweetalert2';
import { LANGUAGES } from '../../utils';

////////////////////////////// -- manage doctor -- ////////////////////////////////////////
export const saveInfoSuccess = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.successNotification(notificationVi.addSuccessTitle, notificationVi.addSuccessText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.successNotification(notificationEn.addSuccessTitle, notificationEn.addSuccessText));
    }
}
export const saveInfoFail = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.errorNotification(notificationVi.addFailTitle, notificationVi.addFailText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.errorNotification(notificationEn.addFailTitle, notificationEn.addFailText));
    }
}

export const editInfoSuccess = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.successNotification(notificationVi.editSuccessTitle, notificationVi.editSuccessText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.successNotification(notificationEn.editSuccessTitle, notificationEn.editSuccessText));
    }
}
export const editInfoFail = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.errorNotification(notificationVi.editSuccessTitle, notificationVi.editSuccessText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.errorNotification(notificationEn.editSuccessTitle, notificationEn.editSuccessText));
    }
}

////////////////////////////// -- manage schedule -- ////////////////////////////////////////

export const saveScheduleInfoSuccess = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.successNotification(notificationVi.addScheduleSuccessTitle, notificationVi.addScheduleSuccessText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.successNotification(notificationEn.addScheduleSuccessTitle, notificationEn.addScheduleSuccessText));
    }
}
export const saveScheduleInfoFail = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.errorNotification(notificationVi.addScheduleFailTitle, notificationVi.addScheduleFailText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.errorNotification(notificationEn.addScheduleFailTitle, notificationEn.addScheduleFailText));
    }
}

////////////////////////////// -- manage user -- ////////////////////////////////////////

export const notificationAddUserSuccess = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.successNotification(notificationVi.addAccountTitle, notificationVi.addAccountText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.successNotification(notificationEn.addAccountTitle, notificationEn.addAccountText));
    }
}

export const notificationEditUserSuccess = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.successNotification(notificationVi.editAccountTitle, notificationVi.editAccountText));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.successNotification(notificationEn.editAccountTitle, notificationEn.editAccountText));
    }
}

export const notificationAddUserFailed = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.errorNotification(notificationVi.addAccountTileFail, notificationVi.addAccountTextFail));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.errorNotification(notificationEn.addAccountTileFail, notificationEn.addAccountTextFail));
    }
}

export const notificationEditUserFailed = (language) => {
    if (language === LANGUAGES.VI) {
        Swal.fire(SwalConfig.errorNotification(notificationVi.editAccountTitleFail, notificationVi.editAccountTextFail));
    } else if (language === LANGUAGES.EN) {
        Swal.fire(SwalConfig.errorNotification(notificationEn.editAccountTitleFail, notificationEn.editAccountTextFail));
    }
}