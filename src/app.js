"use strict";

const wordsToBeChangedSingular = [
    "LLM",
];

const wordsToBeChangedPlural = [
    "LLMs"
];

function replaceWord(text, word, replacement) {
    const pattern = new RegExp(`\\b${word}\\b`, "gi"); // case‑insensitive whole‑word
    return text.replace(pattern, replacement);
}

function replaceInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let txt = node.nodeValue;

        for (const word of wordsToBeChangedSingular) {
            txt = replaceWord(txt, word, "AI");
        }

        for (const word of wordsToBeChangedPlural) {
            txt = replaceWord(txt, word, "AIs");
        }

        node.nodeValue = txt;
        return;
    }

    // do not touch scripts or styles
    if (
        node.nodeType !== Node.ELEMENT_NODE ||
        ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(node.tagName)
    ) {
        return;
    }

    for (const child of node.childNodes) {
        replaceInNode(child);
    }
}

function handlePageLoad() {
    if (document.title) {
        let newTitle = document.title;

        wordsToBeChangedSingular.forEach(word => {
            newTitle = replaceWord(newTitle, word, "AI");
        });

        wordsToBeChangedPlural.forEach(word => {
            newTitle = replaceWord(newTitle, word, "AIs");
        });

        document.title = newTitle;
    }

    replaceInNode(document.documentElement);
}

function observeLazyLoading() {
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                replaceInNode(node);
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

(() => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            handlePageLoad();
            observeLazyLoading();
        });
    } else {
        handlePageLoad();
        observeLazyLoading();
    }
})();