<script setup>
import AppHeader from '@/modules/app/components/AppHeader/AppHeader.vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store.js';
import { ref, watch } from 'vue';
import { reloadAppMainViewSwitcher } from '@/modules/app/helpers.js';
import { FCard, getUniqueId } from 'fantom-vue3-components';
import SwapFormC from '@/modules/app/components/SwapFormC/SwapFormC.vue';
import SocialMediaLinks from '@/modules/app/components/SocialMediaLinks/SocialMediaLinks.vue';

import { getTokenConfig } from '@/config/tokens.js';

const { address: accountAddress } = storeToRefs(useWalletStore());
const key = ref(getUniqueId());
const tokenConfig = getTokenConfig();

watch(accountAddress, () => {
    reloadAppMainViewSwitcher();
});

function onSwapFinished() {
    console.log('onSwapFinished');
    key.value = getUniqueId();
}
</script>

<template>
    <div class="appmainview main">
        <AppHeader />
        <main>
            <h1>{{ $t('app.appMainView.heading', { tokenSymbol: tokenConfig.token.symbol }) }}</h1>
            <p class="tea-center">
                {{ $t('app.appMainView.text1', { tokenSymbol: tokenConfig.token.symbol }) }}
                <br />
                {{ $t('app.appMainView.text2') }}
            </p>
            <FCard class="appmainview_swapform">
                <SwapFormC
                    :contract-address="tokenConfig.swapContract"
                    :from-token="tokenConfig.token"
                    :swap-token-for-f-usd="tokenConfig.swapTokenForFUsd"
                    @swap-finished="onSwapFinished"
                    :key="key"
                />
            </FCard>
        </main>
        <footer>
            <SocialMediaLinks />
        </footer>
    </div>
</template>

<style lang="scss">
.appmainview {
    &.main {
        max-width: 940px;
        margin: 0 auto;
        padding: 0 var(--f-spacer-4) var(--f-spacer-7) var(--f-spacer-4);

        h1 {
            //margin-top: 0;
            text-align: center;
        }
    }

    &_swapform {
        max-width: 480px;
        margin: var(--f-spacer-7) auto 0 auto;
    }

    footer {
        padding-top: var(--f-spacer-8);
    }
}
</style>
