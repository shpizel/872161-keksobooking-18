'use strict';

(function () {
  /* Constants START */
  var OFFERS_TYPES_MAP = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var pluralize = window.tools.pluralize;
  var template = document.querySelector('#card').content;
  var removeElement = window.tools.removeElement;
  /* Constants END */

  /* Code START */
  var getCard = function (offerObject) {
    var offer = offerObject.offer;

    var card = template.cloneNode(true);
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var popupFeatures = card.querySelector('.popup__features');
    var popupPhotos = card.querySelector('.popup__photos');
    var avatar = card.querySelector('.popup__avatar');
    var description = card.querySelector('.popup__description');
    var popupPhotosElements = popupPhotos.querySelectorAll('*');
    popupPhotosElements.forEach(function (element) {
      removeElement(element);
    });

    if (offer.title) {
      title.textContent = offer.title;
    } else {
      removeElement(title);
    }

    if (offer.description) {
      description.textContent = offer.description;
    } else {
      removeElement(description);
    }

    if (offer.address) {
      address.textContent = offer.address;
    } else {
      removeElement(address);
    }

    if (offer.price) {
      price.textContent = offer.price + '₽/ночь';
    } else {
      removeElement(price);
    }

    if (offer.type && OFFERS_TYPES_MAP.hasOwnProperty(offer.type)) {
      type.textContent = OFFERS_TYPES_MAP[offer.type];
    } else {
      removeElement(type);
    }

    if (offer.rooms && offer.guests) {
      capacity.textContent = ([
        offer.rooms,
        pluralize(offer.rooms, 'комната', 'комнаты', 'комнат'),
        'для',
        offer.guests,
        'гостей'
      ]).join(' ');
    } else {
      removeElement(capacity);
    }

    if (offer.checkin && offer.checkout) {
      time.textContent = ([
        'Заезд после',
        offer.checkin + ',',
        'выезд до',
        offer.checkout
      ]).join(' ');
    } else {
      removeElement(time);
    }

    if (offer.features && offer.features.length) {
      popupFeatures.innerHTML = '';
      offer.features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add('popup__feature');
        featureElement.classList.add('popup__feature--' + feature);
        popupFeatures.appendChild(featureElement);
      });
    } else {
      removeElement(popupFeatures);
    }

    if (offer.photos && offer.photos.length) {
      offer.photos.forEach(function (photo) {
        var photoElement = document.createElement('img');
        photoElement.className = 'popup__photo';
        photoElement.src = photo;
        photoElement.width = 45;
        photoElement.height = 40;
        photoElement.alt = 'Фотография жилья';
        popupPhotos.appendChild(photoElement);
      });
    } else {
      removeElement(popupPhotos);
    }

    if (offerObject.author.avatar) {
      avatar.src = offerObject.author.avatar;
    } else {
      removeElement(avatar);
    }

    return card;
  };

  window.card = {
    getCard: getCard
  };
  /* Code END */
})();
