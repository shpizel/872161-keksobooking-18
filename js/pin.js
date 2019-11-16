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
    }
  };

  var generateNode = function (offer) {
    var pinNode = pinTemplate.cloneNode(true);
    pinNode.style.left = offer.location.x + 'px';
    pinNode.style.top = offer.location.y + 'px';

    var img = pinNode.querySelector('img');
    img.src = offer.author.avatar;
    img.alt = offer.offer.title;

    var onClick = function (evt) {
      activate(evt.currentTarget);
      window.map.showCard(window.card.generateNode(offer));
    };
    pinNode.addEventListener('click', onClick);

    var onKeydown = window.tools.onEnterPressed(function (evt) {
      evt.preventDefault();
      activate(evt.currentTarget);
      var card = window.card.generateNode(offer);
      window.map.showCard(card);
    });
    pinNode.addEventListener('keydown', onKeydown);

    return pinNode;
  };

  window.pin = {
    generateNode: generateNode,
    deactivate: deactivate
  };
  /* Code END */
})();
