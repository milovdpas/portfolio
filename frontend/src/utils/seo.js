/**
 * Lightweight per-page SEO for the client-rendered SPA.
 *
 * The app ships a single index.html with one static <title>/description/og:title,
 * so every route would otherwise share the same tags. Project blog pages call
 * setPageMeta() to give each project a unique title, description, canonical URL
 * and Open Graph / Twitter card (using the project banner as the share image),
 * and resetPageMeta() on leave to restore the site defaults.
 *
 * Modern crawlers (Googlebot) render JS, so updating these on navigation gives
 * each blog its own title/snippet in search results and correct link previews.
 */

const SITE_NAME = 'Milo van der Pas';

// The site's original tags, captured once so we can restore them on leave.
let defaults = null;
// Tags this module added (not present in index.html) so we can remove them again.
const ADDED_META = [
    ['property', 'og:description'],
    ['property', 'og:image'],
    ['property', 'og:url'],
    ['property', 'og:type'],
    ['name', 'twitter:card'],
    ['name', 'twitter:title'],
    ['name', 'twitter:description'],
    ['name', 'twitter:image'],
];

function metaEl(attr, key) {
    return document.head.querySelector(`meta[${attr}="${key}"]`);
}

function readMeta(attr, key) {
    return metaEl(attr, key)?.getAttribute('content') ?? '';
}

function writeMeta(attr, key, content) {
    let el = metaEl(attr, key);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function removeMeta(attr, key) {
    metaEl(attr, key)?.remove();
}

function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function captureDefaults() {
    if (defaults) return;
    defaults = {
        title: document.title,
        description: readMeta('name', 'description'),
        ogTitle: readMeta('property', 'og:title'),
    };
}

export function setPageMeta({title, description, image, url}) {
    captureDefaults();
    const fullTitle = title ? `${title} | ${SITE_NAME}` : defaults.title;
    document.title = fullTitle;
    writeMeta('property', 'og:title', fullTitle);
    writeMeta('name', 'twitter:title', fullTitle);
    writeMeta('property', 'og:type', 'article');
    if (description) {
        writeMeta('name', 'description', description);
        writeMeta('property', 'og:description', description);
        writeMeta('name', 'twitter:description', description);
    }
    if (image) {
        writeMeta('property', 'og:image', image);
        writeMeta('name', 'twitter:image', image);
        writeMeta('name', 'twitter:card', 'summary_large_image');
    } else {
        writeMeta('name', 'twitter:card', 'summary');
    }
    if (url) {
        writeMeta('property', 'og:url', url);
        setCanonical(url);
    }
}

export function resetPageMeta() {
    if (!defaults) return;
    document.title = defaults.title;
    writeMeta('name', 'description', defaults.description);
    writeMeta('property', 'og:title', defaults.ogTitle);
    ADDED_META.forEach(([attr, key]) => removeMeta(attr, key));
    document.head.querySelector('link[rel="canonical"]')?.remove();
}
