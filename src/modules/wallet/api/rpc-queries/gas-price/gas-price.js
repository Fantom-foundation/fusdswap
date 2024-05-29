import { rpcProvider } from '@/config/rpcProvider.js';

export function getGasPrice() {
    return rpcProvider.getGasPrice();
}
