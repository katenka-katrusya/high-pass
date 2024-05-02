'use strict';

const searchBtn = document.querySelector('.search__btn');
const searchCloseBtn = document.querySelector('.search__close-btn');
const phone = document.querySelector('.phone');
const openBurger = document.querySelector('.burger__open');
const closeBurger = document.querySelector('.burger__close');
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


// валидация формы подписки
function checkFormNewsletter() {
  const validator = new window.JustValidate('.about__newsletter-form');

  validator
    .addField('.about__newsletter-input', [
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      },
    ]);

  // очистка поля после отправки формы
  const formNewsletter = document.querySelector('.about__newsletter-form');
  formNewsletter.addEventListener('submit', (e) => {
    e.preventDefault();
    formNewsletter.reset();
  });
}

checkFormNewsletter();


// переключение табов
function switchTabs() {
  const tabs = document.querySelectorAll('.project__btn-tab');
  const contents = document.querySelectorAll('.project__list');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {

      removeClass(tabs, 'project__btn-tab_active');
      removeClass(contents, 'project__list_active');

      tab.classList.add('project__btn-tab_active');

      const textTub = tab.textContent.trim();

      contents.forEach((content) => {  // 1 таб === 1 список, 2 таб === 2 список
        if (content.dataset.tabNum === textTub) {
          content.classList.add('project__list_active');

          tl.fromTo(content, {
            duration: 0.5, x: 200, opacity: 0, ease: 'power3.out'
          }, {
            duration: 0.5, x: 0, opacity: 1, ease: 'power3.out'
          });
        }
      });
    });
  });
}

switchTabs();

function removeClass(elements, className) {
  elements.forEach((item) => {
    item.classList.remove(className);
  });
}


// slider
function slider(activeSlide = 0) {
  const slides = document.querySelectorAll('.services__slide');
  const sliderActive = document.querySelector('.services__slider_active');
  const listRetouchAll = document.querySelectorAll('[data-services="Услуги по ретуши"]');
  const listDefaultAll = document.querySelectorAll('[data-services="Основной перечень"]');

  slides[activeSlide].classList.add('services__slide_active');

  listRetouchAll.forEach((list) => list.style.display = 'none');

  slides.forEach((slide) => {
    slide.addEventListener('click', () => {

      removeClass(slides, 'services__slide_active');
      slide.classList.add('services__slide_active');

      slide.textContent === 'Услуги по ретуши'
      ? changeDisplayLists(listDefaultAll, listRetouchAll)
      : changeDisplayLists(listRetouchAll, listDefaultAll);

      tl
        .to(sliderActive, { duration: 0.5, x: slide.offsetLeft, ease: 'power3.out' })
        .fromTo([listDefaultAll, listRetouchAll], {
          duration: 0.7, y: 200, opacity: 0
        }, {
          duration: 0.7, y: 0, opacity: 1, ease: 'power3.out'
        }, '<');
    });
  });

  function changeDisplayLists(listNone, listBlock) {
    listNone.forEach((list) => list.style.display = 'none');
    listBlock.forEach((list) => list.style.display = '');
  }
}

slider(0);
