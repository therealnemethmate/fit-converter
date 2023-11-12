import * as path from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// eslint-disable-next-line
export default defineConfig(({ mode }) => {
    if (process.env.VUE_DEVTOOLS === 'true') {
        console.warn('WARNING! Vue devtools is enabled in this build!');
    }

    return {
        base: '/fit-converter/',
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve('./src'),
                '@fit-converter/fit-sdk': path.resolve('./packages/fit-sdk/src'),
                '@fit-converter/zwo-sdk': path.resolve('./packages/zwo-sdk/src'),
            },
        },
        define: {
            __VUE_PROD_DEVTOOLS__: process.env.VUE_DEVTOOLS === 'true',
        },
    };
});
