'use strict';

(function () {
  /* Constants START */
  var OfferPhotoAttribute = {
    OFFER_PHOTO_CLASS_NAME: 'popup__photo',
    OFFER_PHOTO_WIDTH: 45,
    OFFER_PHOTO_HEIGHT: 40,
    OFFER_PHOTO_ALT: 'Фотография жилья'
  };

  var OfferType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var pluralize = window.tools.pluralize;
  var template = document.querySelector('#card').content;
  var removeElement = window.tools.removeNode;
  /* Constants END */

  /* Code START */
  var setAttributeIfConditionOrRemoveElement = function (condition, element, contentOrFunction, attribute) {
    if (condition) {
      element[attribute || 'textContent'] = (typeof contentOrFunction === 'function') ? contentOrFunction() : contentOrFunction;
    } else {
      removeElement(element);
    }
  };

  var appendChildIfConditionOrRemoveElement = function (condition, element, childOrFunction) {
    if (condition) {
      element.appendChild((typeof childOrFunction === 'function') ? childOrFunction() : childOrFunction);
    } else {
      removeElement(element);
    }
  };

  var getCard = function (offerObject) {
    var offer = offerObject.offer;

    var card = template.cloneNode(true);
    var titleNode = card.querySelector('.popup__title');
    var addressNode = card.querySelector('.popup__text--address');
    var priceNode = card.querySelector('.popup__text--price');
    var typeNode = card.querySelector('.popup__type');
    var capacityNode = card.querySelector('.popup__text--capacity');
    var timeNode = card.querySelector('.popup__text--time');
    var popupFeaturesNode = card.querySelector('.popup__features');
    var popupPhotosNode = card.querySelector('.popup__photos');
    var avatarNode = card.querySelector('.popup__avatar');
    var descriptionNode = card.querySelector('.popup__description');
    var popupPhotosNodes = popupPhotosNode.querySelectorAll('*');

    popupPhotosNodes.forEach(function (element) {
      removeElement(element);
    });
    popupFeaturesNode.innerHTML = '';

    setAttributeIfConditionOrRemoveElement(offer.title, titleNode, offer.title);
    setAttributeIfConditionOrRemoveElement(offer.description, descriptionNode, offer.description);
    setAttributeIfConditionOrRemoveElement(offer.address, addressNode, offer.address);
    setAttributeIfConditionOrRemoveElement(offer.price, priceNode, offer.price + '₽/ночь');
    setAttributeIfConditionOrRemoveElement(offer.type && OfferType.hasOwnProperty(offer.type), typeNode, OfferType[offer.type]);
    setAttributeIfConditionOrRemoveElement(offer.rooms && offer.guests, capacityNode, function () {
      return ([offer.rooms,
        pluralize(offer.rooms, 'комната', 'комнаты', 'комнат'),
        'для',
        offer.guests,
        'гостей'
      ]).join(' ');
    });

    setAttributeIfConditionOrRemoveElement(offer.checkin && offer.checkout, timeNode, function () {
      return (['Заезд после', offer.checkin + ',', 'выезд до', offer.checkout]).join(' ');
    });

    appendChildIfConditionOrRemoveElement(offer.features && offer.features.length, popupFeaturesNode, function () {
      var featuresFragment = document.createDocumentFragment();
      offer.features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add('popup__feature');
        featureElement.classList.add('popup__feature--' + feature);
        featuresFragment.appendChild(featureElement);
      });
      return featuresFragment;
    });

    appendChildIfConditionOrRemoveElement(offer.photos && offer.photos.length, popupPhotosNode, function () {
      var photosFragment = document.createDocumentFragment();
      offer.photos.forEach(function (photo) {
        var photoElement = document.createElement('img');
        photoElement.className = OfferPhotoAttribute.OFFER_PHOTO_CLASS_NAME;
        photoElement.src = photo;
        photoElement.width = OfferPhotoAttribute.OFFER_PHOTO_WIDTH;
        photoElement.height = OfferPhotoAttribute.OFFER_PHOTO_HEIGHT;
        photoElement.alt = OfferPhotoAttribute.OFFER_PHOTO_ALT;
        photosFragment.appendChild(photoElement);
      });
      return photosFragment;
    });

    setAttributeIfConditionOrRemoveElement(offerObject.author.avatar, avatarNode, function () {
      return offerObject.author.avatar;
    }, 'src');

    return card;
  };

  window.card = {
    getCard: getCard
  };
  /* Code END */
})();
