'use strict';

const searchBtn = document.querySelector('.search__btn');
const searchCloseBtn = document.querySelector('.search__close-btn');
const phone = document.querySelector('.phone');
const openBurger = document.querySelector('.burger__open');
const closeBurger = document.querySelector('.burger__close');
const navLinks = document.querySelectorAll('.nav__link');
const address = document.querySelector('.contacts__address');
const closeAddressBtn = document.querySelector('.contacts__close-btn');
const tl = gsap.timeline();

// анимации при загрузке страницы
function animatePage() {
  tl
    .from('.nav', {   // анимация навигации на десктопе
      duration: 3, opacity: 0, ease: 'power3.out'
    })
    .from(['.block-poster', '.hero__picture'], {     // анимация фото в блоке hero
        duration: 1, opacity: 0, ease: 'power3.out'
      },
      '<');
}

animatePage();


// кнопка поиска и закрытие
function animateSearch() {
  const searchInput = gsap.timeline({ paused: true, onStart: openSearch, onReverseComplete: closeSearch })
    .fromTo(['.search__mobile', '.search__mobile-label'], {   // открываем поиск на мобильных устройствах
      display: 'none', opacity: 0, x: 100
    }, {
      duration: 0.5, display: 'flex', opacity: 1, x: 0, ease: 'power1.inOut'
    })
    .to('.search__btn', {     // убираем лупу, когда поиск открывается
      duration: 0.5, opacity: 0, display: 'none', ease: 'power1.inOut'
    }, '<');

  return searchInput;
}

const searchInput = animateSearch();

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
function animateBurger() {
  const tlBurger = gsap.timeline({ paused: true, onStart: addMenu, onReverseComplete: removeMenu })
    .fromTo(closeBurger, {    // иконка бургера меняется на другую
        opacity: 0, display: 'none'
      }, {
        duration: 0.5, opacity: 1, display: 'block', ease: 'power3.out'
      },
      '<')
    .fromTo('.nav__mobile', {   // открытие навигации в бургере
        display: 'none', opacity: 0, x: -100
      }, {
        duration: 0.5, display: 'flex', opacity: 1, x: 0, ease: 'power3.out'
      },
      '<')
    .from('.nav__mobile-list', {
        duration: 0.5, x: 400, ease: 'power3.out'
      },
      '<');

  return tlBurger;
}

const tlBurger = animateBurger();

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


// // клик на якорную ссылку в бургер-меню, закрытие бургера
function clickOnBergerLink() {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('no-scroll');
      tlBurger.reverse();
    });
  });
}

clickOnBergerLink();


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


// Карта
ymaps.ready(init);

function init() {
  const map = new ymaps.Map('map', {
    center: [55.768, 37.634],
    zoom: 16,
    // убрать все элементы с карты
    controls: []
  });

  const myPlacemark = new ymaps.Placemark(
    [55.76940785, 37.63840266676759],
    {
      // пустой баллун, иначе метки нет
      balloonContent: ''
    },
    {
      iconLayout: 'default#image',
      iconImageHref: '../images/icons/marker.png',
      iconImageSize: [12, 12],
      iconImageOffset: [-20, -40]
    });

  myPlacemark.events.add('click', function () {
    if (address.style.display === 'block') {
      closeAddress();
    } else {
      openAddress();
    }
  });

  closeAddressBtn.addEventListener('click', closeAddress);

  map.geoObjects.add(myPlacemark);
}

// анимации типа баллуна
function animateBalloon() {
  // начинаем с закрытия баллуна и реверс для открытия
  const tlAddress = gsap.timeline({ paused: true, onStart: closeAddress, onReverseComplete: openAddress })
    .fromTo('.contacts__address', {
      display: 'block', opacity: 1
    }, {
      duration: 0.4, display: 'none', opacity: 0, ease: 'power1.inOut'
    });

  return tlAddress;
}

const tlAddress = animateBalloon();

function openAddress() {
  tlAddress.reverse();
}

function closeAddress() {
  tlAddress.play();
}

// валидация формы подписки
function checkFormNewsletter() {
  const validator = new window.JustValidate('.about__newsletter-form');
  const formNewsletter = document.querySelector('.about__newsletter-form');

  validator
    .addField('.about__newsletter-input', [
      {
        rule: 'required',
      },
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      },
    ]);

  // очистка поля после отправки формы
  preventDefault(formNewsletter);
}

checkFormNewsletter();

// форма оставить заявку
function checkFormContacts() {
  const validator = new window.JustValidate('.contacts__form');
  const formContacts = document.querySelector('.contacts__form');

  validator
    .addField('.contacts__form-input[type="email"]', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      }
    ])
    .addField('.contacts__form-input[name="name"]', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'maxLength',
        value: 15,
        errorMessage: 'Максимум 15 символов',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Минимум 2 символа',
      },
      {
        rule: 'customRegexp',
        value: /^[а-яёЁa-z]+(?:\s[а-яёЁa-z]+)*$/gi,
        errorMessage: 'Недопустимый формат',
      }
    ]);

  // очистка поля после отправки формы
  preventDefault(formContacts);
}

checkFormContacts();

function preventDefault(nameForm) {
  nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    nameForm.reset();
  });
}
