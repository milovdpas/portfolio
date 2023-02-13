import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import {createHtmlPlugin} from 'vite-plugin-html'

const env = loadEnv('', process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8080,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
               @import "@/assets/scss/_mixins.scss";
               @import "@/assets/scss/_variables.scss";
            `
            }
        }
    },
    plugins: [
        vue(),
        svgLoader(),
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    name: env.VITE_APP_NAME,
                }
            }
        }),
    ],
    resolve: {
        alias: {
            '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@fonts': fileURLToPath(new URL('./src/assets/fonts', import.meta.url))
        }
    },
    define: {
        __VUE_I18N_FULL_INSTALL__: true,
        __VUE_I18N_LEGACY_API__: false,
    },
})
