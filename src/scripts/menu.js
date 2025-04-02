const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('expanded');
    hamburger.classList.toggle('expanded');
    nav.classList.toggle('expanded');
});
