<script setup>
import WalletButtonC from '@/modules/wallet/components/WalletButtonC/WalletButtonC.vue';
import DarkThemeSwitch from '@/modules/app/components/DarkThemeSwitch/DarkThemeSwitch.vue';
</script>

<template>
    <header class="appheader">
        <div class="appheader_left">
            <div class="appheader_logo">
                <a href="https://fantom.foundation/" target="_blank" rel="nofollow" title="Fantom Foundation">
                    <img src="/fantom-logo-blue.svg" alt="Fantom logo" data-testid="logo" />
                </a>
            </div>
            <!--            <div class="appheader_separator">&nbsp;</div>-->
        </div>
        <div class="appheader_right">
            <DarkThemeSwitch />
            <WalletButtonC />
        </div>
    </header>
</template>

<style lang="scss">
@use 'fantom-vue3-components/src/assets/scss/tools/media';
@use 'fantom-vue3-components/src/assets/scss/settings/breakpoints';

.appheader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    //padding: var(--f-spacer-2) var(--f-spacer-2) var(--f-spacer-2) var(--f-spacer-3);
    padding: var(--f-spacer-2) 0;
    gap: var(--f-spacer-5);

    &_left {
        display: flex;
        align-items: center;
    }

    &_separator {
        width: 1px;
        background: var(--f-color-primary-4);
        margin-left: var(--f-spacer-5);
    }

    &_logo {
        img {
            display: block;
            max-height: 32px;
        }
    }

    .socialmedialinks {
        margin-left: var(--f-spacer-3);
    }

    .fdarkthemeswitch {
        opacity: 0.85;
    }
}

:root.theme-dark {
    .appheader {
        &_separator {
            background: var(--f-color-grey-1);
            opacity: 0.2;
        }
    }
}

@include media.media-max(40em) {
    .appheader {
        flex-direction: column;
        gap: var(--f-spacer-3);
        padding-top: var(--f-spacer-3);
        padding-bottom: var(--f-spacer-3);

        &_left {
            justify-content: space-between;
        }
    }
}
</style>
