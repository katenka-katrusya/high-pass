'use strict';

const searchBtn = document.querySelector('.search__btn');
const searchCloseBtn = document.querySelector('.search__close-btn');
const phone = document.querySelector('.phone');
const openBurger = document.querySelector('.burger__button_open');
const closeBurger = document.querySelector('.burger__button_close');
const navLinks = document.querySelectorAll('.nav__mobile-link');
const tl = gsap.timeline();

// анимации при загрузке страницы
tl
  .from('.nav', {   // анимация навигации на десктопе
    duration: 3, opacity: 0, ease: 'power3.out'
  })
  .from(['.block-poster', '.hero__picture'], {     // анимация фото в блоке hero
      duration: 1, opacity: 0, ease: 'power3.out'
    },
    '<');


// кнопка поиска и закрытие
const searchInput = gsap.timeline({ paused: true, onStart: openSearch, onReverseComplete: closeSearch })
  .fromTo(['.search__mobile', '.search__mobile-label'], {   // открываем поиск на мобильных устройствах
    duration: 0.5, display: 'none', opacity: 0, x: 100, ease: 'power1.inOut'
  }, {
    duration: 0.5, display: 'flex', opacity: 1, x: 0, ease: 'power1.inOut'
  })
  .to('.search__btn', {     // убираем лупу, когда поиск открывается
    duration: 0.5, opacity: 0, display: 'none', ease: 'power1.inOut'
  }, '<');

function openSearch() {
  if (window.innerWidth <= 998) {
    searchInput.play();
  }
}

function closeSearch() {
  searchInput.reverse();
}

searchBtn.addEventListener('click', openSearch);
searchCloseBtn.addEventListener('click', closeSearch);


// burger
const tlBurger = gsap.timeline({ paused: true, onStart: addMenu, onReverseComplete: removeMenu })
  .fromTo(closeBurger, {    // иконка бургера меняется на другую
      duration: 0.5, opacity: 0, display: 'none', ease: 'power3.out'
    }, {
      duration: 0.5, opacity: 1, display: 'block', ease: 'power3.out'
    },
    '<')
  .fromTo('.nav__mobile', {   // открытие навигации в бургере
      duration: 0.5, display: 'none', opacity: 0, x: -100, ease: 'power3.out'
    }, {
      duration: 0.5, display: 'flex', opacity: 1, x: 0, ease: 'power3.out'
    },
    '<')
  .from('.nav__mobile-list', {
      duration: 0.5, x: 400, ease: 'power3.out'
    },
    '<');


function addMenu() {
  phone.classList.add('phone__mobile_active');
  document.body.classList.add('no-scroll');
  tlBurger.play();
}

function removeMenu() {
  phone.classList.remove('phone__mobile_active');
  document.body.classList.remove('no-scroll');
  tlBurger.reverse();
}

openBurger.addEventListener('click', addMenu);
closeBurger.addEventListener('click', removeMenu);


// клик на якорную ссылку в бургер-меню, закрытие бургера
function clickOnBergerLink() {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      tlBurger.reverse();
    });
  });
}

clickOnBergerLink();


