<script setup>
import { useWallet } from '@/modules/wallet/index.js';
import { useAccounts } from '@/modules/account/index.js';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store.js';
import { defer } from 'fantom-vue3-components';
import BadAccountWarningWindow from '@/modules/wallet/components/BadAccountWarningWindow/BadAccountWarningWindow.vue';
import { onMounted, ref } from 'vue';
import BadChainWarningWindow from '@/modules/wallet/components/BadChainWarningWindow/BadChainWarningWindow.vue';
import { appConfig } from '@/config/app-config.js';

const props = defineProps({
    notifications: { required: true },
});

const wallet = useWallet().wallet;
const { walletName } = storeToRefs(useWalletStore());
const badAddress = ref('');
const badAccountWarningWindow = ref(null);
const badChainWarningWindow = ref(null);
const chainId = ref(appConfig.chainId);

function addAccount(data) {
    defer(() => {
        const { accounts } = useAccounts();

        if (badAccountWarningWindow.value) {
            badAccountWarningWindow.value.hide();
        }

        /*console.log(
            '???',
            walletName.value,
            store.activeAccountAddress,
            data.address,
            data.prevAddress,
            data.requestAddress
        );*/

        if (!accounts.getAccountByAddress(data.address)) {
            accounts.setActiveAccount({
                address: data.address,
                walletName: data.walletName,
            });
        }
    });
}

function cancelEvent(event) {
    if (Array.isArray(event.waitFor)) {
        event.waitFor.push(
            new Promise((resolve) => {
                resolve('cancel');
            })
        );
    }
}

function removeAccount(address) {
    const { accounts } = useAccounts();

    accounts.removeAccountByAddress(address);
}

function onWalletEvents(event) {
    if (event.name === 'error') {
        props.notifications.add({
            type: 'error',
            text: event.data,
        });
    } else if (event.name === 'address_change') {
        cancelEvent(event);
        // console.log('handler: address_change');
        addAccount(event.data);
    } else if (event.name === 'bad_chain_id') {
        if (badChainWarningWindow.value) {
            badChainWarningWindow.value.show();
        }
        cancelEvent(event);
    } else if (event.name === 'chain_change') {
        if (badChainWarningWindow.value) {
            badChainWarningWindow.value.hide();
        }
    } else if (event.name === 'no_wallet_set') {
        console.log('handler: no_wallet_set');
    } else if (event.name === 'wallet_inactive') {
        console.log('handler: wallet_inactive');
        addAccount(event.data);
    } else if (event.name === 'disconnected') {
        removeAccount(event.address);
    }
}

onMounted(() => {
    wallet.setEventsListener(onWalletEvents);
});
</script>

<template>
    <div class="walleteventshandler">
        <BadAccountWarningWindow ref="badAccountWarningWindow" :address="badAddress" />
        <BadChainWarningWindow
            ref="badChainWarningWindow"
            :chain-id="chainId"
            :web3-wallet="wallet.web3Wallet"
            :show-switch-chain-button="walletName === 'metamask'"
        />
    </div>
</template>

<style lang="scss">
.walleteventshandler {
}
</style>
