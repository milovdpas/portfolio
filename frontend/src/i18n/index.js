import {createI18n} from 'vue-i18n';

import en from './en.json';
import nl from './nl.json';

export const locales = ['en', 'nl'];

const STORAGE_KEY = 'locale';

function resolveLocale() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (locales.includes(stored)) {
            return stored;
        }
    } catch (e) {
        // localStorage unavailable (private mode) — fall through to navigator.
    }
    return navigator.language && navigator.language.toLowerCase().startsWith('nl') ? 'nl' : 'en';
}

const i18n = createI18n({
    locale: resolveLocale(),
    fallbackLocale: 'en',
    // Some messages intentionally contain HTML (rendered with v-html).
    warnHtmlInMessage: 'off',
    messages: {en, nl},
});

export function setLocale(locale) {
    if (!locales.includes(locale)) {
        return;
    }
    i18n.global.locale = locale;
    try {
        localStorage.setItem(STORAGE_KEY, locale);
    } catch (e) {
        // Persisting is best-effort.
    }
}

/**
 * Resolve a per-locale text field from a JS data module,
 * e.g. localized({en: 'Hello', nl: 'Hallo'}) -> current locale's text.
 * Falls back to English when the current locale has no entry.
 */
export function localized(field) {
    if (field === null || typeof field !== 'object') {
        return field;
    }
    return field[i18n.global.locale] ?? field.en;
}

export default i18n;
