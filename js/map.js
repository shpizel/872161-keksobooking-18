'use strict';

(function () {
  /* Constants START */
  var MAP_OFFERS_MAX = 5;
  var BIG_BUTTON_ARROW_HEIGHT = 10;
  var BIG_BUTTON_TOP_MIN = 130;
  var BIG_BUTTON_TOP_MAX = 630;
  var REQUIRED_CLASS_NAME = 'map--faded';
  var BIG_BUTTON_CLASS_NAME = 'map__pin--main';
  var PIN_CLASS_NAME = 'map__pin';
  var OFFERS_LOAD_ERROR_MESSAGE = 'Не удалось загрузить похожие объявления';

  var mapNode = document.querySelector('.map');
  var pinsNode = mapNode.querySelector('.map__pins');
  var bigButtonNode = pinsNode.querySelector('.' + BIG_BUTTON_CLASS_NAME);
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  /* Constants END */

  /* Variables START */
  var mapCoords = window.tools.getCoords(mapNode);
  var cardNode;
  var pageReady = false;
  var lock = false;
  var offersCache;
  /* Variabled END */

  /* Code START */
  var fitMapWithOffers = function (offers) {
    if (offers.length > 0) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < Math.min(MAP_OFFERS_MAX, offers.length); i++) {
        fragment.appendChild(window.pin.generateNode(offers[i]));
      }
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
    var selector = '.' + PIN_CLASS_NAME + ':not(.' + BIG_BUTTON_CLASS_NAME + ')';
    pinsNode.querySelectorAll(selector).forEach(function (node) {
      window.tools.removeNode(node);
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
    var onClick = function () {
      window.pin.deactivate();
      removeCard();
    };
    card.querySelector('.popup__close').addEventListener('click', onClick);
    mapNode.insertBefore(card, mapFiltersContainer);
    cardNode = mapNode.querySelector('.map__card');
    document.addEventListener('keydown', onEscPressed);
  };

  var removeCard = function () {
    window.tools.removeNode(cardNode);
    document.removeEventListener('keydown', onEscPressed);
  };

  var onEscPressed = window.tools.onEscPressed(function () {
    window.pin.deactivate();
    removeCard();
  });

  var disablePage = function () {
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
        if (mapNode.classList.contains(REQUIRED_CLASS_NAME)) {
          mapNode.classList.remove(REQUIRED_CLASS_NAME);
        }
        offersCache = offers;
        fitMapWithOffers(offers);
        window.adForm.enable();
        window.mapFiltersForm.enable();
        pageReady = true;
        lock = false;
      };

      var onError = function () {
        lock = false;
        window.dialogs.showError(OFFERS_LOAD_ERROR_MESSAGE, function () {
          lock = true;
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

    var onBigButtonMouseDown = function (evt) {
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

        var startCoordsBounds = {
          x: {
            min: Math.ceil(mapCoords.left),
            max: Math.ceil(mapCoords.left + mapCoords.width),
          },
          y: {
            min: Math.ceil(bigButtonBounds.top.min + bigButtonCoords.height / 2),
            max: Math.ceil(bigButtonBounds.top.max + bigButtonCoords.height / 2),
          }
        };

        var startCoordsX = moveEvt.clientX;
        if (startCoordsX < startCoordsBounds.x.min) {
          startCoordsX = startCoordsBounds.x.min;
        } else if (startCoordsX > startCoordsBounds.x.max) {
          startCoordsX = startCoordsBounds.x.max;
        }

        var startCoordsY = moveEvt.clientY;
        if (startCoordsY < startCoordsBounds.y.min) {
          startCoordsY = startCoordsBounds.y.min;
        } else if (startCoordsY > startCoordsBounds.y.max) {
          startCoordsY = startCoordsBounds.y.max;
        }

        startCoords = {
          x: startCoordsX,
          y: startCoordsY
        };

        bigButtonNode.style.top = newTop + 'px';
        bigButtonNode.style.left = newLeft + 'px';

        fillAdFormAddress();
      };

      var onContextMenu = function (contextMenuEvt) {
        contextMenuEvt.preventDefault();
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        fillAdFormAddress();

        bigButtonNode.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mousemove', onMouseMove);
        bigButtonNode.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('contextmenu', onContextMenu);
      };

      bigButtonNode.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousemove', onMouseMove);
      bigButtonNode.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('contextmenu', onContextMenu);
      enable();
    };

    bigButtonNode.addEventListener('mousedown', onBigButtonMouseDown);
    bigButtonNode.addEventListener('keydown', window.tools.onEnterPressed(enable));

    var onResize = function () {
      mapCoords = window.tools.getCoords(mapNode);
    };
    window.addEventListener('resize', onResize);

    if (!mapNode.classList.contains(REQUIRED_CLASS_NAME)) {
      mapNode.classList.add(REQUIRED_CLASS_NAME);
    }

    centerBigButton();
  };

  var getOffersCache = function () {
    return offersCache;
  };

  var resetAndDisable = function () {
    removeCard();
    clearPins();
    centerBigButton();
    setPageReady(false);
    disablePage();
  };

  window.map = {
    resetAndDisable: resetAndDisable,
    showCard: showCard,
    clearPins: clearPins,
    centerBigButton: centerBigButton,
    disablePage: disablePage,
    fitMapWithOffers: fitMapWithOffers,
    getOffersCache: getOffersCache,
    removeCard: removeCard,
    setPageReady: setPageReady
  };

  initializeMap();
  /* Code END */
})();
