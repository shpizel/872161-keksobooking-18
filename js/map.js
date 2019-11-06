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
      return [
        Math.ceil(bigButtonElementCoords.left + bigButtonElementCoords.width / 2),
        Math.ceil(bigButtonElementCoords.top + bigButtonElementCoords.height / 2)
      ];
    }

    return [
      Math.ceil(bigButtonElementCoords.left + bigButtonElementCoords.width / 2),
      Math.ceil(bigButtonElementCoords.top + bigButtonElementCoords.height + BIG_BUTTON_ARROW_HEIGHT)
    ];
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

    bigButtonElement.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var bigButtonElementCoords = window.tools.getCoords(bigButtonElement);
      var bigButtomElementMaxLeft = mapElementCoords.width - bigButtonElementCoords.width;
      var bigButtomElementMaxTop = mapElementCoords.height - bigButtonElementCoords.height - BIG_BUTTON_ARROW_HEIGHT;
      var bigButtomElementMinLeft = 0;
      var bigButtomElementMinTop = 0;

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

        if (newLeft < bigButtomElementMinLeft) {
          newLeft = bigButtomElementMinLeft;
        } else if (newLeft > bigButtomElementMaxLeft) {
          newLeft = bigButtomElementMaxLeft;
        }

        if (newTop < bigButtomElementMinTop) {
          newTop = bigButtomElementMinTop;
        } else if (newTop > bigButtomElementMaxTop) {
          newTop = bigButtomElementMaxTop;
        }

        var startCoordsX = moveEvt.clientX;
        if (startCoordsX < mapElementCoords.left) {
          startCoordsX = mapElementCoords.left;
        } else if (startCoordsX > mapElementCoords.left + mapElementCoords.width) {
          startCoordsX = mapElementCoords.left + mapElementCoords.width;
        }

        var startCoordsY = moveEvt.clientY;
        if (startCoordsY < mapElementCoords.top) {
          startCoordsY = mapElementCoords.top;
        } else if (startCoordsY > mapElementCoords.top + mapElementCoords.height) {
          startCoordsY = mapElementCoords.top + mapElementCoords.height;
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
