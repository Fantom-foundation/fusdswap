import { ethers } from 'ethers';
import { erc20Abi } from '@/utils/abi/erc20.js';
import { toHex } from '@/utils/big-number/big-number.js';

export class RpcProvider {
    /** @type {Chains} */
    #chains = null;
    /** @type {function} */
    #createProvider = null;
    /** @type {JsonRpcProvider} */
    #provider = null;
    /** @type {Object.<string, JsonRpcProvider>} */
    #providers = {};
    /** @type {Notifications} */
    #notifications = null;

    /**
     * @param {Chains} chains
     * @param {function(rpcUrl: string):JsonRpcProvider} [createProvider]
     * @param {string} [defaultChainId]
     * @param {Notifications} [notifications]
     */
    constructor({ chains, createProvider = null, defaultChainId = '', notifications = null }) {
        if (!chains) {
            throw new Error('Need instance of `Chains`');
        }

        this.#chains = chains;
        this.#createProvider = createProvider || this.#createJsonRpcProvider;
        this.#notifications = notifications;

        this.setByChainId(defaultChainId || this.#chains.defaultChain.chainId);
    }

    /**
     * @param {string} chainId
     */
    setByChainId(chainId) {
        this.#provider = this.#setProviderByChainId(chainId);

        if (!this.#provider) {
            throw new Error(`Can't set provider by chain id ${chainId}`);
        }
    }

    /**
     * @param {string} address
     * @return {Promise<BigNumber>}
     */
    async getBalance(address) {
        try {
            return address ? this.#getBigNumber(await this.#provider.getBalance(address)) : '0x0';
        } catch (err) {
            this.#processError(err);
        }
    }

    /**
     * @param {string} erc20Address
     * @param {string} address
     * @return {Promise<BigNumber>}
     */
    async getErc20Balance(erc20Address, address) {
        try {
            return this.#getBigNumber(await this.#getContract(erc20Address, erc20Abi).balanceOf(address));
        } catch (err) {
            this.#processError(err);
        }
    }

    /**
     * @param {string} erc20Address
     * @param {string} address
     * @param {string} spender
     * @return {Promise<BigNumber>}
     */
    async getAllowance(erc20Address, address, spender) {
        try {
            return this.#getBigNumber(await this.#getContract(erc20Address, erc20Abi).allowance(address, spender));
        } catch (err) {
            this.#processError(err);
        }
    }

    async estimateGas(transaction) {
        try {
            return this.#getBigNumber(await this.#provider.estimateGas(transaction));
        } catch (err) {
            // throw new Error(this.#getErrorMessage(err));
            this.#processError(err);
        }
    }

    async getGasPrice() {
        try {
            const tmp = await this.#provider.getGasPrice();
            console.log('!!', tmp);
            return this.#getBigNumber(tmp);
        } catch (err) {
            this.#processError(err);
        }
    }

    async getNonce(address) {
        try {
            return toHex(await this.#provider.getTransactionCount(address));
        } catch (err) {
            this.#processError(err);
        }
    }

    async getTransaction(hash) {
        try {
            return this.#provider.getTransaction(hash);
        } catch (err) {
            this.#processError(err);
        }
    }

    async getTransactionReceipt(hash) {
        try {
            return this.#provider.getTransactionReceipt(hash);
        } catch (err) {
            this.#processError(err);
        }
    }

    async getTransactionStatus(hash) {
        const tx = await this.#provider.getTransactionReceipt(hash);
        let status = null;

        if (tx) {
            status = parseInt(tx.status) === 1 ? '0x1' : '0x0';
        }

        return status;
    }

    #getBigNumber(ret) {
        return ret?._hex || '0x0';
    }

    #getContract(contractAddress, abi) {
        return new ethers.Contract(contractAddress, abi, this.#provider);
    }

    /**
     * @return {JsonRpcProvider}
     */
    get provider() {
        return this.#provider;
    }

    #setProviderByChainId(chainId) {
        let provider = this.#providers[chainId] || null;

        if (!provider) {
            provider = this.#createProviderByChainId(chainId);
        }

        return provider;
    }

    #createProviderByChainId(chainId) {
        const chain = this.#chains.get(chainId);
        let provider = null;

        if (chain) {
            provider = this.#createProvider(chain.rpcUrl);
            this.#providers[chain.chainId] = provider;
        }

        return provider;
    }

    #createJsonRpcProvider(rpcUrl) {
        return new ethers.providers.StaticJsonRpcProvider(rpcUrl);
    }

    /**
     * @param {Error} err
     */
    #processError(err) {
        console.error(err);

        if (err.code !== 'NETWORK_ERROR') {
            this.#errorNotification(this.#getErrorMessage(err));
        }
    }

    #getErrorMessage(err) {
        return err.message.slice(0, err.message.indexOf('['));
    }

    #errorNotification(errMessage) {
        if (this.#notifications) {
            this.#notifications.add({
                type: 'error',
                text: errMessage,
            });
        }
    }
}
