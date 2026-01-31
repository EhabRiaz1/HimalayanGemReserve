const header = document.querySelector(".site-header");
const showcase = document.querySelector("[data-sticky-showcase]");
const cards = Array.from(document.querySelectorAll("[data-product]"));
const progressBar = document.querySelector("[data-progress]");
const nav = document.querySelector(".nav");
const menuToggle = document.querySelector("[data-menu-toggle]");
const modalTriggers = document.querySelectorAll("[data-modal-open]");
const modalCloses = document.querySelectorAll("[data-modal-close]");
const sliders = document.querySelectorAll("[data-slider]");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
};

const updateShowcase = () => {
  if (!showcase || cards.length === 0) return;
  const scrollable = showcase.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return;

  const top = showcase.getBoundingClientRect().top;
  const scrolled = clamp(-top, 0, scrollable);
  const progress = scrolled / scrollable;
  const activeIndex = clamp(
    Math.floor(progress * cards.length),
    0,
    cards.length - 1
  );

  cards.forEach((card, index) => {
    card.classList.toggle("is-active", index === activeIndex);
  });

  if (progressBar) {
    progressBar.style.width = `${Math.round(progress * 100)}%`;
  }
};

updateHeader();
updateShowcase();

const setMenuState = (isOpen) => {
  if (!nav || !menuToggle) return;
  nav.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      setMenuState(false);
    }
  });
}

const openModal = (modalName) => {
  const modal = document.querySelector(`[data-modal="${modalName}"]`);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modalName = trigger.getAttribute("data-modal-open");
    openModal(modalName);
  });
});

modalCloses.forEach((closeEl) => {
  closeEl.addEventListener("click", () => {
    const modal = closeEl.closest(".modal");
    closeModal(modal);
  });
});

sliders.forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".history-slide"));
  if (slides.length < 2) return;
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove("is-active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("is-active");
  }, 3000);
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openModalEl = document.querySelector(".modal.is-open");
  closeModal(openModalEl);
});

window.addEventListener("scroll", () => {
  updateHeader();
  updateShowcase();
});

window.addEventListener("resize", updateShowcase);
