import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import Sitemap from 'vite-plugin-sitemap'
import {createHtmlPlugin} from 'vite-plugin-html'

const env = loadEnv('', process.cwd());

const projects = ['soundzam', 'dpg-motm', 'nh-samen-veilig', 'internship-io', 'accessibility', 'internship-livewall', 'tegelogy', 'shooting-stars', 'city-life-game'];
const projectRoutes = projects.map(project => `/project/${project}`);
const dynamicRoutes = ['/', '/home', '/projects', '/experience', '/about_me' ,'/contact'];

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
        Sitemap({
            hostname: 'https://milovanderpas.nl',
            dynamicRoutes: [...dynamicRoutes, ...projectRoutes]
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
        // Legacy API is required for the Options-API $t()/$i18n usage across the app.
        __VUE_I18N_LEGACY_API__: true,
    },
})
