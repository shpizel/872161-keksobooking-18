'use strict';

(function () {
  /* Constants START */
  var ACTIVE_PIN_CLASSNAME = 'map__pin--active';
  var offerDOMElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  /* Constants END */

  /* Variables START */
  var activePin;
  /* Variables END */

  /* Code START */
  var activate = function (element) {
    deactivate();
    element.classList.add(ACTIVE_PIN_CLASSNAME);
    activePin = element;
  };

  var deactivate = function () {
    if (activePin && activePin.classList.contains(ACTIVE_PIN_CLASSNAME)) {
      activePin.classList.remove(ACTIVE_PIN_CLASSNAME);
      activePin = undefined;
    }
  };

  var getOfferPinElement = function (offer) {
    var element = offerDOMElementTemplate.cloneNode(true);
    element.style.left = offer.location.x + 'px';
    element.style.top = offer.location.y + 'px';

    var img = element.querySelector('img');
    img.src = offer.author.avatar;
    img.alt = offer.offer.title;

    element.addEventListener('click', function (evt) {
      activate(evt.currentTarget);
      window.map.showCard(window.card.getCard(offer));
    });

    element.addEventListener('keydown', window.tools.onEnterPressed(function (evt) {
      evt.preventDefault();
      activate(evt.currentTarget);
      window.map.showCard(window.card.getCard(offer));
    }));

    return element;
  };

  window.pin = {
    getOfferPinElement: getOfferPinElement,
    deactivate: deactivate
  };
  /* Code END */
})();
