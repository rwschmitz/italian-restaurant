const menuIcon = document.querySelector('.nav-menu-icon');
const nav = document.querySelector('.nav');
const navMenu = document.querySelector('.nav-menu');
const navImage = document.querySelector('.nav img');

function toggleMenu () {
  navMenu.classList.toggle('is-active');
}

menuIcon.addEventListener('click', toggleMenu, false);