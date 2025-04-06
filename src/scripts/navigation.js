const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const navLinks = document.querySelector('.navigation');
const footer = document.querySelector('footer');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('expanded');
    hamburger.classList.toggle('expanded');
    nav.classList.toggle('expanded');
    footer.classList.toggle('expanded');
});

window.addEventListener('resize', () => {
    setTimeout(() => {
        if (window.innerWidth >= 880) {
            navLinks.classList.remove('expanded');
            hamburger.classList.remove('expanded');
            nav.classList.remove('expanded');
            footer.classList.remove('expanded');
        }
    }, 250);
});