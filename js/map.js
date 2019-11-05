'use strict';

(function () {
  /* Constants START */
  var module = 'map'; // управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает
  // пины и осуществляет взаимодействие карточки и метки на карте

  var log = window.tools.log;
  var assertEmpty = window.tools.assertEmpty;

  var BIG_BUTTON_ARROW_HEIGHT = 10;
  var mapElementRequiredClass = 'map--faded';

  var mapElement = document.querySelector('.map');
  assertEmpty(mapElement);

  var mapPinsElement = mapElement.querySelector('.map__pins');
  assertEmpty(mapPinsElement);

  var bigButtonElement = mapPinsElement.querySelector('.map__pin--main');
  assertEmpty(bigButtonElement);
  /* Constants END */

  /* Variables START */
  var renderedCard;
  /* Variabled END */

  /* Code START */
  var fitMapWithOffers = function (offers) {
    log('fitMapWithOffers executed');
    if (offers.length > 0) {
      var fragment = document.createDocumentFragment();
      offers.forEach(function (offer) {
        fragment.appendChild(window.pin.getOfferPinElement(offer));
      });
      mapPinsElement.appendChild(fragment);
    }
  };

  var getBigButtonCoordinates = function () {
    var coords = window.tools.getCoords(bigButtonElement);
    if (mapElement.classList.contains(mapElementRequiredClass)) {
      return [Math.ceil(coords.left + coords.width / 2), Math.ceil(coords.top + coords.height / 2)];
    }

    return [Math.ceil(coords.left + coords.width / 2), Math.ceil(coords.top + coords.height + BIG_BUTTON_ARROW_HEIGHT)];
  };

  var showCard = function (card) {
    log('showCard executed');

    removeCard();
    card.querySelector('.popup__close').addEventListener('click', removeCard);
    mapElement.insertBefore(card, document.querySelector('.map__filters-container'));
    renderedCard = mapElement.querySelector('.map__card');
    document.addEventListener('keydown', onEscapePressed);
    log('onEscapePressed added');
  };

  var removeCard = function () {
    log('removeCard executed');
    if (renderedCard) {
      renderedCard.parentNode.removeChild(renderedCard);
      document.removeEventListener('keydown', onEscapePressed);

      log('onEscapePressed removed');

      renderedCard = null;
    }
  };

  var onEscapePressed = function (evt) {
    log('onEscapePressed executed');
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      removeCard();
    }
  };

  var initializeMap = function () {
    var enablePage = function () {
      if (mapElement.classList.contains(mapElementRequiredClass)) {
        mapElement.classList.remove(mapElementRequiredClass);
      }
      fitMapWithOffers(window.data.randomOffers);
      window.form.enableForms();
    };

    var fillAdFormAddress = function () {
      window.form.adFormAddressElement.value = getBigButtonCoordinates().join(', ');
    };

    bigButtonElement.addEventListener('mousedown', function () {
      enablePage();
      fillAdFormAddress();
    });

    bigButtonElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.constants.ENTER_KEY_CODE) {
        enablePage();
      }
    });

    if (!mapElement.classList.contains(mapElementRequiredClass)) {
      mapElement.classList.add(mapElementRequiredClass);
    }

    fillAdFormAddress();
  };

  window[module] = {
    showCard: showCard
  };

  initializeMap();
  /* Code END */
})();
