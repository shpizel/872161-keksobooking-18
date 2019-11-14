'use strict';

(function () {
  /* Constants START */
  var MAP_OFFERS_MAX = 5;
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
  var pageReady = false;
  var offersCache;
  /* Variabled END */

  /* Code START */
  var fitMapWithOffers = function (offers) {
    if (offers.length > 0) {
      var fragment = document.createDocumentFragment();
      offers.forEach(function (offer, index) {
        if (index <= MAP_OFFERS_MAX - 1) {
          fragment.appendChild(window.pin.getOfferPinElement(offer));
        }
      });
      mapPinsElement.appendChild(fragment);
    }
  };

  var fillAdFormAddress = function () {
    window.adForm.setAddress(Object.values(getBigButtonCoordinates()).join(', '));
  };

  var centerBigButton = function () {
    var bigButtonCoordinates = window.tools.getCoords(bigButtonElement);
    bigButtonElement.style.left = Math.ceil(mapElementCoords.width / 2 - bigButtonCoordinates.width / 2) + 'px';
    bigButtonElement.style.top = Math.ceil(mapElementCoords.height / 2 - bigButtonCoordinates.height / 2) + 'px';
    fillAdFormAddress();
  };

  var clearPins = function () {
    mapPinsElement.querySelectorAll('.map__pin').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        element.parentElement.removeChild(element);
      }
    });
  };

  var getBigButtonCoordinates = function () {
    var bigButtonElementCoords = window.tools.getCoords(bigButtonElement);
    return {
      left: Math.ceil(bigButtonElement.offsetLeft + bigButtonElementCoords.width / 2),
      top: Math.ceil(bigButtonElement.offsetTop + bigButtonElementCoords.height + BIG_BUTTON_ARROW_HEIGHT)
    };
  };

  var showCard = function (card) {
    removeCard();
    card.querySelector('.popup__close').addEventListener('click', function () {
      window.pin.deactivate();
      removeCard();
    });
    mapElement.insertBefore(card, document.querySelector('.map__filters-container'));
    renderedCard = mapElement.querySelector('.map__card');
    document.addEventListener('keydown', onEscapePressed);
  };

  var removeCard = function () {
    if (renderedCard) {
      window.tools.removeElement(renderedCard);
      renderedCard = null;
      document.removeEventListener('keydown', onEscapePressed);
    }
  };

  var onEscapePressed = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      window.pin.deactivate();
      removeCard();
    }
  };

  var disable = function () {
    if (!mapElement.classList.contains(mapElementRequiredClass)) {
      mapElement.classList.add(mapElementRequiredClass);
    }
    pageReady = false;
  };

  var setPageReady = function (ready) {
    pageReady = ready;
  };

  var initializeMap = function () {
    var enable = function () {
      var onSuccess = function (offers) {
        offersCache = offers;

        window.dialogs.closeErrorDialog();

        if (mapElement.classList.contains(mapElementRequiredClass)) {
          mapElement.classList.remove(mapElementRequiredClass);
        }
        fitMapWithOffers(offers);
        window.adForm.enable();
        window.mapFiltersForm.enable();

        pageReady = true;
      };

      var onError = function (/* errorCode, errorMsg */) {
        window.dialogs.showErrorDialog(function () {
          makeOffersRequest();
        });
      };

      var makeOffersRequest = function () {
        window.api.getOffers(onSuccess, onError);
      };

      if (!pageReady) {
        makeOffersRequest();
      }
    };

    bigButtonElement.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var bigButtonElementCoords = window.tools.getCoords(bigButtonElement);
      var bigButtonElementBounds = {
        left: {
          max: Math.ceil(mapElementCoords.width - bigButtonElementCoords.width / 2),
          min: -Math.ceil(bigButtonElementCoords.width / 2)
        },
        top: {
          max: Math.ceil(BIG_BUTTON_TOP_MAX - bigButtonElementCoords.height - BIG_BUTTON_ARROW_HEIGHT),
          min: Math.ceil(BIG_BUTTON_TOP_MIN - bigButtonElementCoords.height - BIG_BUTTON_ARROW_HEIGHT)
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

        var newTop = Math.ceil(bigButtonElement.offsetTop - shift.y);
        var newLeft = Math.ceil(bigButtonElement.offsetLeft - shift.x);

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

        var startCoordsBouds = {
          x: {
            min: Math.ceil(mapElementCoords.left /* + bigButtonElementCoords.width / 2 */),
            max: Math.ceil(mapElementCoords.left + mapElementCoords.width /* - bigButtonElementCoords.width / 2 */),
          },
          y: {
            min: Math.ceil(bigButtonElementBounds.top.min + bigButtonElementCoords.height / 2),
            max: Math.ceil(bigButtonElementBounds.top.max + bigButtonElementCoords.height / 2),
          }
        };

        var startCoordsX = moveEvt.clientX;
        if (startCoordsX < startCoordsBouds.x.min) {
          startCoordsX = startCoordsBouds.x.min;
        } else if (startCoordsX > startCoordsBouds.x.max) {
          startCoordsX = startCoordsBouds.x.max;
        }

        var startCoordsY = moveEvt.clientY;
        if (startCoordsY < startCoordsBouds.y.min) {
          startCoordsY = startCoordsBouds.y.min;
        } else if (startCoordsY > startCoordsBouds.y.max) {
          startCoordsY = startCoordsBouds.y.max;
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
        document.removeEventListener('contextmenu', onMouseUp);
      };

      bigButtonElement.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousemove', onMouseMove);
      bigButtonElement.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('contextmenu', onMouseUp);
      enable();
    });

    bigButtonElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.constants.ENTER_KEY_CODE) {
        enable();
      }
    });

    window.addEventListener('resize', function () {
      mapElementCoords = window.tools.getCoords(mapElement);
    });

    if (!mapElement.classList.contains(mapElementRequiredClass)) {
      mapElement.classList.add(mapElementRequiredClass);
    }

    centerBigButton();
  };

  var getOffersCache = function () {
    return offersCache;
  };

  window.map = {
    showCard: showCard,
    clearPins: clearPins,
    centerBigButton: centerBigButton,
    disablePage: disable,
    fitMapWithOffers: fitMapWithOffers,
    getOffersCache: getOffersCache,
    removeCard: removeCard,
    setPageReady: setPageReady
  };

  initializeMap();
  /* Code END */
})();
