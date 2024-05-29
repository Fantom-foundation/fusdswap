import { unref } from 'vue';

export async function getBalance(address, erc20address) {
    const addr = unref(address);
    const erc20Addr = unref(erc20address);

    if (!addr) {
        return '0x0';
    }

    if (erc20Addr) {
        return '0x4563918244F40000'; // 5
    }

    return '0x6B14BD1E6EEA00000'; // 123.456
}
