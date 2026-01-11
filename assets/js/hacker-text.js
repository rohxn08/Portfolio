
/**
 * Applies a "Hacker Text" decoding animation to a DOM element.
 * 
 * @param {HTMLElement} element - The DOM element to animate.
 * @param {string} finalText - The final text to display.
 * @param {number} duration - Total duration of the animation in ms.
 * @param {number} delay - Delay before starting in ms.
 */
function animateHackerText(element, finalText, duration = 1500, delay = 0) {
    if (!element) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    const startTime = Date.now() + delay;
    const endTime = startTime + duration;

    // We'll update the text ~30 times a second
    const intervalTime = 30;
    let interval;

    // Initially hide or set to random to prevent flash
    // element.textContent = ""; 

    setTimeout(() => {
        interval = setInterval(() => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Determine how many characters should be "fixed" (solved)
            // progress goes 0 -> 1. 
            // We want the solved count to go from 0 -> length
            const solvedCount = Math.floor(progress * finalText.length);

            let output = "";
            for (let i = 0; i < finalText.length; i++) {
                if (i < solvedCount) {
                    output += finalText[i];
                } else {
                    // Random char
                    output += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            element.textContent = output;

            if (progress >= 1) {
                clearInterval(interval);
                element.textContent = finalText; // Ensure exact match at end
            }
        }, intervalTime);
    }, delay);
}

// Expose it globally or attach to the main init flow
window.animateHackerText = animateHackerText;
