'use strict';

(function () {
  /* Constants START */
  var module = 'pin'; // отвечает за создание пина — метки на карте

  // var log = window.tools.log;
  var assertEmpty = window.tools.assertEmpty;
  var offerDOMElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  assertEmpty(offerDOMElementTemplate);
  /* Constants END */

  /* Code START */
  var getOfferPinElement = function (offer) {
    var element = offerDOMElementTemplate.cloneNode(true);
    element.style.left = offer.location.x + 'px';
    element.style.top = offer.location.y + 'px';

    var img = element.querySelector('img');
    img.src = offer.author.avatar;
    img.alt = offer.offer.title;

    element.addEventListener('click', function () {
      window.map.showCard(window.card.getCard(offer));
    });

    element.addEventListener('keydown', function (evt) {
      /* чтобы не срабатывал клик */
      evt.preventDefault();
      if (evt.keyCode === window.constants.ENTER_KEY_CODE) {
        window.map.showCard(window.card.getCard(offer));
      }
    });

    return element;
  };

  window[module] = {
    getOfferPinElement: getOfferPinElement
  };
  /* Code END */
})();
