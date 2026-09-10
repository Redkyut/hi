/**
 * SIDE QUEST CONFESSION - MAIN APPLICATION
 * Game state, level management, and user flow
 */

const App = (function () {
    // DOM References
    const screens = {
        landing: document.getElementById('screen-landing'),
        level1: document.getElementById('screen-level-1'),
        level2: document.getElementById('screen-level-2'),
        level3: document.getElementById('screen-level-3'),
        level4: document.getElementById('screen-level-4'),
        level5: document.getElementById('screen-level-5'),
        responseYes: document.getElementById('screen-response-yes'),
        responseMaybe: document.getElementById('screen-response-maybe'),
        responseFriend: document.getElementById('screen-response-friend')
    };

    const hud = document.getElementById('hud');
    const progressBar = document.getElementById('progress-bar');
    const levelIndicator = document.getElementById('level-indicator');

    // Game State
    const gameState = {
        currentLevel: 0,
        musicEnabled: false,
        response: null
    };

    // Level configurations
    const levels = [
        { id: 'landing', screen: screens.landing, hasHud: false },
        { id: 'level1', screen: screens.level1, hasHud: true },
        { id: 'level2', screen: screens.level2, hasHud: true },
        { id: 'level3', screen: screens.level3, hasHud: true },
        { id: 'level4', screen: screens.level4, hasHud: true },
        { id: 'level5', screen: screens.level5, hasHud: true }
    ];

    // Initialize
    function init() {
        // Setup particles
        Particles.init();

        // Setup audio
        AudioManager.init();

        // Setup event listeners
        setupEventListeners();

        // Setup music toggle
        setupMusicToggle();

        // Check for saved progress
        checkSavedProgress();

        // Populate static content
        populateContent();
    }

    function setupEventListeners() {
        // Landing
        document.getElementById('btn-start')?.addEventListener('click', () => {
            AudioManager.playSound('click');
            startQuest();
        });

        // Level 1
        document.getElementById('btn-next-1')?.addEventListener('click', () => {
            AudioManager.playSound('click');
            goToLevel(2);
        });

        // Level 2
        document.getElementById('btn-next-2')?.addEventListener('click', () => {
            AudioManager.playSound('click');
            goToLevel(3);
        });

        // Level 3
        document.getElementById('btn-next-3')?.addEventListener('click', () => {
            AudioManager.playSound('click');
            goToLevel(4);
        });

        // Level 4
        document.getElementById('btn-next-4')?.addEventListener('click', () => {
            AudioManager.playSound('click');
            goToLevel(5);
        });

        // Level 5 choices
        document.getElementById('choice-yes')?.addEventListener('click', () => {
            handleResponse('yes');
        });

        document.getElementById('choice-maybe')?.addEventListener('click', () => {
            handleResponse('maybe');
        });

        document.getElementById('choice-friend')?.addEventListener('click', () => {
            handleResponse('friend');
        });

        // Play again
        document.getElementById('btn-play-again-yes')?.addEventListener('click', () => {
            resetGame();
        });

        // Back to menu
        document.getElementById('btn-back-maybe')?.addEventListener('click', () => {
            resetGame();
        });

        document.getElementById('btn-back-friend')?.addEventListener('click', () => {
            resetGame();
        });
    }

    function setupMusicToggle() {
        const toggle = document.getElementById('music-toggle');
        toggle?.addEventListener('click', () => {
            const enabled = AudioManager.toggle();
            gameState.musicEnabled = enabled;
        });

        // Update initial icon
        const saved = Storage.getMusicPreference();
        if (saved === true) {
            // Don't auto-play, just update UI state
            // User must click to enable
        }
    }

    function checkSavedProgress() {
        const saved = Storage.getQuestProgress();
        if (saved && saved.currentLevel > 0) {
            // Optionally resume, but for this experience, fresh start is better
            // Storage.clearQuestProgress();
        }
    }

    function populateContent() {
        const data = window.confessionData;

        // Level 1
        const typewriter1 = document.getElementById('typewriter-1');
        if (typewriter1) typewriter1.dataset.text = data.level1.text;

        // Level 2 clues
        const clueCards = document.querySelectorAll('.clue-card');
        data.level2.clues.forEach((clue, i) => {
            if (clueCards[i]) {
                clueCards[i].querySelector('.clue-text').textContent = clue;
            }
        });

        document.querySelector('.clue-guess').textContent = data.level2.guessText;

        // Level 3 secrets
        data.level3.secrets.forEach((secret, i) => {
            const el = document.getElementById(`secret-${i + 1}`);
            if (el) el.dataset.text = secret;
        });

        // Level 4
        const confessionMain = document.getElementById('confession-main');
        if (confessionMain) confessionMain.dataset.text = data.level4.mainText;

        const confessionMessage = document.getElementById('confession-message');
        if (confessionMessage) {
            confessionMessage.innerHTML = data.level4.messages.map(m => `<p>${m}</p>`).join('');
        }

        // Response yes
        data.responseYes.messages.forEach((msg, i) => {
            const el = document.getElementById(`yes-${i + 1}`);
            if (el) el.textContent = msg;
        });
    }

    function updateHud(level) {
        if (level === 0) {
            hud.classList.add('hidden');
            return;
        }

        hud.classList.remove('hidden');
        const progress = (level / 5) * 100;
        progressBar.style.width = `${progress}%`;
        levelIndicator.textContent = `LEVEL 0${level} / 05`;
    }

    function startQuest() {
        Storage.setQuestProgress({ currentLevel: 1 });
        goToLevel(1);
    }

    async function goToLevel(levelNum) {
        const prevLevel = levels[gameState.currentLevel];
        const nextLevel = levels[levelNum];

        if (!nextLevel) return;

        gameState.currentLevel = levelNum;
        Storage.setQuestProgress({ currentLevel: levelNum });

        updateHud(levelNum);

        // Transition screens
        if (prevLevel && prevLevel.screen) {
            await Animations.transitionScreens(prevLevel.screen, nextLevel.screen);
        } else {
            nextLevel.screen.classList.remove('hidden');
            nextLevel.screen.classList.add('active');
            await Animations.slideIn(nextLevel.screen, 'up', 600);
        }

        // Run level-specific animations
        runLevelAnimations(levelNum);
    }

    async function runLevelAnimations(level) {
        switch (level) {
            case 1:
                await runLevel1();
                break;
            case 2:
                await runLevel2();
                break;
            case 3:
                await runLevel3();
                break;
            case 4:
                await runLevel4();
                break;
            case 5:
                await runLevel5();
                break;
        }
    }

    async function runLevel1() {
        const text = document.getElementById('typewriter-1')?.dataset.text || '';
        await Animations.typewriter(document.getElementById('typewriter-1'), text, 55);

        const btn = document.getElementById('btn-next-1');
        await Animations.fadeIn(btn, 500);
    }

    async function runLevel2() {
        const clues = [
            document.getElementById('clue-1'),
            document.getElementById('clue-2'),
            document.getElementById('clue-3')
        ];

        // Reveal clues one by one
        for (let i = 0; i < clues.length; i++) {
            await new Promise(r => setTimeout(r, 400));
            await Animations.slideIn(clues[i], 'up', 500);
            AudioManager.playSound('correct');
        }

        await new Promise(r => setTimeout(r, 600));
        await Animations.fadeIn(document.getElementById('clue-guess'), 400);
        await Animations.fadeIn(document.getElementById('btn-next-2'), 400);
    }

    async function runLevel3() {
        const secrets = [
            document.getElementById('secret-1'),
            document.getElementById('secret-2'),
            document.getElementById('secret-3'),
            document.getElementById('secret-4')
        ];

        for (let i = 0; i < secrets.length; i++) {
            const text = secrets[i]?.dataset.text || '';
            await new Promise(r => setTimeout(r, i === 0 ? 300 : 800));
            await Animations.typewriter(secrets[i], text, 60);
        }

        await new Promise(r => setTimeout(r, 500));
        await Animations.fadeIn(document.getElementById('btn-next-3'), 400);
    }

    async function runLevel4() {
        // Dim background effects
        document.getElementById('starfield').style.opacity = '0.4';

        await new Promise(r => setTimeout(r, 400));

        // Reveal main confession
        const mainText = document.getElementById('confession-main')?.dataset.text || '';
        await Animations.typewriter(document.getElementById('confession-main'), mainText, 80);

        await new Promise(r => setTimeout(r, 600));

        // Show message
        await Animations.fadeIn(document.getElementById('confession-message'), 600);

        await new Promise(r => setTimeout(r, 800));

        // Show heart
        await Animations.scaleIn(document.getElementById('confession-heart'), 500);

        // Start floating hearts
        Particles.createHearts({ count: 8, duration: 8000 });

        await new Promise(r => setTimeout(r, 1000));

        // Show prompt
        await Animations.fadeIn(document.getElementById('confession-prompt'), 500);
    }

    async function runLevel5() {
        // Restore background
        document.getElementById('starfield').style.opacity = '1';

        const cards = document.querySelectorAll('.choice-card');
        await Animations.staggerReveal(Array.from(cards), 150);
    }

    async function handleResponse(type) {
        gameState.response = type;
        Storage.setQuestProgress({ currentLevel: 5, response: type });

        let targetScreen;

        switch (type) {
            case 'yes':
                AudioManager.playSound('celebration');
                targetScreen = screens.responseYes;
                break;
            case 'maybe':
                AudioManager.playSound('click');
                targetScreen = screens.responseMaybe;
                break;
            case 'friend':
                AudioManager.playSound('click');
                targetScreen = screens.responseFriend;
                break;
        }

        // Hide HUD
        hud.classList.add('hidden');

        // Transition
        await Animations.transitionScreens(screens.level5, targetScreen);

        // Run response animations
        if (type === 'yes') {
            await runYesResponse();
        }
    }

    async function runYesResponse() {
        // Celebration effects
        Particles.createConfetti({ count: 60, duration: 5000 });
        Particles.createHearts({ count: 20, duration: 10000 });

        // Reveal messages with delays
        const messages = [
            document.getElementById('yes-1'),
            document.getElementById('yes-2'),
            document.getElementById('yes-3')
        ];

        for (let i = 0; i < messages.length; i++) {
            await new Promise(r => setTimeout(r, i === 0 ? 400 : 800));
            await Animations.slideIn(messages[i], 'up', 500);
        }

        await new Promise(r => setTimeout(r, 600));
        await Animations.fadeIn(document.getElementById('btn-play-again-yes'), 500);
    }

    async function resetGame() {
        AudioManager.playSound('click');

        // Clear progress
        Storage.clearQuestProgress();

        // Reset state
        gameState.currentLevel = 0;
        gameState.response = null;

        // Hide all response screens
        Object.values(screens).forEach(screen => {
            if (screen && screen !== screens.landing) {
                screen.classList.remove('active');
                screen.classList.add('hidden');

                // Reset internal elements
                screen.querySelectorAll('.hidden-by-anim').forEach(el => {
                    el.classList.add('hidden');
                });
            }
        });

        // Reset level 4 background opacity
        document.getElementById('starfield').style.opacity = '1';

        // Clear particles
        document.getElementById('particle-layer').innerHTML = '';

        // Reset confession elements
        const confessionMain = document.getElementById('confession-main');
        if (confessionMain) confessionMain.classList.add('hidden');

        const confessionMessage = document.getElementById('confession-message');
        if (confessionMessage) confessionMessage.classList.add('hidden');

        const confessionHeart = document.getElementById('confession-heart');
        if (confessionHeart) confessionHeart.classList.add('hidden');

        const confessionPrompt = document.getElementById('confession-prompt');
        if (confessionPrompt) confessionPrompt.classList.add('hidden');

        // Reset yes response
        document.getElementById('yes-1')?.classList.add('hidden');
        document.getElementById('yes-2')?.classList.add('hidden');
        document.getElementById('yes-3')?.classList.add('hidden');
        document.getElementById('btn-play-again-yes')?.classList.add('hidden');

        // Reset typewriters
        document.getElementById('typewriter-1').textContent = '';

        // Reset clues
        document.querySelectorAll('.clue-card').forEach(c => c.classList.add('hidden'));
        document.getElementById('clue-guess')?.classList.add('hidden');
        document.getElementById('btn-next-2')?.classList.add('hidden');

        // Reset secrets
        document.querySelectorAll('.secret-line').forEach(s => {
            s.classList.add('hidden');
            s.textContent = '';
        });
        document.getElementById('btn-next-3')?.classList.add('hidden');

        // Reset buttons
        document.getElementById('btn-next-1')?.classList.add('hidden');

        // Hide HUD
        hud.classList.add('hidden');
        progressBar.style.width = '0%';

        // Go to landing
        screens.landing.classList.remove('hidden');
        screens.landing.classList.add('active');
        await Animations.fadeIn(screens.landing, 600);
    }

    // Start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        getState: () => ({ ...gameState }),
        goToLevel,
        resetGame
    };
})();

window.App = App;
