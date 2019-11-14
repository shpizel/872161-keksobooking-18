'use strict';

(function () {
  /* Constants START */
  var MIN_PRICE_BY_TYPE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var BOX_SHADOW_RED = '0 0 2px 2px red';

  var adFormRequiredClass = 'ad-form--disabled';

  var adFormElement = document.querySelector('.ad-form');
  var adFormElementInputs = adFormElement.querySelectorAll('fieldset,input,select');
  var adFormTitleElement = adFormElement.querySelector('input[name=title');
  var adFormGuestsElement = adFormElement.querySelector('select[name=capacity');
  var adFormRoomsElement = adFormElement.querySelector('select[name=rooms]');
  var adFormTypeElement = adFormElement.querySelector('select[name=type]');
  var adFormPriceElement = adFormElement.querySelector('input[name=price]');
  var adFormAddressElement = adFormElement.querySelector('input[name=address]');
  var adFormTimeinElement = adFormElement.querySelector('select[name=timein]');
  var adFormTimeoutElement = adFormElement.querySelector('select[name=timeout]');
  // var adFormResetButton = adFormElement.querySelector('button[type=reset]')
  /* Constants END */

  /* Code START */
  var setAddress = function (address) {
    adFormAddressElement.setAttribute('value', address);
  };

  var enable = function () {
    window.tools.enableElements(adFormElementInputs);
    if (adFormElement.classList.contains(adFormRequiredClass)) {
      adFormElement.classList.remove(adFormRequiredClass);
    }
  };

  var disable = function () {
    window.tools.disableElements(adFormElementInputs);
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

    adFormGuestsElement.style.boxShadow = (failed) ? BOX_SHADOW_RED : '';
  };

  var onReset = function () {
    window.mapFiltersForm.reset();
    window.map.removeCard();
    window.map.clearPins();
    window.map.centerBigButton();
    window.map.setPageReady(false);
  };

  var reset = function () {
    adFormElement.reset();
    // onReset();
  };

  var initEvents = function () {
    adFormTitleElement.addEventListener('input', function (evt) {
      var value = evt.currentTarget.value;
      evt.currentTarget.style.boxShadow = (value.length >= 30) ? '' : BOX_SHADOW_RED;
      evt.currentTarget.reportValidity();
    });

    adFormPriceElement.addEventListener('input', function (evt) {
      var minValue = parseInt(evt.currentTarget.getAttribute('min'), 10) || 0;
      var maxValue = parseInt(evt.currentTarget.getAttribute('max'), 10);
      var value = parseInt(evt.currentTarget.value, 10);

      evt.currentTarget.boxShadow = (minValue >= value <= maxValue) ? '' : BOX_SHADOW_RED;
      evt.currentTarget.reportValidity();
    });

    adFormElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
      if (evt.target.checkValidity()) {
        var onSuccess = function () {
          reset();
          window.map.disablePage();
          window.adForm.disable();
          window.mapFiltersForm.disable();
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
      }
    });

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
    adFormElement.addEventListener('reset', onReset);
  };

  var init = function () {
    disable();
    initEvents();
  };

  window.adForm = {
    enable: enable,
    disable: disable,
    setAddress: setAddress
  };

  init();
  /* Code END */
})();
