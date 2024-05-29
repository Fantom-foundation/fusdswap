import { appConfig } from '@/config/app-config.js';
import { DAI_TOKEN } from '@/config/tokens.js';
import { swapDAIForFUsd } from '@/utils/tx/swap.js';

export const DAI_SWAP_CONTRACT = '0xBca5E7bCE998e084e06a37d2Cfa89980941D5fDD';
export const SUBTRACT_FTM_AMOUNT = 1;

export function getTokenConfig() {
    const swapTokenSymbol = appConfig.flags.swapTokenSymbol;
    const config = {
        swapContract: '',
        token: {},
        swapTokenForFUsd: null,
    };

    if (swapTokenSymbol === 'DAI') {
        config.swapContract = DAI_SWAP_CONTRACT;
        config.token = DAI_TOKEN();
        config.swapTokenForFUsd = swapDAIForFUsd;
    }

    return config;
}
