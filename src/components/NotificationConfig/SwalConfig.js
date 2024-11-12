import { FormattedMessage } from 'react-intl';

const createSwalConfig = (intl) => ({
    confirmDialog: () => ({
        title: intl.formatMessage({ id: 'notification.delete-success.confirmTitle' }),
        text: intl.formatMessage({ id: 'notification.delete-success.confirmText' }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: intl.formatMessage({ id: 'notification.confirm' }),
        cancelButtonText: intl.formatMessage({ id: 'notification.cancel' })
    }),
    successNotification: (textId) => ({
        title: intl.formatMessage({ id: 'notification.titleSuccess' }),
        text: intl.formatMessage({ id: textId }),
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: intl.formatMessage({ id: 'notification.ok' })
    }),
    errorNotification: (textId) => ({
        title: intl.formatMessage({ id: 'notification.titleFail' }),
        text: intl.formatMessage({ id: textId }),
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: intl.formatMessage({ id: 'notification.ok' })
    })
});

export default createSwalConfig;
