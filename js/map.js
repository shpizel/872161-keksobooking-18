'use strict';

(function () {
  /* Constants START */
  var MAP_OFFERS_MAX = 5;
  var BIG_BUTTON_ARROW_HEIGHT = 10;
  var BIG_BUTTON_TOP_MIN = 130;
  var BIG_BUTTON_TOP_MAX = 630;
  var REQUIRED_CLASS_NAME = 'map--faded';

  var mapNode = document.querySelector('.map');
  var pinsNode = mapNode.querySelector('.map__pins');
  var bigButtonNode = pinsNode.querySelector('.map__pin--main');
  /* Constants END */

  /* Variables START */
  var mapCoords = window.tools.getCoords(mapNode);
  var renderedCard;
  var pageReady = false;
  var lock = false;
  var offersCache;
  /* Variabled END */

  /* Code START */
  var fitMapWithOffers = function (offers) {
    if (offers.length > 0) {
      var fragment = document.createDocumentFragment();
      offers.forEach(function (offer, index) {
        if (index <= MAP_OFFERS_MAX - 1) {
          fragment.appendChild(window.pin.generatePinNode(offer));
        }
      });
      pinsNode.appendChild(fragment);
    }
  };

  var fillAdFormAddress = function () {
    window.adForm.setAddress(Object.values(getBigButtonCoordinates()).join(', '));
  };

  var centerBigButton = function () {
    var bigButtonCoordinates = window.tools.getCoords(bigButtonNode);
    bigButtonNode.style.left = Math.ceil(mapCoords.width / 2 - bigButtonCoordinates.width / 2) + 'px';
    bigButtonNode.style.top = Math.ceil(mapCoords.height / 2 - bigButtonCoordinates.height / 2) + 'px';
    fillAdFormAddress();
  };

  var clearPins = function () {
    pinsNode.querySelectorAll('.map__pin').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        window.tools.removeNode(element);
      }
    });
  };

  var getBigButtonCoordinates = function () {
    var bigButtonCoords = window.tools.getCoords(bigButtonNode);
    return {
      left: Math.ceil(bigButtonNode.offsetLeft + bigButtonCoords.width / 2),
      top: Math.ceil(bigButtonNode.offsetTop + bigButtonCoords.height + BIG_BUTTON_ARROW_HEIGHT)
    };
  };

  var showCard = function (card) {
    removeCard();
    card.querySelector('.popup__close').addEventListener('click', function () {
      window.pin.deactivate();
      removeCard();
    });
    mapNode.insertBefore(card, document.querySelector('.map__filters-container'));
    renderedCard = mapNode.querySelector('.map__card');
    document.addEventListener('keydown', onEscapePressed);
  };

  var removeCard = function () {
    if (renderedCard) {
      window.tools.removeNode(renderedCard);
      renderedCard = null;
      document.removeEventListener('keydown', onEscapePressed);
    }
  };

  var onEscapePressed = window.tools.onEscPressed(function () {
    window.pin.deactivate();
    removeCard();
  });

  var disable = function () {
    if (!mapNode.classList.contains(REQUIRED_CLASS_NAME)) {
      mapNode.classList.add(REQUIRED_CLASS_NAME);
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

        if (mapNode.classList.contains(REQUIRED_CLASS_NAME)) {
          mapNode.classList.remove(REQUIRED_CLASS_NAME);
        }
        fitMapWithOffers(offers);
        window.adForm.enable();
        window.mapFiltersForm.enable();

        pageReady = true;
        lock = false;
      };

      var onError = function (/* errorCode, errorMsg */) {
        lock = false;
        window.dialogs.showErrorDialog(function () {
          makeOffersRequest();
        });
      };

      var makeOffersRequest = function () {
        window.api.getOffers(onSuccess, onError);
      };

      if (!pageReady && !lock) {
        lock = true;
        makeOffersRequest();
      }
    };

    bigButtonNode.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var bigButtonCoords = window.tools.getCoords(bigButtonNode);
      var bigButtonBounds = {
        left: {
          max: Math.ceil(mapCoords.width - bigButtonCoords.width / 2),
          min: -Math.ceil(bigButtonCoords.width / 2)
        },
        top: {
          max: Math.ceil(BIG_BUTTON_TOP_MAX - bigButtonCoords.height - BIG_BUTTON_ARROW_HEIGHT),
          min: Math.ceil(BIG_BUTTON_TOP_MIN - bigButtonCoords.height - BIG_BUTTON_ARROW_HEIGHT)
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

        var newTop = Math.ceil(bigButtonNode.offsetTop - shift.y);
        var newLeft = Math.ceil(bigButtonNode.offsetLeft - shift.x);

        if (newLeft < bigButtonBounds.left.min) {
          newLeft = bigButtonBounds.left.min;
        } else if (newLeft > bigButtonBounds.left.max) {
          newLeft = bigButtonBounds.left.max;
        }

        if (newTop < bigButtonBounds.top.min) {
          newTop = bigButtonBounds.top.min;
        } else if (newTop > bigButtonBounds.top.max) {
          newTop = bigButtonBounds.top.max;
        }

        var startCoordsBouds = {
          x: {
            min: Math.ceil(mapCoords.left /* + bigButtonElementCoords.width / 2 */),
            max: Math.ceil(mapCoords.left + mapCoords.width /* - bigButtonElementCoords.width / 2 */),
          },
          y: {
            min: Math.ceil(bigButtonBounds.top.min + bigButtonCoords.height / 2),
            max: Math.ceil(bigButtonBounds.top.max + bigButtonCoords.height / 2),
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

        bigButtonNode.style.top = newTop + 'px';
        bigButtonNode.style.left = newLeft + 'px';

        fillAdFormAddress();
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        fillAdFormAddress();

        bigButtonNode.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mousemove', onMouseMove);
        bigButtonNode.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('contextmenu', onMouseUp);
      };

      bigButtonNode.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousemove', onMouseMove);
      bigButtonNode.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('contextmenu', onMouseUp);
      enable();
    });

    bigButtonNode.addEventListener('keydown', window.tools.onEnterPressed(enable));

    window.addEventListener('resize', function () {
      mapCoords = window.tools.getCoords(mapNode);
    });

    if (!mapNode.classList.contains(REQUIRED_CLASS_NAME)) {
      mapNode.classList.add(REQUIRED_CLASS_NAME);
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
