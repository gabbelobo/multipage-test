/**
 * Retro CRT Portfolio Website Main Script
 * TypeScript implementation with proper typings
 */

/**
 * Initialize the page with CRT effects and animations
 */
function initCrtEffects(): void {
  // Random CRT flicker effect
  setInterval(() => {
    if (Math.random() > 0.97) {
      document.body.style.opacity = "0.9";
      setTimeout(() => {
        document.body.style.opacity = "1";
      }, 50);
    }
  }, 2000);
}

/**
 * Handle power button click event - "turn off" screen and redirect
 */
function setupPowerButton(): void {
  const powerBtn: HTMLElement | null = document.getElementById("power-btn");
  if (powerBtn) {
    powerBtn.addEventListener("click", () => {
      const mainContent: HTMLElement | null =
        document.getElementById("main-content");
      if (mainContent) {
        mainContent.classList.add("screen-off");

        setTimeout(() => {
          // Clear the lastVisit from localStorage to reset boot animation
          localStorage.removeItem("lastVisit");
          window.location.href = "/";
        }, 400);
      }
    });
  }
}

/**
 * Run typewriter effect on command prompt elements
 * @param element - The HTML element to apply the effect to
 * @param text - The text to type
 * @param index - Current character index
 * @param speed - Typing speed in milliseconds
 */
function typeWriter(
  element: HTMLElement,
  text: string,
  index: number = 0,
  speed: number = 70
): void {
  if (index < text.length) {
    element.innerHTML =
      text.substring(0, index + 1) + '<span class="blink">_</span>';
    setTimeout(() => typeWriter(element, text, index + 1, speed), speed);
  } else {
    // When typing is complete, remove the blinking cursor
    element.innerHTML = text;
  }
}

/**
 * Initialize all command prompts with typewriter effect
 */
function initCommandPrompts(): void {
  const commandPrompts: NodeListOf<HTMLElement> =
    document.querySelectorAll(".command-prompt");
  commandPrompts.forEach((prompt) => {
    if (!prompt.classList.contains("processed")) {
      const originalText: string = prompt.innerText;
      prompt.innerHTML = '<span class="blink">_</span>';
      prompt.classList.add("processed");

      // Start typing after a delay
      setTimeout(() => {
        typeWriter(prompt, originalText);
      }, 1000);
    }
  });
}

/**
 * Initialize all page functionality after boot
 */
function initPageFunctionality(): void {
  setupPowerButton();
  initCrtEffects();
  initCommandPrompts();
}

/**
 * Check if user has visited in last 24 hours
 * @returns Boolean indicating if this is a recent visit
 */
function hasVisitedRecently(): boolean {
  const lastVisit: string | null = localStorage.getItem("lastVisit");
  const currentTime: number = new Date().getTime();
  const twentyFourHours: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  return (
    !!lastVisit && currentTime - parseInt(lastVisit, 10) <= twentyFourHours
  );
}

/**
 * Record the current visit time in localStorage
 */
function recordVisit(): void {
  const currentTime: number = new Date().getTime();
  localStorage.setItem("lastVisit", currentTime.toString());
}

/**
 * Handle boot sequence animation
 */
function handleBootSequence(): void {
  const bootScreen: HTMLElement | null = document.getElementById("boot-screen");
  const mainContent: HTMLElement | null =
    document.getElementById("main-content");

  if (!bootScreen || !mainContent) return;

  // If recent visit, skip boot animation
  if (hasVisitedRecently()) {
    bootScreen.style.display = "none";
    mainContent.style.display = "block";
    initPageFunctionality();
    return;
  }

  // Show boot animation for first visit or after 24 hours
  const loadingBar: HTMLElement | null = document.getElementById("loading-bar");
  if (!loadingBar) return;

  // Show boot screen
  bootScreen.style.display = "flex";
  mainContent.style.display = "none";

  // Simulate loading
  loadingBar.style.width = "100%";

  // After loading completes, show main content
  setTimeout(() => {
    bootScreen.style.display = "none";
    mainContent.style.display = "block";
    mainContent.classList.add("screen-on");
    initPageFunctionality();

    // Store current time as last visit
    recordVisit();
  }, 3000);
}

/**
 * Main initialization function on DOM content loaded
 */
function init(): void {
  // Check if we're on the index page with boot screen
  const bootScreen: HTMLElement | null = document.getElementById("boot-screen");

  if (bootScreen) {
    handleBootSequence();
  } else {
    // For pages other than index that don't have boot screen
    initPageFunctionality();
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);

// Export functions for potential use in other modules
export {
  initCrtEffects,
  setupPowerButton,
  typeWriter,
  initCommandPrompts,
  initPageFunctionality,
};
