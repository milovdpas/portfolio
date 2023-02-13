import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ExperienceView from '../views/ExperienceView.vue'
import AboutMeView from '../views/AboutMeView.vue'
import ContactView from '../views/ContactView.vue'
import NotFoundView from '../views/404View.vue'

const routes = [
    {
        path: '/',
        name: 'default',
        component: HomeView
    },
    {
        path: '/home',
        name: 'home',
        component: HomeView
    },
    {
        path: '/projects',
        name: 'projects',
        component: ProjectsView
    },
    {
        path: '/experience',
        name: 'experience',
        component: ExperienceView
    },
    {
        path: '/about_me',
        name: 'about_me',
        component: AboutMeView
    },
    {
        path: '/contact',
        name: 'contact',
        component: ContactView,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not_found',
        component: NotFoundView
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return {top: 0}
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
