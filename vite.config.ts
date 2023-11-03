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
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve('./app/src'),
                '@fit-converter/tsconfig': path.resolve('./packages/__dev__/tsconfig/tsconfig.json'),
                '@fit-converter/eslint': path.resolve('./packages/__dev__/eslint/.eslintrc.js'),
            },
        },
        define: {
            __VUE_PROD_DEVTOOLS__: process.env.VUE_DEVTOOLS === 'true',
        },
    };
});
