import { Chains } from '../utils/Chains/Chains.js';
import { FTM_TOKEN } from './tokens.js';
import { appConfig } from './app-config.js';

const CHAINS = [
    {
        chainId: '0xfa',
        name: 'Fantom Opera',
        code: 'fantom_mainnet',
        currencySymbol: 'FTM',
        nativeToken: FTM_TOKEN(),
        rpcUrl: 'https://rpc.ftm.tools/',
        explorerUrl: 'https://ftmscan.com',
    },
    {
        chainId: '0xfa2',
        name: 'Fantom Testnet',
        code: 'fantom_testnet',
        currencySymbol: 'FTM',
        nativeToken: FTM_TOKEN(),
        rpcUrl: 'https://xapi.testnet.fantom.network/lachesis/',
        explorerUrl: 'https://explorer.testnet.fantom.network',
    },
];

export const chains = new Chains({
    chains: CHAINS,
    defaultChainId: appConfig.chainId,
});
