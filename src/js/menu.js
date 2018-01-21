const menuIcon = document.querySelector('.nav-menu-icon');
const nav = document.querySelector('.nav');
const navMenu = document.querySelector('.nav-menu');

function toggleMenu () {
  navMenu.classList.toggle('is-active');
}

menuIcon.addEventListener('touch', toggleMenu, false);