const destination = document.getElementById('terminal');
const speed = 10; // ms between ticks
const charsPerTick = 5;

let fullText = '';
let i = 0;
let typing = false;
let timeoutId = null;

// Cursor state
let cursorInterval = null;
let cursorState = 0; // 0 -> first char, 1 -> second char
const cursorChars = ['\u263A', '\u263B'];

function setDestinationHtml(html) {
    // append cursor span
    destination.innerHTML = html + '<span id="typing-cursor">' + cursorChars[cursorState] + '</span>';
}

function stopTyping() {
    typing = false;
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
}

function startCursorBlink() {
    if (cursorInterval) return; // already running
    cursorInterval = setInterval(() => {
        cursorState = 1 - cursorState; // toggle
        const el = document.getElementById('typing-cursor');
        if (el) el.textContent = cursorChars[cursorState];
    }, 500);
}

function typeWriter() {
    if (!typing) return;
    if (i < fullText.length) {
        let nextIndex = i + charsPerTick;
        if (nextIndex > fullText.length) nextIndex = fullText.length;
        const lastOpen = fullText.substring(0, nextIndex).lastIndexOf('<');
        const lastClose = fullText.substring(0, nextIndex).lastIndexOf('>');
        if (lastOpen > lastClose) {
            const closing = fullText.indexOf('>', lastOpen);
            if (closing !== -1) nextIndex = closing + 1;
        }
        i = nextIndex;
        setDestinationHtml(fullText.substring(0, i));
        timeoutId = setTimeout(typeWriter, speed);
    } else {
        // finished typing, keep cursor blinking
        typing = false;
        timeoutId = null;
    }
}

function typeSectionById(id) {
    const section = document.getElementById(id);
    if (!section) return;
    stopTyping();
    fullText = section.innerHTML;
    i = 0;
    setDestinationHtml('');
    typing = true;
    startCursorBlink();
    typeWriter();
}

// Wire up buttons
window.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.control-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-section');
            typeSectionById(id);
        });
    });
    startCursorBlink();
    // start with the first section optionally
    const first = document.querySelector('.control-button');
    if (first) first.click();
});
