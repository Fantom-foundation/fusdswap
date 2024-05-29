import { useApi } from 'fantom-vue3-components';
import { sendTransaction } from './mutations/send-transaction/mock/send-transaction.js';
import { getAllowance } from '@/common/api/queries/allowance/mock/allowance.js';

const api = useApi().api;

api.registerMutationMock(sendTransaction, 'sendTransaction');

api.registerQueryMock(getAllowance, 'getAllowance');
