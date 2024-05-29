import { useApi } from 'fantom-vue3-components';
import { sendTransaction } from './mutations/send-transaction/send-transaction.js';
import { getAllowance } from '@/common/api/queries/allowance/allowance.js';

const api = useApi().api;

api.registerMutation(sendTransaction, 'sendTransaction');

api.registerQuery(getAllowance, 'getAllowance');

/**
 * @typedef {Object} CommonApiMutations
 * @property {function()} sendTransaction
 */

/**
 * @typedef {Object} CommonApiQueries
 * @property {function(ownerAddress: string, tokenAddress: string, spenderAddress: string)} getAllowance
 */
