
// ===================================
// 1. Mobile navigation menu
// ===================================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

// Close the mobile menu after a navigation link is selected.

navItems.forEach(function (link) {
    link.addEventListener("click", closeMenu);
});


// ===================================
// 2. Dark and light theme toggle
// ===================================

const themeToggle = document.getElementById("theme-toggle");

function updateThemeButton() {
    const isLight = document.body.classList.contains("light-theme");

    themeToggle.textContent = isLight ? "☾" : "☀";

    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );

    themeToggle.setAttribute("aria-pressed", String(isLight));
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    updateThemeButton();
});

// Set the correct button label when the page first loads.

updateThemeButton();


// ===================================
// 3. Active navigation indicator
// ===================================

const pageSections = document.querySelectorAll("main section[id]");

function setActiveLink(sectionId) {
    navItems.forEach(function (link) {
        const isActive = link.getAttribute("href") === "#" + sectionId;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        function (entries) {
            const visibleSections = entries
                .filter(function (entry) {
                    return entry.isIntersecting;
                })
                .sort(function (a, b) {
                    return b.intersectionRatio - a.intersectionRatio;
                });

            if (visibleSections.length > 0) {
                setActiveLink(visibleSections[0].target.id);
            }
        },
        {
            rootMargin: "-20% 0px -55% 0px",
            threshold: [0, 0.1, 0.25, 0.5]
        }
    );

    pageSections.forEach(function (section) {
        sectionObserver.observe(section);
    });
} else {
    // Fallback for browsers without IntersectionObserver.

    window.addEventListener("scroll", function () {
        let currentSection = "home";

        pageSections.forEach(function (section) {
            if (section.getBoundingClientRect().top < window.innerHeight * 0.4) {
                currentSection = section.id;
            }
        });

        setActiveLink(currentSection);
    });
}


// ===================================
// 4. Project category filter
// ===================================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectCount = document.getElementById("project-count");

function filterProjects(category) {
    let visibleCount = 0;

    projectCards.forEach(function (card) {
        const cardCategory = card.dataset.category;

        const shouldShow =
            category === "all" || cardCategory === category;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }
    });

    projectCount.textContent =
        "Showing " + visibleCount +
        (visibleCount === 1 ? " project" : " projects");
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedCategory = button.dataset.filter;

        filterButtons.forEach(function (item) {
            const isSelected = item === button;

            item.classList.toggle("active", isSelected);
            item.setAttribute("aria-pressed", String(isSelected));
        });

        filterProjects(selectedCategory);
    });
});


// ===================================
// 5. Contact form validation
// ===================================

// The contact form was replaced with an Email Me link.
// Only run form validation if a contact form exists.

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    const formStatus = document.getElementById("form-status");

    function showFieldError(field, message) {
        const errorElement = document.getElementById(field.id + "-error");

        if (!errorElement) return;

        errorElement.textContent = message;
        field.setAttribute("aria-invalid", String(message !== ""));
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const message = document.getElementById("message");

        let isValid = true;
        let firstInvalidField = null;

        formStatus.textContent = "";
        formStatus.classList.remove("error");

        if (name.value.trim() === "") {
            showFieldError(name, "Please enter your name.");
            isValid = false;
            firstInvalidField ??= name;
        } else {
            showFieldError(name, "");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.value.trim())) {
            showFieldError(email, "Please enter a valid email address.");
            isValid = false;
            firstInvalidField ??= email;
        } else {
            showFieldError(email, "");
        }

        if (message.value.trim() === "") {
            showFieldError(message, "Please enter a message.");
            isValid = false;
            firstInvalidField ??= message;
        } else {
            showFieldError(message, "");
        }

        if (!isValid) {
            formStatus.textContent =
                "Please correct the highlighted fields.";
            formStatus.classList.add("error");
            firstInvalidField.focus();
            return;
        }

        formStatus.textContent =
            "Validation successful! This demo does not send messages.";

        contactForm.reset();
    });

    contactForm.querySelectorAll("input, textarea").forEach(function (field) {
        field.addEventListener("input", function () {
            showFieldError(field, "");
            formStatus.textContent = "";
            formStatus.classList.remove("error");
        });
    });
}

// ===================================
// 6. Back-to-top button
// ===================================

const backToTop = document.getElementById("back-to-top");

function updateBackToTopButton() {
    backToTop.hidden = window.scrollY < 350;
}

window.addEventListener("scroll", updateBackToTopButton, {
    passive: true
});

backToTop.addEventListener("click", function () {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
    });
});

updateBackToTopButton();


// ===================================
// Extra: Automatically update the year
// ===================================

document.getElementById("current-year").textContent =
    new Date().getFullYear();



// ===================================
// 7. Typing animation
// ===================================

const typingText = document.getElementById("typing-text");

if (typingText) {
    const typingWords = [
        "Multimedia Computing Student",
        "Aspiring Developer",
        "Technology Enthusiast",
        "UI/UX Learner"
    ];

    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeNextCharacter() {
        const currentWord = typingWords[wordIndex];

        if (deleting) {
            characterIndex--;
        } else {
            characterIndex++;
        }

        typingText.textContent =
            currentWord.substring(0, characterIndex);

        let delay = deleting ? 50 : 100;

        if (!deleting && characterIndex === currentWord.length) {
            deleting = true;
            delay = 1200;
        } else if (deleting && characterIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % typingWords.length;
            delay = 300;
        }

        setTimeout(typeNextCharacter, delay);
    }

    typeNextCharacter();
} else {
    console.error("Typing animation: #typing-text was not found.");
}



// Add a View Details button to each project card.

// Create the project details popup.

const projectDialog = document.createElement("dialog");
projectDialog.className = "project-dialog";
projectDialog.setAttribute("aria-labelledby", "dialog-title");

projectDialog.innerHTML = `
    <div class="dialog-header">
        <div>
            <p class="dialog-category" id="dialog-category"></p>
            <h2 id="dialog-title">Project Details</h2>
        </div>

        <button
            class="dialog-close"
            id="dialog-close"
            type="button"
            aria-label="Close project details">
            &times;
        </button>
    </div>

    <p class="dialog-description" id="dialog-description"></p>

    <p class="dialog-tech">
        <strong>Technologies:</strong>
        <span id="dialog-technologies"></span>
    </p>

    <button
        class="button button-primary dialog-close-bottom"
        id="dialog-close-bottom"
        type="button">
        Close
    </button>
`;

document.body.appendChild(projectDialog);
projectCards.forEach(function (card) {
    const detailsButton = document.createElement("button");

    detailsButton.type = "button";
    detailsButton.className = "project-details-btn";
    detailsButton.textContent = "View Details";

    const projectBody = card.querySelector(".project-body");
    projectBody.appendChild(detailsButton);

    detailsButton.addEventListener("click", function () {
        const title = card.querySelector("h3");
        const category = card.querySelector(".project-category");
        const description = card.querySelector(
            ".project-body > p:not(.project-category):not(.tech-stack)"
        );
        const technologies = card.querySelector(".tech-stack");

        document.getElementById("dialog-title").textContent =
            title ? title.textContent.trim() : "Project Details";

        document.getElementById("dialog-category").textContent =
            category ? category.textContent.trim() : "";

        document.getElementById("dialog-description").textContent =
            description ? description.textContent.trim() : "";

        document.getElementById("dialog-technologies").textContent =
            technologies ? technologies.textContent.trim() : "Not specified";

        projectDialog.showModal();
    });
});

// Close using either close button.

document.getElementById("dialog-close").addEventListener("click", function () {
    projectDialog.close();
});

document.getElementById("dialog-close-bottom").addEventListener(
    "click",
    function () {
        projectDialog.close();
    }
);

// Close when the visitor clicks the backdrop.

projectDialog.addEventListener("click", function (event) {
    if (event.target === projectDialog) {
        projectDialog.close();
    }
});

// ===================================
// 9. Scroll progress bar
// ===================================

// Create the progress bar elements.

const progressTrack = document.createElement("div");
progressTrack.className = "scroll-progress-track";
progressTrack.setAttribute("role", "progressbar");
progressTrack.setAttribute("aria-label", "Page scroll progress");
progressTrack.setAttribute("aria-valuemin", "0");
progressTrack.setAttribute("aria-valuemax", "100");
progressTrack.setAttribute("aria-valuenow", "0");

const progressFill = document.createElement("div");
progressFill.className = "scroll-progress-fill";

progressTrack.appendChild(progressFill);
document.body.appendChild(progressTrack);

// Update the bar when the visitor scrolls.

function updateScrollProgress() {
    const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    let progress = 0;

    if (scrollableHeight > 0) {
        progress = (window.scrollY / scrollableHeight) * 100;
    }

    progress = Math.min(100, Math.max(0, progress));

    progressFill.style.width = progress + "%";

    progressTrack.setAttribute(
        "aria-valuenow",
        String(Math.round(progress))
    );
}

window.addEventListener("scroll", updateScrollProgress, {
    passive: true
});

window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();
