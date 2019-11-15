'use strict';

(function () {
  /* Constants START */
  var ACTIVE_PIN_CLASS_NAME = 'map__pin--active';
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  /* Constants END */

  /* Variables START */
  var activePinNode;
  /* Variables END */

  /* Code START */
  var activate = function (element) {
    deactivate();
    element.classList.add(ACTIVE_PIN_CLASS_NAME);
    activePinNode = element;
  };

  var deactivate = function () {
    if (activePinNode && activePinNode.classList.contains(ACTIVE_PIN_CLASS_NAME)) {
      activePinNode.classList.remove(ACTIVE_PIN_CLASS_NAME);
      activePinNode = undefined;
    }
  };

  var generatePinNode = function (offer) {
    var element = pinTemplate.cloneNode(true);
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
    generatePinNode: generatePinNode,
    deactivate: deactivate
  };
  /* Code END */
})();
