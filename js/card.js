'use strict';

(function () {
  /* Constants START */
  var Attribute = {
    TEXT_CONTENT: 'textContent',
    APPEND_CHILD: 'appendChild',
    SRC: 'src'
  };

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
  var template = document.querySelector('#card').content.querySelector('article.map__card');
  /* Constants END */

  /* Code START */
  var getFeaturesNodeGenerator = function (offer) {
    return function () {
      var featuresFragment = document.createDocumentFragment();
      offer.features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add('popup__feature');
        featureElement.classList.add('popup__feature--' + feature);
        featuresFragment.appendChild(featureElement);
      });
      return featuresFragment;
    };
  };

  var getPriceTextGenerator = function (offer) {
    return function () {
      return offer.price + '₽/ночь';
    };
  };

  var getTypeTextGenerator = function (offer) {
    return function () {
      return OfferType[offer.type];
    };
  };

  var getCapacityNodeGenerator = function (offer) {
    return function () {
      return ([offer.rooms,
        pluralize(offer.rooms, 'комната', 'комнаты', 'комнат'),
        'для',
        offer.guests,
        'гостей'
      ]).join(' ');
    };
  };

  var getTimeTextGenerator = function (offer) {
    return function () {
      return (['Заезд после', offer.checkin + ',', 'выезд до', offer.checkout]).join(' ');
    };
  };

  var getPhotosNodeGenerator = function (offer) {
    return function () {
      var photosFragment = document.createDocumentFragment();
      offer.photos.forEach(function (photo) {
        var photoNode = document.createElement('img');
        photoNode.className = OfferPhotoAttribute.OFFER_PHOTO_CLASS_NAME;
        photoNode.src = photo;
        photoNode.width = OfferPhotoAttribute.OFFER_PHOTO_WIDTH;
        photoNode.height = OfferPhotoAttribute.OFFER_PHOTO_HEIGHT;
        photoNode.alt = OfferPhotoAttribute.OFFER_PHOTO_ALT;
        photosFragment.appendChild(photoNode);
      });
      return photosFragment;
    };
  };

  var generateRule = function (node, condition, attribute, contentFunctionOrScalar) {
    return {
      node: node,
      condition: condition,
      attribute: attribute,
      contentFunctionOrScalar: contentFunctionOrScalar
    };
  };

  var getAvatarSourceGenerator = function (offerObject) {
    return function () {
      return offerObject.author.avatar;
    };
  };

  var generateNode = function (offerObject) {
    var card = template.cloneNode(true);
    var titleNode = card.querySelector('.popup__title');
    var addressNode = card.querySelector('.popup__text--address');
    var priceNode = card.querySelector('.popup__text--price');
    var typeNode = card.querySelector('.popup__type');
    var capacityNode = card.querySelector('.popup__text--capacity');
    var timeNode = card.querySelector('.popup__text--time');
    var featuresNode = card.querySelector('.popup__features');
    var photosNode = card.querySelector('.popup__photos');
    var avatarNode = card.querySelector('.popup__avatar');
    var descriptionNode = card.querySelector('.popup__description');
    var popupPhotosNodes = photosNode.querySelectorAll('*');

    var offer = offerObject.offer;

    popupPhotosNodes.forEach(function (element) {
      window.tools.removeNode(element);
    });
    featuresNode.innerHTML = '';

    var rules = [
      generateRule(titleNode, offer.title && offer.title.length > 0, Attribute.TEXT_CONTENT, offer.title),
      generateRule(descriptionNode, offer.description && offer.description.length > 0, Attribute.TEXT_CONTENT, offer.description),
      generateRule(addressNode, offer.address && offer.address.length > 0, Attribute.TEXT_CONTENT, offer.address),
      generateRule(priceNode, offer.price && offer.price.length > 0, Attribute.TEXT_CONTENT, getPriceTextGenerator(offer)),
      generateRule(typeNode, offer.type && OfferType.hasOwnProperty(offer.type), Attribute.TEXT_CONTENT, getTypeTextGenerator(offer)),
      generateRule(capacityNode, offer.rooms && offer.guests, Attribute.TEXT_CONTENT, getCapacityNodeGenerator(offer)),
      generateRule(timeNode, offer.checkin && offer.checkout, Attribute.TEXT_CONTENT, getTimeTextGenerator(offer)),
      generateRule(featuresNode, offer.features && offer.features.length, Attribute.APPEND_CHILD, getFeaturesNodeGenerator(offer)),
      generateRule(photosNode, offer.photos && offer.photos.length, Attribute.APPEND_CHILD, getPhotosNodeGenerator(offer)),
      generateRule(avatarNode, offerObject.author.avatar, Attribute.SRC, getAvatarSourceGenerator(offerObject))
    ];

    rules.forEach(function (rule) {
      if (rule.condition) {
        var content = (typeof rule.contentFunctionOrScalar === window.constants.FUNCTION_TYPE)
          ? rule.contentFunctionOrScalar()
          : rule.contentFunctionOrScalar;

        if (typeof rule.node[rule.attribute] === window.constants.FUNCTION_TYPE) {
          rule.node[rule.attribute](content);
        } else {
          rule.node[rule.attribute] = content;
        }
      } else {
        window.tools.removeNode(rule.node);
      }
    });

    return card;
  };

  window.card = {
    generateNode: generateNode
  };
  /* Code END */
})();
