<script setup>
import SwapForm from '@/modules/app/components/SwapForm/SwapForm.vue';
import { FUSD_TOKEN } from '@/config/tokens.js';
import { useWallet } from '@/modules/wallet/index.js';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store.js';
import { useApi, FMessage } from 'fantom-vue3-components';
import { toBigNumber } from '@/utils/big-number/big-number.js';
import { approve } from '@/utils/tx/allowance.js';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['swap-finished']);

const props = defineProps({
    address: {
        type: String,
        default: '',
    },
    fromToken: {
        type: Object,
        default() {
            return {};
        },
    },
    contractAddress: {
        type: String,
        default: '',
    },
    swapTokenForFUsd: {
        default: null,
    },
    wallet: {
        default: null,
    },
    checkContractFUSDBalance: {
        type: Boolean,
        default: true,
    },
});

const api = useApi().api;
const t = useI18n().t;
const FUSD = FUSD_TOKEN();
let swapArgs = null;
const wallet = props.wallet || useWallet().wallet;
const txStatus = ref({});
const buttonLabel = ref('');
const notEnoughFUSD = ref(false);
const loading = ref(false);
const loadingBalances = ref(false);
const tokenBalance = ref('0x0');
const fusdBalance = ref('0x0');
const { address: accountAddress } = storeToRefs(useWalletStore());
const cAddress = computed(() => props.address || accountAddress.value);

const cDisplayMetamaskButton = computed(() => !cAddress.value);

const cDisabled = computed(
    () => !cAddress.value || loadingBalances.value || txStatus.value.status === 'pending' || loading.value
);
const cTokenBalance = computed(() => {
    let balance = tokenBalance.value;

    if (loadingBalances.value) {
        balance = '';
    } else if (!cAddress.value) {
        balance = '0x0';
    }

    return balance;
});
const cFUsdBalance = computed(() => {
    let balance = fusdBalance.value;

    if (loadingBalances.value) {
        balance = '';
    } else if (!cAddress.value) {
        balance = '0x0';
    }

    return balance;
});

async function allow({ amount, tokenAddress, address }) {
    buttonLabel.value = t('app.swapForm.approving');

    await wallet.sendTransaction({
        transaction: {
            ...approve(amount, tokenAddress, props.contractAddress),
            from: address,
        },
        code: 'allow',
        txStatus,
    });
}

async function swap({ amount, address }) {
    buttonLabel.value = t('app.swapForm.swapping');

    await wallet.sendTransaction({
        transaction: {
            ...props.swapTokenForFUsd(amount, props.contractAddress),
            from: address,
        },
        code: 'swap',
        txStatus,
    });
}

async function getBalances(address) {
    loadingBalances.value = true;

    const [fromTokenBalance, fusdBalance] = await Promise.all([
        api.query.getBalance(address, props.fromToken.address),
        api.query.getBalance(address, FUSD.address),
    ]);

    loadingBalances.value = false;

    return {
        fromTokenBalance,
        fusdBalance,
    };
}

async function getAllowance(address) {
    return await api.query.getAllowance(address, props.fromToken.address, props.contractAddress);
}

async function getContractFUSDBalance() {
    return api.query.getBalance(props.contractAddress, FUSD.address);
}

async function onSubmit(values) {
    const amount = values.tokenAmount;

    loading.value = true;

    if (props.checkContractFUSDBalance && toBigNumber(await getContractFUSDBalance()).isLessThan(amount)) {
        notEnoughFUSD.value = true;
    } else {
        const tokenAllowance = await getAllowance(cAddress.value);
        notEnoughFUSD.value = false;

        if (toBigNumber(tokenAllowance).isLessThan(amount)) {
            swapArgs = {
                amount,
                address: cAddress.value,
            };

            await allow({
                amount,
                tokenAddress: props.fromToken.address,
                address: cAddress.value,
            });
        } else {
            swap({
                amount,
                address: cAddress.value,
            });
        }
    }

    loading.value = false;
}

async function onAddressChange(address) {
    if (address) {
        const balances = await getBalances(address);

        tokenBalance.value = balances.fromTokenBalance;
        fusdBalance.value = balances.fusdBalance;
    }

    notEnoughFUSD.value = false;
}

watch(
    cAddress,
    async (address) => {
        onAddressChange(address);
    },
    { immediate: true }
);

watch(txStatus, (ts) => {
    if (ts.status === 'rejected' || ts.status === 'error') {
        buttonLabel.value = '';
    }

    if (ts.code === 'allow' && ts.status === 'success') {
        swap(swapArgs);
        swapArgs = null;
    } else if (ts.code === 'swap' && ts.status === 'success') {
        buttonLabel.value = '';
        emit('swap-finished');
    }
});
</script>

<template>
    <SwapForm
        :from-token="{ ...props.fromToken, balance: cTokenBalance }"
        :to-token="{ ...FUSD, balance: cFUsdBalance }"
        :disabled="cDisabled"
        :loading="txStatus.status === 'pending' || loading"
        :display-metamask-button="cDisplayMetamaskButton"
        :button-label="buttonLabel"
        class="swapformc"
        @submit="onSubmit"
    >
        <template #above-buttons>
            <FMessage v-if="notEnoughFUSD" type="error" with-icon>{{ $t('app.swapForm.notEnoughFUSD') }}</FMessage>
        </template>
    </SwapForm>
</template>

<style lang="scss">
.swapformc {
    .fmessage {
        width: 100%;
        justify-content: center;

        &_body {
            width: initial;
        }
    }
}
</style>
