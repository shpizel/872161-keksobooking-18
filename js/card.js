'use strict';

(function () {
  /* Constants START */// отвечает за создание карточки объявлений
  var OFFERS_TYPES_MAP = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var pluralize = window.tools.pluralize;
  var template = document.querySelector('#card').content;
  /* Constants END */

  /* Code START */
  var getCard = function (offerObject) {
    var card = template.cloneNode(true);
    card.querySelector('.popup__title').textContent = offerObject.offer.title;
    card.querySelector('.popup__text--address').textContent = offerObject.offer.address;
    card.querySelector('.popup__text--price').textContent = offerObject.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = OFFERS_TYPES_MAP[offerObject.offer.type];
    card.querySelector('.popup__text--capacity').textContent = ([
      offerObject.offer.rooms,
      pluralize(offerObject.offer.rooms, 'комната', 'комнаты', 'комнат'),
      'для',
      offerObject.offer.guests,
      'гостей'
    ]).join(' ');
    card.querySelector('.popup__text--time').textContent = ([
      'Заезд после',
      offerObject.offer.checkin + ',',
      'выезд до',
      offerObject.offer.checkout
    ]).join(' ');

    var popupFeatures = card.querySelector('.popup__features');
    popupFeatures.innerHTML = '';
    for (var i = 0; i < offerObject.offer.features.length; i++) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature');
      featureElement.classList.add('popup__feature--' + offerObject.offer.features[i]);
      popupFeatures.appendChild(featureElement);
    }

    card.querySelector('.popup__description').textContent = offerObject.offer.description;

    var popupPhotos = card.querySelector('.popup__photos');
    var popupPhotosElements = popupPhotos.querySelectorAll('*');
    for (i = 0; i < popupPhotosElements.length; i++) {
      popupPhotos.removeChild(popupPhotosElements[i]);
    }

    for (i = 0; i < offerObject.offer.photos.length; i++) {
      var photoElement = document.createElement('img');
      photoElement.className = 'popup__photo';
      photoElement.src = offerObject.offer.photos[i];
      photoElement.width = 45;
      photoElement.height = 40;
      photoElement.alt = 'Фотография жилья';
      popupPhotos.appendChild(photoElement);
    }

    card.querySelector('.popup__avatar').src = offerObject.author.avatar;
    return card;
  };

  window.card = {
    getCard: getCard
  };
  /* Code END */
})();
