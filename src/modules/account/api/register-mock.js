import { useApi } from 'fantom-vue3-components';
import { getBalance } from '@/modules/account/api/queries/balance/mock/balance.js';

const api = useApi().api;

api.registerQueryMock(getBalance, 'getBalance');
