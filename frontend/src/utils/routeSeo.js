/**
 * Centralised per-route SEO. Wired into the router (afterEach) and a locale
 * watcher in router/index.js, so every navigation and language switch sets the
 * right title/description/OG/canonical for the current page:
 *  - project blogs get their own title, description and banner as the OG image;
 *  - the static pages (home/projects/experience/about/contact) get titles and
 *    descriptions from the i18n `seo` catalog;
 *  - anything else falls back to the site defaults.
 */
import i18n, {localized} from '@/i18n';
import {getProject} from '@/data/projects';
import {setPageMeta, resetPageMeta, withSiteName, SITE_NAME} from '@/utils/seo';

// Route name -> i18n `seo` key for the static pages.
const PAGE_SEO = {
    default: 'home',
    home: 'home',
    projects: 'projects',
    experience: 'experience',
    about_me: 'about',
    contact: 'contact',
};

function currentUrl(route) {
    return window.location.origin + route.path;
}

export function applyRouteSeo(route) {
    if (!route || !route.name) {
        resetPageMeta();
        return;
    }

    if (route.name === 'project') {
        const project = getProject(route.params.slug);
        if (project) {
            setPageMeta({
                title: withSiteName(localized(project.title)),
                description: localized(project.description),
                image: project.image,
                url: currentUrl(route),
                type: 'article',
            });
        } else {
            resetPageMeta();
        }
        return;
    }

    const key = PAGE_SEO[route.name];
    if (key) {
        const segment = i18n.global.t(`seo.${key}.title`);
        // Home reads name-first ("Milo van der Pas | Software developer"); the
        // other pages read "<Page> | Milo van der Pas".
        const title = key === 'home' ? `${SITE_NAME} | ${segment}` : withSiteName(segment);
        setPageMeta({
            title,
            description: i18n.global.t(`seo.${key}.description`),
            url: currentUrl(route),
            type: 'website',
        });
        return;
    }

    // 404, privacy policy, or anything unmapped: fall back to the site defaults.
    resetPageMeta();
}
