<script setup>
import WalletButton from '@/modules/wallet/components/WalletButton/WalletButton.vue';
import { useI18n } from 'vue-i18n';
import WalletButtonPopover from '@/modules/wallet/components/WalletButtonPopover/WalletButtonPopover.vue';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store.js';
import { useAccounts } from '@/modules/account/index.js';
import AddingExistingAccountWarningWindow from '@/modules/wallet/components/AddingExistingAccountWarningWindow/AddingExistingAccountWarningWindow.vue';
import { appConfig } from '@/config/app-config.js';
import { openWeb3Modal } from '@/plugins/web3-wallets/useWeb3Modal.js';
import { useWallet } from '@/modules/wallet/index.js';

const accounts = useAccounts().accounts;
const { address, walletName } = storeToRefs(useWalletStore());
const { t } = useI18n();
const popover = ref(null);
const addingExistingAccountWarningWindow = ref(null);
const wallet = useWallet().wallet;

const walletLabel = computed(() => {
    let walletLabel = '';

    if (walletName.value) {
        if (appConfig.flags.useWeb3Modal) {
            walletLabel = wallet.web3Wallet.getConnectedWalletName();
        } else {
            walletLabel = walletName.value;
        }
    }

    return walletLabel;
});

async function addWeb3Wallet(walletName) {
    const previousActiveAccountAddress = accounts.store.activeAccountAddress;

    await accounts.setActiveAccount({ walletName });

    if (walletName === 'metamask' && previousActiveAccountAddress === accounts.store.activeAccountAddress) {
        const account = accounts.getAccountByAddress(accounts.store.activeAccountAddress);

        if (account?.walletName === 'metamask') {
            address.value = previousActiveAccountAddress;
            addingExistingAccountWarningWindow.value.show();
        }
    }
}

async function onClick() {
    if (address.value !== '') {
        popover.value.toggle();
    } else if (appConfig.flags.useWeb3Modal) {
        await openWeb3Modal();
    } else {
        addWeb3Wallet('metamask');
    }
}
</script>

<template>
    <WalletButton
        :address="address"
        :sub-text="walletLabel"
        :placeholder-text="
            appConfig.flags.useWeb3Modal
                ? t('wallet.walletButton.connectWallet')
                : t('wallet.walletButton.connectMetamask')
        "
        id="wbtn"
        @click="onClick"
    />
    <WalletButtonPopover attach-to="#wbtn" ref="popover">
        <slot name="popover"></slot>
    </WalletButtonPopover>
    <AddingExistingAccountWarningWindow ref="addingExistingAccountWarningWindow" :address="address" />
</template>

<style lang="scss"></style>
