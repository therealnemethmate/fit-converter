import * as path from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: path.resolve('./src/index.ts'),
            name: 'Zwo SDK',
            fileName: 'zwo-sdk',
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
