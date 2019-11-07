'use strict';

(function () {
  /* Constants START */
  var BIG_BUTTON_ARROW_HEIGHT = 10;
  var BIG_BUTTON_TOP_MIN = 130;
  var BIG_BUTTON_TOP_MAX = 630;

  var mapElementRequiredClass = 'map--faded';

  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var bigButtonElement = mapPinsElement.querySelector('.map__pin--main');
  /* Constants END */

  /* Variables START */
  var renderedCard;
  var mapElementCoords = window.tools.getCoords(mapElement);
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
    var bigButtonElementCoords = window.tools.getCoords(bigButtonElement);
    if (mapElement.classList.contains(mapElementRequiredClass)) {
      return {
        left: Math.ceil(bigButtonElementCoords.left + bigButtonElementCoords.width / 2),
        top: Math.ceil(bigButtonElementCoords.top + bigButtonElementCoords.height / 2)
      };
    }

    return {
      left: Math.ceil(bigButtonElementCoords.left + bigButtonElementCoords.width / 2),
      top: Math.ceil(bigButtonElementCoords.top + bigButtonElementCoords.height + BIG_BUTTON_ARROW_HEIGHT)
    };
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
      window.form.adFormAddressElement.value = Object.values(getBigButtonCoordinates()).join(', ');
    };

    bigButtonElement.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var bigButtonElementCoords = window.tools.getCoords(bigButtonElement);

      var bigButtonElementBounds = {
        left: {
          max: mapElementCoords.width - bigButtonElementCoords.width,
          min: 0
        },
        top: {
          max: BIG_BUTTON_TOP_MAX - bigButtonElementCoords.height - BIG_BUTTON_ARROW_HEIGHT, // mapElementCoords.height - bigButtonElementCoords.height - BIG_BUTTON_ARROW_HEIGHT
          min: BIG_BUTTON_TOP_MIN - bigButtonElementCoords.height - BIG_BUTTON_ARROW_HEIGHT
        }
      };

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: (startCoords.x - moveEvt.clientX),
          y: (startCoords.y - moveEvt.clientY)
        };

        var newTop = (bigButtonElement.offsetTop - shift.y);
        var newLeft = (bigButtonElement.offsetLeft - shift.x);

        if (newLeft < bigButtonElementBounds.left.min) {
          newLeft = bigButtonElementBounds.left.min;
        } else if (newLeft > bigButtonElementBounds.left.max) {
          newLeft = bigButtonElementBounds.left.max;
        }

        if (newTop < bigButtonElementBounds.top.min) {
          newTop = bigButtonElementBounds.top.min;
        } else if (newTop > bigButtonElementBounds.top.max) {
          newTop = bigButtonElementBounds.top.max;
        }

        var startCoordsX = moveEvt.clientX;
        if (startCoordsX < mapElementCoords.left + bigButtonElementCoords.width / 2) {
          startCoordsX = mapElementCoords.left + bigButtonElementCoords.width / 2;
        } else if (startCoordsX > mapElementCoords.left + mapElementCoords.width - bigButtonElementCoords.width / 2) {
          startCoordsX = mapElementCoords.left + mapElementCoords.width - bigButtonElementCoords.width / 2;
        }

        var startCoordsY = moveEvt.clientY;
        if (startCoordsY < bigButtonElementBounds.top.min + bigButtonElementCoords.height / 2) {
          startCoordsY = bigButtonElementBounds.top.min + bigButtonElementCoords.height / 2;
        } else if (startCoordsY > bigButtonElementBounds.top.max + bigButtonElementCoords.height / 2) {
          startCoordsY = bigButtonElementBounds.top.max + bigButtonElementCoords.height / 2;
        }

        startCoords = {
          x: startCoordsX,
          y: startCoordsY
        };

        bigButtonElement.style.top = newTop + 'px';
        bigButtonElement.style.left = newLeft + 'px';

        fillAdFormAddress();
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        fillAdFormAddress();

        bigButtonElement.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mousemove', onMouseMove);
        bigButtonElement.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mouseup', onMouseUp);
      };

      bigButtonElement.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousemove', onMouseMove);
      bigButtonElement.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseup', onMouseUp);
      enablePage();
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
