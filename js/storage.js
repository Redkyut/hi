/**
 * SIDE QUEST CONFESSION - STORAGE
 * Safe localStorage wrapper with fallbacks
 */

const Storage = (function () {
    const PREFIX = 'sidequest_';
    let isAvailable = false;

    // Test localStorage availability
    try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        isAvailable = true;
    } catch (e) {
        isAvailable = false;
        console.warn('localStorage not available, preferences will not persist');
    }

    function get(key) {
        if (!isAvailable) return null;
        try {
            const item = localStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    }

    function set(key, value) {
        if (!isAvailable) return false;
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    function remove(key) {
        if (!isAvailable) return false;
        try {
            localStorage.removeItem(PREFIX + key);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Specific preference getters/setters
    function getMusicPreference() {
        return get('musicEnabled');
    }

    function setMusicPreference(enabled) {
        return set('musicEnabled', enabled);
    }

    function getReducedMotion() {
        return get('reducedMotion');
    }

    function setReducedMotion(enabled) {
        return set('reducedMotion', enabled);
    }

    function getQuestProgress() {
        return get('questProgress');
    }

    function setQuestProgress(progress) {
        return set('questProgress', progress);
    }

    function clearQuestProgress() {
        return remove('questProgress');
    }

    // Check system reduced motion preference
    function systemReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return {
        get,
        set,
        remove,
        getMusicPreference,
        setMusicPreference,
        getReducedMotion,
        setReducedMotion,
        getQuestProgress,
        setQuestProgress,
        clearQuestProgress,
        systemReducedMotion,
        get isAvailable() { return isAvailable; }
    };
})();

window.Storage = Storage;
