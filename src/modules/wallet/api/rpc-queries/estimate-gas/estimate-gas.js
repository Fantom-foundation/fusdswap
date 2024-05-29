import { rpcProvider } from '@/config/rpcProvider.js';

export function getEstimateGas(transaction) {
    return rpcProvider.estimateGas(transaction);
}
