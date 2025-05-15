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
        // Force a reflow to ensure the animation plays
        void mainContent.offsetWidth;
        mainContent.setAttribute("data-state", "off");

        setTimeout(() => {
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
 * Initialize menu functionality
 */
function initHamburgerMenu(): void {
  const menuBtn = document.querySelector(".menu-btn");
  const navMenu = document.querySelector("nav ul");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Update button text
      const button = menuBtn as HTMLButtonElement;
      button.textContent = button.classList.contains("active")
        ? "MENU [-]"
        : "MENU [+]";
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !menuBtn.contains(e.target as Node) &&
        !navMenu.contains(e.target as Node)
      ) {
        menuBtn.classList.remove("active");
        navMenu.classList.remove("active");
        const button = menuBtn as HTMLButtonElement;
        button.textContent = "MENU [+]";
      }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("active");
        navMenu.classList.remove("active");
        const button = menuBtn as HTMLButtonElement;
        button.textContent = "MENU [+]";
      });
    });
  }
}

/**
 * Initialize all page functionality after boot
 */
function initPageFunctionality(): void {
  setupPowerButton();
  initCrtEffects();
  initCommandPrompts();
  initHamburgerMenu();
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
  const loadingBar: HTMLElement | null = document.getElementById("loading-bar");

  if (!bootScreen || !mainContent || !loadingBar) return;

  // If visited within 24 hours, skip boot animation
  if (hasVisitedRecently()) {
    bootScreen.style.display = "none";
    mainContent.setAttribute("data-state", "on");
    initPageFunctionality();
    return;
  }

  // Show boot animation for first visit or after 24 hours
  bootScreen.style.display = "flex";
  mainContent.setAttribute("data-state", "off");

  // Reset loading bar
  loadingBar.style.width = "0%";

  // Force a reflow
  void loadingBar.offsetWidth;

  // Start loading animation
  loadingBar.style.width = "100%";

  // After loading completes, show main content
  setTimeout(() => {
    bootScreen.style.display = "none";
    void mainContent.offsetWidth; // Force reflow
    mainContent.setAttribute("data-state", "on");
    initPageFunctionality();
    recordVisit();
  }, 3000);
}

/**
 * Main initialization function on DOM content loaded
 */
function init(): void {
  const mainContent: HTMLElement | null =
    document.getElementById("main-content");
  if (!mainContent) return;

  // Check if we're on a page with boot screen
  const bootScreen: HTMLElement | null = document.getElementById("boot-screen");

  if (bootScreen) {
    // We have a boot screen, handle the sequence
    handleBootSequence();
  } else {
    // No boot screen, ensure main content is visible and initialized
    void mainContent.offsetWidth; // Force reflow
    mainContent.setAttribute("data-state", "on");
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
