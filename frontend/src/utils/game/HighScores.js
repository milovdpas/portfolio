/**
 * Tiny localStorage wrapper for game high scores.
 * try/catch everywhere: localStorage can throw in private browsing.
 */
const PREFIX = 'portfolio.games.';

export function getHighScore(key) {
    try {
        return Number(localStorage.getItem(PREFIX + key)) || 0;
    } catch (e) {
        return 0;
    }
}

/** Stores the value if it beats the current best; returns true when it did. */
export function submitHighScore(key, value) {
    const best = getHighScore(key);
    if (value <= best) {
        return false;
    }
    return setScore(key, value);
}

/** Unconditional store, for scores where lower is better (e.g. finish times). */
export function setScore(key, value) {
    try {
        localStorage.setItem(PREFIX + key, String(value));
        return true;
    } catch (e) {
        return false;
    }
}
