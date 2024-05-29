import { RpcProvider } from '@/utils/RpcProvider/RpcProvider.js';
import { chains } from './chains.js';
import { appConfig } from '@/config/app-config.js';
import { ethers } from 'ethers';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';

// const useMock = import.meta.env.VITE_ACCEPTANCE_TESTING === '1';
const useMock = false;
const { notifications } = useNotifications();

function createRpcProviderMock(rpcUrl) {
    const jsonRpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl, 'any');

    window.__mocks__.jsonRpcProvider = jsonRpcProvider;

    return jsonRpcProvider;
}

export const rpcProvider = new RpcProvider({
    chains,
    createProvider: useMock ? createRpcProviderMock : null,
    defaultChainId: appConfig.chainId,
    notifications,
});
