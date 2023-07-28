import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/style/_mixins.scss"; 
                @import "./src/style/_variables.scss";
                @import "./src/style/_fonts.scss";`
            },
        },
    },
    resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
