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
        path: '/:pathMatch(.*)*',
        name: 'not_found',
        component: () => import('../views/404View.vue')
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        const target = document.getElementById('app');
        if (to.hash) {
            const id = to.hash.replace('#', '');
            const hashContent = document.getElementById(id);
            anime({
                targets: target,
                scrollTop: hashContent.offsetTop,
                duration: 1000,
                easing: 'easeInOutQuad'
            });
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

router.beforeEach((to, from, next) => {
    // Check if route exists
    if (!routes.find(user => user.name === to.name || to.name === undefined)) {
        next({
            name: 'not_found',
            params: {pathMatch: to.path.split('/').slice(1)},
            query: to.query,
            hash: to.hash,
        });
    }
    next();
});

export default router
