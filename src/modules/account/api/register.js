import { useApi } from 'fantom-vue3-components';
import { getBalance } from '@/modules/account/api/queries/balance/balance.js';

const api = useApi().api;

api.registerQuery(getBalance, 'getBalance');

/**
 * @typedef {Object} AccountsApiQueries
 * @property {function(address: string, erc20Address: string)} getBalance
 */
