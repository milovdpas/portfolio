/**
 * Single shared device check. UA-based on purpose: several components render
 * different markup per branch, so this must not flip on window resize.
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
