import { rpcProvider } from '@/config/rpcProvider.js';
import { unref } from 'vue';

export function getBalance(address, erc20address) {
    const addr = unref(address);
    const erc20Addr = unref(erc20address);

    if (!addr) {
        return '0x0';
    }

    if (erc20Addr) {
        return rpcProvider.getErc20Balance(erc20Addr, address);
    }

    return rpcProvider.getBalance(address);
}
