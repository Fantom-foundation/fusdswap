import { rpcProvider } from '@/config/rpcProvider.js';

export function getTransactionStatus(transactionHash) {
    return rpcProvider.getTransactionStatus(transactionHash);
}
