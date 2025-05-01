document.addEventListener("astro:page-load", () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".navigation");
  const footer = document.querySelector("footer");
  const preferences = document.querySelector(".preferences");

  const items = [hamburger, nav, navLinks, footer, preferences];

  hamburger.addEventListener("click", () => {
    items.forEach((item) => item.classList.toggle("expanded"));
  });

  window.addEventListener("resize", () => {
    setTimeout(() => {
      if (window.innerWidth >= 880) {
        items.forEach((item) => item.classList.remove("expanded"));
      }
    }, 250);
  });
});
