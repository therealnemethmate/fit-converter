import * as path from 'node:path';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve('./src/index.ts'),
            name: 'Fit SDK',
            fileName: 'fit-sdk',
        },
        rollupOptions: {
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
