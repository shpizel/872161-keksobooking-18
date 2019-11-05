'use strict';

(function () {
  /* Constants START */
  var module = 'form'; // работает с формой объявления

  var MIN_PRICE_BY_TYPE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var assertEmpty = window.tools.assertEmpty;

  var adFormRequiredClass = 'ad-form--disabled';

  var adFormElement = document.querySelector('.ad-form');
  assertEmpty(adFormElement);

  var adFormElementInputs = adFormElement.querySelectorAll('fieldset,input,select');
  assertEmpty(adFormElementInputs);

  var mapFiltersElement = document.querySelector('.map__filters');
  assertEmpty(mapFiltersElement);

  var mapFiltersElementInputs = mapFiltersElement.querySelectorAll('fieldset,input,select');
  assertEmpty(mapFiltersElementInputs);

  var adFormGuestsElement = adFormElement.querySelector('select[name=capacity');
  assertEmpty(adFormGuestsElement);

  var adFormRoomsElement = adFormElement.querySelector('select[name=rooms]');
  assertEmpty(adFormRoomsElement);

  var adFormTypeElement = adFormElement.querySelector('select[name=type]');
  assertEmpty(adFormTypeElement);

  var adFormPriceElement = adFormElement.querySelector('input[name=price]');
  assertEmpty(adFormPriceElement);

  var adFormAddressElement = adFormElement.querySelector('input[name=address]');
  assertEmpty(adFormAddressElement);

  var adFormTimeinElement = adFormElement.querySelector('select[name=timein]');
  assertEmpty(adFormTimeinElement);

  var adFormTimeoutElement = adFormElement.querySelector('select[name=timeout]');
  assertEmpty(adFormTimeoutElement);
  /* Constants END */

  /* Code START */
  var disableElements = function (elements) {
    assertEmpty(elements);
    elements.forEach(function (element) {
      var targetElement = (element.parentNode.tagName === 'FIELDSET') ? element.parentNode : element;
      if (!targetElement.hasAttribute('disabled')) {
        targetElement.setAttribute('disabled', true);
      }
    });
  };

  var enableElements = function (elements) {
    assertEmpty(elements);
    elements.forEach(function (element) {
      var targetElement = (element.parentNode.tagName === 'FIELDSET') ? element.parentNode : element;
      if (targetElement.hasAttribute('disabled') && targetElement.disabled) {
        targetElement.removeAttribute('disabled');
      }
    });
  };

  var enableForms = function () {
    enableElements(adFormElementInputs);
    enableElements(mapFiltersElementInputs);

    if (adFormElement.classList.contains(adFormRequiredClass)) {
      adFormElement.classList.remove(adFormRequiredClass);
    }
  };

  var checkRoomsAndGuestsCount = function () {
    var rooms = parseInt(adFormRoomsElement.value, 10);
    var guests = parseInt(adFormGuestsElement.value, 10);

    var failed = false;
    if (rooms === 1 && rooms !== guests) {
      adFormGuestsElement.setCustomValidity('Некорректное число гостей');
      adFormGuestsElement.reportValidity();
      failed = true;
    } else if (rooms > 1 && rooms <= 3) {
      if (!(guests >= 1 && guests <= rooms)) {
        adFormGuestsElement.setCustomValidity('Некорректное число гостей');
        adFormGuestsElement.reportValidity();
        failed = true;
      }
    } else if (rooms > 3 && guests !== 0) {
      adFormGuestsElement.setCustomValidity('Ожидается выбор "Не для гостей"');
      adFormGuestsElement.reportValidity();
      failed = true;
    }

    if (!failed) {
      adFormGuestsElement.setCustomValidity('');
    }
  };

  var initializeForms = function () {
    if (!adFormElement.classList.contains(adFormRequiredClass)) {
      adFormElement.classList.add(adFormRequiredClass);
    }

    adFormElement.addEventListener('submit', function (evt) {
      if (!evt.target.checkValidity()) {
        evt.preventDefault();
      }
    });

    disableElements(adFormElementInputs);
    disableElements(mapFiltersElementInputs);

    adFormGuestsElement.addEventListener('change', checkRoomsAndGuestsCount);
    adFormRoomsElement.addEventListener('change', checkRoomsAndGuestsCount);

    adFormTypeElement.addEventListener('change', function () {
      var value = adFormTypeElement.value;

      if (MIN_PRICE_BY_TYPE.hasOwnProperty(value)) {
        adFormPriceElement.setAttribute('min', MIN_PRICE_BY_TYPE[value]);
        adFormPriceElement.setAttribute('placeholder', MIN_PRICE_BY_TYPE[value]);
      }
    });

    adFormTimeinElement.addEventListener('change', function () {
      adFormTimeoutElement.value = adFormTimeinElement.value;
    });

    adFormTimeoutElement.addEventListener('change', function () {
      adFormTimeinElement.value = adFormTimeoutElement.value;
    });
  };

  window[module] = {
    adFormAddressElement: adFormAddressElement,
    enableForms: enableForms
  };

  initializeForms();
  /* Code END */
})();
