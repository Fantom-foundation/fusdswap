import { rpcProvider } from '@/config/rpcProvider.js';
import { unref } from 'vue';

export function getAllowance(address, erc20address, spenderAddress) {
    const addr = unref(address);

    if (!addr || !spenderAddress) {
        return '0x0';
    }

    return rpcProvider.getAllowance(erc20address, address, spenderAddress);
}
