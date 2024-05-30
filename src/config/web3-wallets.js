import { appConfig } from '@/config/app-config.js';
import { chains } from '@/config/chains.js';

export const SOFTWARE_WALLET_POPUP_ID = 'software-wallet-popup';
export const LEDGER_TRANSACTION_POPUP_ID = 'ledger-transaction-popup';

/**
 * List of available web3 wallets
 *
 * @return {Wb3[]}
 * @constructor
 */
export function WEB3_WALLETS() {
    if (appConfig.flags.useWeb3Modal) {
        return [
            {
                name: 'web3modal',
                label: 'Web3Modal',
                async getClass() {
                    return (await import('/src/plugins/web3-wallets/Web3Modal/Web3ModalWallet.js')).Web3ModalWallet;
                },
                options: {
                    defaultChainId: chains.defaultChain.chainId,
                },
            },
        ];
    }

    return [
        {
            name: 'metamask',
            label: 'Metamask',
            async getClass() {
                return (await import('/src/plugins/web3-wallets/Metamask/Metamask.js')).Metamask;
            },
        },
    ];
}

/**
 * @return {{}} Keys are wallet names, values are Wb3
 * @constructor
 */
export function WEB3_WALLETS_BY_NAME() {
    const wallets = {};

    WEB3_WALLETS().forEach((wallet) => {
        wallets[wallet.name] = wallet;
    });

    return wallets;
}

export function setupWallets() {}

/**
 * Web3 wallet object
 * @typedef {Object} Wb3
 * @property {string} name
 * @property {Class} clas
 * @property {string} [label]
 * @property {string} [icon] Icon from AppIconset
 */
