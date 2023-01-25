import { clientInfo, useApi } from 'fantom-vue3-components';
import { i18n } from '@/config/i18n.js';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import { TransferStatus } from '@/plugins/web3-wallets/Ledger/LedgerProvider/transfer-status.js';

/**
 * @return {boolean}
 */
export function useU2FTransport() {
    return clientInfo.browser === 'Firefox' || clientInfo.browser === 'Safari';
}

/**
 * @return {LedgerProvider}
 */
export async function getLedgerProvider(transactionPopup = null) {
    const { notifications } = useNotifications();
    const { LedgerProvider } = await import('/src/plugins/web3-wallets/Ledger/LedgerProvider/LedgerProvider.js');

    return new LedgerProvider({
        api: useApi().api,
        useU2FTransport: useU2FTransport(),
        notifications,
        transactionPopup,
    });
}

/**
 * @param {number} statusCode
 * @param {Object} statusCodes
 * @return {string}
 */
export function getLedgerErrorMessageByStatusCode(statusCode, statusCodes = TransferStatus) {
    let text = '';

    if (statusCode === statusCodes.DEVICE_LOCKED) {
        text = i18n.t('ledger.ledgerMessage.deviceLocked');
    } else if (statusCode === statusCodes.USER_REJECTED_REQUESTED_ACTION) {
        text = i18n.t('ledger.ledgerMessage.userRejectedAction');
    } else if (statusCode === statusCodes.DEVICE_INELIGIBLE) {
        text = i18n.t('ledger.ledgerMessage.deviceIneligible');
    } else if (statusCode === statusCodes.DEVICE_ACCESS_DENIED) {
        text = i18n.t('ledger.ledgerMessage.accessDenied');
    }

    return text;
}

export function adjustLedgerStatusCode(error) {
    if (typeof error === 'object') {
        if (error?.originalError?.metaData?.type === 'DEVICE_INELIGIBLE') {
            error.statusCode = TransferStatus.DEVICE_INELIGIBLE;
        } else if (error.message?.indexOf('unlock') > -1) {
            error.statusCode = TransferStatus.DEVICE_LOCKED;
        } else if (error.message?.toLowerCase().indexOf('access denied') > -1) {
            error.statusCode = TransferStatus.DEVICE_ACCESS_DENIED;
        }
    }
}
