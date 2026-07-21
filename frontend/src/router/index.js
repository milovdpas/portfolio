import {createRouter, createWebHistory} from 'vue-router'
import anime from "animejs";

const routes = [
    {
        path: '/',
        name: 'default',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/projects',
        name: 'projects',
        component: () => import('../views/ProjectsView.vue')
    },
    {
        path: '/project/:slug',
        name: 'project',
        component: () => import('../views/ProjectView.vue')
    },
    {
        path: '/experience',
        name: 'experience',
        component: () => import('../views/ExperienceView.vue')
    },
    {
        path: '/about_me',
        name: 'about_me',
        component: () => import('../views/AboutMeView.vue')
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/ContactView.vue'),
    },
    {
        path: '/privacy_policy_drinking_games',
        name: 'privacy_policy_drinking_games',
        component: () => import('../views/PrivacyPolicyDrinkingGames.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not_found',
        component: () => import('../views/404View.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        const target = document.getElementById('app');
        if (to.hash) {
            const id = to.hash.replace('#', '');
            // Lazy-loaded views mount async, so the hash target may not exist yet.
            const scrollToHash = (attempt = 0) => {
                const hashContent = document.getElementById(id);
                if (hashContent) {
                    anime({
                        targets: target,
                        scrollTop: hashContent.offsetTop,
                        duration: 1000,
                        easing: 'easeInOutQuad'
                    });
                } else if (attempt < 10) {
                    requestAnimationFrame(() => scrollToHash(attempt + 1));
                }
            };
            scrollToHash();
        } else {
            anime({
                targets: target,
                scrollTop: 0,
                duration: 0,
                easing: 'easeInOutQuad'
            })
        }
    },
})

export default router
