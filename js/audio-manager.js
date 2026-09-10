/**
 * SIDE QUEST CONFESSION - AUDIO MANAGER
 * Handles all audio with graceful fallbacks
 */

const AudioManager = (function () {
    const AUDIO_PATHS = {
        bgm: 'assets/audio/background-music.mp3',
        click: 'assets/audio/click.mp3',
        correct: 'assets/audio/correct.mp3',
        celebration: 'assets/audio/celebration.mp3'
    };

    let audioCtx = null;
    let bgmElement = null;
    let isEnabled = false;
    let isInitialized = false;
    let loadedFiles = new Set();

    // Check if audio files exist (basic check)
    async function fileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
            return true; // With no-cors we can't check status, assume exists if no error
        } catch (e) {
            return false;
        }
    }

    function init() {
        if (isInitialized) return;

        // Try to load background music
        bgmElement = new Audio();
        bgmElement.loop = true;
        bgmElement.volume = 0.4;
        bgmElement.preload = 'none';

        // Test if audio can play
        bgmElement.addEventListener('canplaythrough', () => {
            loadedFiles.add('bgm');
        }, { once: true });

        bgmElement.addEventListener('error', () => {
            console.warn('Background music not available');
        }, { once: true });

        bgmElement.src = AUDIO_PATHS.bgm;

        isInitialized = true;
    }

    function enable() {
        if (!isInitialized) init();
        isEnabled = true;

        // Try to resume/play background music
        if (bgmElement) {
            bgmElement.play().catch(() => {
                // Autoplay blocked or file missing - silent fail
            });
        }

        Storage.setMusicPreference(true);
        updateToggleIcon();
    }

    function disable() {
        isEnabled = false;

        if (bgmElement) {
            bgmElement.pause();
            bgmElement.currentTime = 0;
        }

        Storage.setMusicPreference(false);
        updateToggleIcon();
    }

    function toggle() {
        if (isEnabled) {
            disable();
        } else {
            enable();
        }
        return isEnabled;
    }

    function playSound(type) {
        if (!isEnabled) return;

        const sound = new Audio();
        sound.volume = 0.5;

        sound.addEventListener('error', () => {
            // Silent fail
        }, { once: true });

        switch (type) {
            case 'click':
                sound.src = AUDIO_PATHS.click;
                break;
            case 'correct':
                sound.src = AUDIO_PATHS.correct;
                break;
            case 'celebration':
                sound.src = AUDIO_PATHS.celebration;
                sound.volume = 0.6;
                break;
            default:
                return;
        }

        sound.play().catch(() => {
            // Silent fail for autoplay restrictions or missing files
        });
    }

    function updateToggleIcon() {
        const toggle = document.getElementById('music-toggle');
        const icon = toggle?.querySelector('.music-icon');
        if (icon) {
            icon.textContent = isEnabled ? '🔊' : '🔇';
        }
        if (toggle) {
            toggle.classList.toggle('playing', isEnabled);
        }
    }

    function loadPreference() {
        const saved = Storage.getMusicPreference();
        if (saved === true) {
            // Don't auto-enable, wait for user interaction
            isEnabled = false;
        }
    }

    // Initialize on script load
    loadPreference();

    return {
        init,
        enable,
        disable,
        toggle,
        playSound,
        get isEnabled() { return isEnabled; }
    };
})();

window.AudioManager = AudioManager;
