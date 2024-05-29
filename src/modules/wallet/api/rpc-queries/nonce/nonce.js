import { rpcProvider } from '@/config/rpcProvider.js';

export function getNonce(address) {
    return rpcProvider.getNonce(address);
}
