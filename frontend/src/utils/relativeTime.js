import i18n from '@/i18n';

// Largest-first so we pick the biggest sensible unit for the gap.
const UNITS = [
    ['year', 365],
    ['month', 30],
    ['week', 7],
    ['day', 1],
];

/**
 * Localized "3 months ago" / "3 maanden geleden" for a YYYY-MM-DD date,
 * using the browser's Intl.RelativeTimeFormat (handles locale + plurals).
 * Follows the current i18n locale.
 */
export function relativeTime(dateString) {
    if (!dateString) {
        return '';
    }
    const then = new Date(dateString).getTime();
    if (Number.isNaN(then)) {
        return '';
    }
    const days = Math.floor((Date.now() - then) / 86400000);
    const locale = i18n.global.locale;
    if (days < 1) {
        // "today" / "vandaag"
        return new Intl.RelativeTimeFormat(locale, {numeric: 'auto'}).format(0, 'day');
    }
    const rtf = new Intl.RelativeTimeFormat(locale, {numeric: 'always'});
    for (const [unit, inDays] of UNITS) {
        if (days >= inDays) {
            return rtf.format(-Math.round(days / inDays), unit);
        }
    }
    return rtf.format(-days, 'day');
}
