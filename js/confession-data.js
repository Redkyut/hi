/**
 * SIDE QUEST CONFESSION - DATA
 * Edit this file to customize your confession
 */

const confessionData = {
    // Optional: Add their name if you want
    crushName: "",

    landing: {
        title: "WILL YOU ACCEPT MY SIDE QUEST?",
        subtitle: "I made something a little different for you.",
        reassurance: "Don't worry... it won't take long."
    },

    level1: {
        badge: "LEVEL 01",
        heading: "QUEST OBJECTIVE",
        text: "There's someone I've been thinking about lately...\n\nSomeone who somehow makes ordinary days feel a little better."
    },

    level2: {
        badge: "LEVEL 02",
        intro: "Let's see if you can figure out who I'm talking about...",
        clues: [
            "Someone I genuinely enjoy talking to.",
            "Someone whose presence I notice more than I probably should.",
            "Someone who can make me smile without even trying."
        ],
        guessText: "Any guesses?",
        buttonText: "I THINK I KNOW..."
    },

    level3: {
        badge: "LEVEL 03",
        secrets: [
            "Okay...",
            "I've been trying to figure out how to say this.",
            "So instead of trying to find the perfect words...",
            "I made you a website.",
            "Because apparently this is how I decided to handle my feelings. 😭"
        ],
        buttonText: "CONTINUE"
    },

    level4: {
        badge: "LEVEL 04",
        title: "I HAVE A CONFESSION...",
        mainText: "I LIKE YOU.",
        messages: [
            "Not because I expect anything from you.",
            "I just wanted you to know how I feel.",
            "You've become someone special to me."
        ],
        prompt: {
            objective: "QUEST OBJECTIVE",
            subtext: "Tell me what you think.",
            buttonText: "I'M READY"
        }
    },

    level5: {
        badge: "LEVEL 05",
        heading: "QUEST COMPLETE?",
        intro: "I've said my part...\nNow it's completely up to you.",
        choices: {
            yes: {
                icon: "❤️",
                label: "I LIKE YOU TOO"
            },
            maybe: {
                icon: "🤍",
                label: "I NEED SOME TIME TO THINK"
            },
            friend: {
                icon: "🙂",
                label: "I ONLY SEE YOU AS A FRIEND"
            }
        }
    },

    responseYes: {
        badge: "QUEST COMPLETE!",
        hearts: "❤️❤️❤️",
        messages: [
            "WAIT... REALLY?!",
            "You just made this entire website worth it.",
            "Looks like this side quest had a pretty good ending. ❤️"
        ],
        playAgainText: "BACK TO MENU"
    },

    responseMaybe: {
        messages: [
            "That's completely okay. 🤍",
            "You don't have to answer right away.",
            "I meant what I said, and I respect whatever you feel.",
            "Take your time."
        ],
        backText: "BACK TO MENU"
    },

    responseFriend: {
        messages: [
            "That's okay. 🙂",
            "Thank you for being honest with me.",
            "I'd rather know how you genuinely feel than make you uncomfortable.",
            "No pressure.",
            "No awkwardness.",
            "You're still someone I appreciate."
        ],
        backText: "BACK TO MENU"
    }
};

// Make available globally
window.confessionData = confessionData;
