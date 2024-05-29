import { unref } from 'vue';

export function getAllowance(address, erc20address, spenderAddress) {
    const addr = unref(address);

    if (!addr || !spenderAddress) {
        return '0x0';
    }

    return '0xDE0B6B3A7640000';
}
