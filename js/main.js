'use strict';

var QUANTITY = 8;
var OFFER_PRICE_FROM = 1000;
var OFFER_PRICE_TO = 50000;
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_ROOMS_MIN = 1;
var OFFER_ROOMS_MAX = 5;
var OFFER_GUESTS_MIN = 2;
var OFFER_GUESTS_MAX = 6;
var OFFER_CHECKIN_VARIANTS = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUT_VARIANTS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFERS_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MAP_WIDTH = 1024;
var PIN_Y_FROM = 130;
var PIN_Y_TO = 630;
var OFFERS_TYPES_MAP = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};


var addLeadingZero = function (number, size) {
  var s = String(number);
  while (s.length < (size || 2)) {
    s = '0' + s;
  }
  return s;
};

var shuffle = function (a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * i);
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
};

var getRandomNumber = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var getRandomChoice = function (array, length) {
  return (length) ? shuffle(array).slice(0, length) : array[getRandomNumber(0, array.length - 1)];
};

var lastAvatarImgIndex = 0;
var getAvatarImgUrl = function () {
  var url = 'img/avatars/user' + addLeadingZero(++lastAvatarImgIndex) + '.png';
  return url;
};

var getRandomOffer = function () {
  return {
    'author': {
      'avatar': getAvatarImgUrl(),
    },
    'offer': {
      'title': 'строка, заголовок предложения',
      'address': '600, 350',
      'price': getRandomNumber(OFFER_PRICE_FROM, OFFER_PRICE_TO),
      'type': getRandomChoice(OFFER_TYPES),
      'rooms': getRandomNumber(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
      'guests': getRandomNumber(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
      'checkin': getRandomChoice(OFFER_CHECKIN_VARIANTS),
      'checkout': getRandomChoice(OFFER_CHECKOUT_VARIANTS),
      'features': getRandomChoice(OFFER_FEATURES, getRandomNumber(1, 6)),
      'description': 'строка с описанием',
      'photos': getRandomChoice(OFFERS_PHOTOS, getRandomNumber(1, 3)),
    },
    'location': {
      'x': getRandomNumber(0, MAP_WIDTH),
      'y': getRandomNumber(PIN_Y_FROM, PIN_Y_TO)
    }
  };
};

var getRandomOfferDOMElement = function (offer) {
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var element = template.cloneNode(true);
  element.style.left = offer.location.x + 'px';
  element.style.top = offer.location.y + 'px';
  var img = element.querySelector('img');
  img.src = offer.author.avatar;
  img.alt = offer.offer.title;
  return element;
};

var getRandomOffers = function (quantity) {
  var ret = [];
  for (var i = 0; i < quantity; i++) {
    ret.push(getRandomOffer());
  }
  return ret;
};

var fitMapWithOffers = function (offers) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var offerId = 0; offerId < offers.length; offerId++) {
    fragment.appendChild(getRandomOfferDOMElement(offers[offerId]));
  }
  mapPins.appendChild(fragment);
};

var showMapBlock = function () {
  document.querySelector('.map').classList.remove('map--faded');
};

var renderCard = function (offerObject) {
  var pluralize = function (count, one, two, three) {
    if (!Number.isInteger(count)) {
      return two;
    }
    var rem = count % 10;
    var isStrangeInterval = function () {
      var lastTwoDigitsNumber = Math.ceil(count / 10 % 10 * 10);
      return lastTwoDigitsNumber >= 11 && lastTwoDigitsNumber <= 20;
    };

    if (isStrangeInterval()) {
      return three;
    }

    if (rem > 1 && rem < 5) {
      return two;
    }

    return (rem === 1) ? one : three;
  };

  var card = document.querySelector('#card').content.cloneNode(true);
  card.querySelector('.popup__title').textContent = offerObject.offer.title;
  card.querySelector('.popup__text--address').textContent = offerObject.offer.address;
  card.querySelector('.popup__text--price').textContent = offerObject.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = OFFERS_TYPES_MAP[offerObject.offer.type];

  card.querySelector('.popup__text--capacity').textContent = offerObject.offer.rooms + ' ' + pluralize(offerObject.offer.rooms, 'комната', 'комнаты', 'комнат') + ' для ' + offerObject.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerObject.offer.checkin + ', выезд до ' + offerObject.offer.checkout;

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

  document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));
};

var offers = getRandomOffers(QUANTITY);
fitMapWithOffers(offers);
renderCard(offers[0]);
showMapBlock();
