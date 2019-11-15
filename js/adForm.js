'use strict';

(function () {
  /* Constants START */
  var BOX_SHADOW_ERROR_STYLE = '0 0 2px 2px red';
  var GREY_MUFFIN_URL = 'img/muffin-grey.svg';
  var OFFER_PHOTO_CLASS_NAME = 'ad-form__photo';
  var REQUIRED_CLASS_NAME = 'ad-form--disabled';
  var TITLE_LETTERS_MIN = 30;

  var MinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var ErrorMessage = {
    INCORRECT_GUESTS_COUNT: 'Некорректное число гостей',
    NOT_FOR_GUESTS: 'Ожидается выбор "Не для гостей"'
  };

  var formNode = document.querySelector('.ad-form');
  var inputsList = formNode.querySelectorAll('fieldset,input,select');
  var titleNode = formNode.querySelector('input[name=title');
  var guestsNode = formNode.querySelector('select[name=capacity');
  var roomsNode = formNode.querySelector('select[name=rooms]');
  var typeNode = formNode.querySelector('select[name=type]');
  var priceNode = formNode.querySelector('input[name=price]');
  var addressNode = formNode.querySelector('input[name=address]');
  var timeinNode = formNode.querySelector('select[name=timein]');
  var timeoutNode = formNode.querySelector('select[name=timeout]');
  var avatarSelectorNode = formNode.querySelector('input[name=avatar]');
  var avatarPreviewNode = formNode.querySelector('.ad-form-header__preview img');
  var photosSelectorNode = formNode.querySelector('input[name=images]');
  var photosContainerNode = formNode.querySelector('.ad-form__photo-container');
  /* Constants END */

  /* Code START */
  var setAddress = function (address) {
    addressNode.setAttribute('value', address);
  };

  var enable = function () {
    window.tools.enableElements(inputsList);
    if (formNode.classList.contains(REQUIRED_CLASS_NAME)) {
      formNode.classList.remove(REQUIRED_CLASS_NAME);
    }
  };

  var disable = function () {
    window.tools.disableElements(inputsList);
    if (!formNode.classList.contains(REQUIRED_CLASS_NAME)) {
      formNode.classList.add(REQUIRED_CLASS_NAME);
    }
  };

  var checkRoomsAndGuestsCount = function () {
    var rooms = parseInt(roomsNode.value, 10);
    var guests = parseInt(guestsNode.value, 10);

    var failed = false;
    if (rooms === 1 && rooms !== guests) {
      guestsNode.setCustomValidity(ErrorMessage.INCORRECT_GUESTS_COUNT);
      guestsNode.reportValidity();
      failed = true;
    } else if (rooms > 1 && rooms <= 3) {
      if (!(guests >= 1 && guests <= rooms)) {
        guestsNode.setCustomValidity(ErrorMessage.INCORRECT_GUESTS_COUNT);
        guestsNode.reportValidity();
        failed = true;
      }
    } else if (rooms > 3 && guests !== 0) {
      guestsNode.setCustomValidity(ErrorMessage.NOT_FOR_GUESTS);
      guestsNode.reportValidity();
      failed = true;
    }

    if (!failed) {
      guestsNode.setCustomValidity('');
    }
    guestsNode.style.boxShadow = (failed) ? BOX_SHADOW_ERROR_STYLE : '';
  };

  var clearBoxShadow = function (elements) {
    elements.forEach(function (element) {
      if (element.style.boxShadow) {
        element.style.boxShadow = '';
      }
    });
  };

  var onReset = function () {
    window.mapFiltersForm.reset();
    window.map.removeCard();
    window.map.clearPins();
    window.map.centerBigButton();
    window.map.setPageReady(false);
    clearBoxShadow(inputsList);
    avatarPreviewNode.src = GREY_MUFFIN_URL;
    clearPhotoContainer();
  };

  var reset = function () {
    formNode.reset();
  };

  var checkTitle = function () {
    if (titleNode.value.length > 0 && titleNode.value.length < TITLE_LETTERS_MIN) {
      titleNode.style.boxShadow = BOX_SHADOW_ERROR_STYLE;
      titleNode.reportValidity();
    } else {
      titleNode.style.boxShadow = '';
    }
  };

  var clearPhotoContainer = function () {
    document.querySelectorAll('.' + OFFER_PHOTO_CLASS_NAME).forEach(function (node) {
      window.tools.removeNode(node);
    });
  };

  var initEvents = function () {
    titleNode.addEventListener('input', checkTitle);
    formNode.addEventListener('submit', function (evt) {
      evt.preventDefault();
      if (formNode.checkValidity()) {
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
          Request.exec(formNode.action, 'POST', new FormData(formNode));
        };
        sendFormData();
      }
    });

    guestsNode.addEventListener('change', checkRoomsAndGuestsCount);
    roomsNode.addEventListener('change', checkRoomsAndGuestsCount);
    typeNode.addEventListener('change', function () {
      var value = typeNode.value;
      if (MinPrice.hasOwnProperty(value)) {
        priceNode.setAttribute('min', MinPrice[value]);
        priceNode.setAttribute('placeholder', MinPrice[value]);
      }
    });
    timeinNode.addEventListener('change', function () {
      timeoutNode.value = timeinNode.value;
    });
    timeoutNode.addEventListener('change', function () {
      timeinNode.value = timeoutNode.value;
    });
    formNode.addEventListener('reset', onReset);
    avatarSelectorNode.addEventListener('change', window.tools.readFiles(function (blob) {
      avatarPreviewNode.src = blob;
    }, window.constants.IMAGES_FILE_EXTS));

    var onPhotosChoosen = function (evt) {
      clearPhotoContainer();
      window.tools.readFiles(function (blob) {
        var preview = document.createElement('div');
        preview.className = OFFER_PHOTO_CLASS_NAME;
        var image = document.createElement('img');
        image.src = blob;
        image.style.width = '100%';
        image.style.height = '100%';
        preview.appendChild(image);
        photosContainerNode.appendChild(preview);
      }, window.constants.IMAGES_FILE_EXTS, true)(evt);
    };
    photosSelectorNode.addEventListener('change', onPhotosChoosen);
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
