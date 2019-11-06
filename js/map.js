'use strict';

(function () {
  /* Constants START */
  var BIG_BUTTON_ARROW_HEIGHT = 10;

  var mapElementRequiredClass = 'map--faded';

  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var bigButtonElement = mapPinsElement.querySelector('.map__pin--main');
  /* Constants END */

  /* Variables START */
  var renderedCard;
  /* Variabled END */

  /* Code START */
  var fitMapWithOffers = function (offers) {
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
    removeCard();
    card.querySelector('.popup__close').addEventListener('click', removeCard);
    mapElement.insertBefore(card, document.querySelector('.map__filters-container'));
    renderedCard = mapElement.querySelector('.map__card');
    document.addEventListener('keydown', onEscapePressed);
  };

  var removeCard = function () {
    if (renderedCard) {
      renderedCard.parentNode.removeChild(renderedCard);
      document.removeEventListener('keydown', onEscapePressed);
      renderedCard = null;
    }
  };

  var onEscapePressed = function (evt) {
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

  window.map = {
    showCard: showCard
  };

  initializeMap();
  /* Code END */
})();
