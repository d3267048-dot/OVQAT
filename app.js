(function () {
  const LANG_KEY = "ovqat-lang";
  const DEFAULT_LANG = "ru";

  function currentLang() {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "uz" || saved === "ru" ? saved : DEFAULT_LANG;
  }

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.ru;
    document.documentElement.lang = lang === "uz" ? "uz" : "ru";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (dict[key] != null) el.setAttribute("alt", dict[key]);
    });
    document.querySelectorAll(".lang button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    localStorage.setItem(LANG_KEY, lang);
  }

  function initNav() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => nav.classList.toggle("open"));
      nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
    }
    const page = document.body.dataset.page;
    document.querySelectorAll(".nav a").forEach((a) => {
      if (a.dataset.page === page) a.classList.add("active");
    });
  }

  function initLightbox() {
    const box = document.querySelector(".lightbox");
    const img = box ? box.querySelector("img") : null;
    if (!box || !img) return;
    document.querySelectorAll("[data-full]").forEach((el) => {
      el.addEventListener("click", () => {
        img.src = el.getAttribute("data-full");
        box.classList.add("open");
      });
    });
    box.addEventListener("click", () => box.classList.remove("open"));
  }

  function initForm() {
    const form = document.querySelector("#lead-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lang = currentLang();
      const dict = I18N[lang];
      const data = new FormData(form);
      const text = [
        dict.waText,
        "",
        (data.get("name") || "") + " / " + (data.get("company") || ""),
        data.get("phone") || "",
        (dict.formPeople || "") + ": " + (data.get("people") || ""),
        data.get("message") || "",
      ]
        .filter(Boolean)
        .join("\n");
      window.open("https://t.me/+998970373873", "_blank");
      const toast = document.querySelector(".toast");
      if (toast) {
        toast.textContent = dict.formOk;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2400);
      }
    });
  }

  function initVideos() {
    const reels = document.querySelectorAll(".reel");
    if (!reels.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const v = e.target.querySelector("video");
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      }, { threshold: 0.35 });
      reels.forEach((r) => io.observe(r));
    }
    const box = document.querySelector(".video-lightbox");
    if (!box) return;
    const player = box.querySelector("video");
    const close = () => {
      player.pause();
      player.removeAttribute("src");
      player.load();
      box.classList.remove("open");
    };
    reels.forEach((r) => {
      r.addEventListener("click", () => {
        player.src = r.dataset.video;
        player.muted = false;
        box.classList.add("open");
        player.play().catch(() => {});
      });
    });
    box.addEventListener("click", (e) => { if (e.target !== player) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("open")) close(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(currentLang());
    initNav();
    initLightbox();
    initForm();
    initVideos();
    document.querySelectorAll(".lang button").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });
  });
})();
