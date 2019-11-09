'use strict';

(function () {
  /* Constants START */
  var MIN_PRICE_BY_TYPE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var adFormRequiredClass = 'ad-form--disabled';

  var adFormElement = document.querySelector('.ad-form');
  var adFormElementInputs = adFormElement.querySelectorAll('fieldset,input,select');
  var adFormGuestsElement = adFormElement.querySelector('select[name=capacity');
  var adFormRoomsElement = adFormElement.querySelector('select[name=rooms]');
  var adFormTypeElement = adFormElement.querySelector('select[name=type]');
  var adFormPriceElement = adFormElement.querySelector('input[name=price]');
  var adFormAddressElement = adFormElement.querySelector('input[name=address]');
  var adFormTimeinElement = adFormElement.querySelector('select[name=timein]');
  var adFormTimeoutElement = adFormElement.querySelector('select[name=timeout]');

  var mapFiltersElement = document.querySelector('.map__filters');
  var mapFiltersElementInputs = mapFiltersElement.querySelectorAll('fieldset,input,select');
  /* Constants END */

  /* Code START */
  var disableElements = function (elements) {
    elements.forEach(function (element) {
      var targetElement = (element.parentNode.tagName === 'FIELDSET') ? element.parentNode : element;
      if (!targetElement.hasAttribute('disabled')) {
        targetElement.setAttribute('disabled', true);
      }
    });
  };

  var enableElements = function (elements) {
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

  var disableForms = function () {
    disableElements(adFormElementInputs);
    disableElements(mapFiltersElementInputs);

    if (!adFormElement.classList.contains(adFormRequiredClass)) {
      adFormElement.classList.add(adFormRequiredClass);
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

      /*
      evt.preventDefault();
      if (evt.target.checkValidity()) {
        var onSuccess = function () {
          adFormElement.reset();
          window.map.clearMapPins();
          window.map.centerPin();
          window.map.disablePage();
          window.dialogs.showSuccessDialog();
        };
        var onError = function () {
          window.dialogs.showErrorDialog(sendFormData);
        };
        var Request = new window.urllib.Request(onSuccess, onError);
        var sendFormData = function () {
          Request.exec(adFormElement.action, 'POST', new FormData(adFormElement));
        };
        sendFormData();
      }*/
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

  window.form = {
    adFormAddressElement: adFormAddressElement,
    enableForms: enableForms,
    disableForms: disableForms
  };

  initializeForms();
  /* Code END */
})();
