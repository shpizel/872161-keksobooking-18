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

var renderCard = function (offer) {
  var card = document.querySelector('#card').content.cloneNode(true);
  card.querySelector('.popup__title').textContent = offer.offer.title;
  card.querySelector('.popup__text--address').textContent = offer.offer.address;
  card.querySelector('.popup__text--price').textContent = offer.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  }[offer.offer.type];

  card.querySelector('.popup__text--capacity').textContent = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;

  var popupFeatures = card.querySelector('.popup__features');
  var popupFeaturesElements = popupFeatures.querySelectorAll('li');
  for (var i = 0; i < popupFeaturesElements.length; i++) {
    popupFeatures.removeChild(popupFeaturesElements[i]);
  }

  for (i = 0; i < offer.offer.features.length; i++) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature');
    featureElement.classList.add('popup__feature--' + offer.offer.features[i]);
    popupFeatures.appendChild(featureElement);
  }

  card.querySelector('.popup__description').textContent = offer.offer.description;

  var popupPhotos = card.querySelector('.popup__photos');
  var popupPhotosElements = popupPhotos.querySelectorAll('*');
  for (i = 0; i < popupPhotosElements.length; i++) {
    popupPhotos.removeChild(popupPhotosElements[i]);
  }

  for (i = 0; i < offer.offer.photos.length; i++) {
    var photoElement = document.createElement('img');
    photoElement.className = 'popup__photo';
    photoElement.src = offers[0].offer.photos[i];
    photoElement.width = 45;
    photoElement.height = 40;
    photoElement.alt = 'Фотография жилья';
    popupPhotos.appendChild(photoElement);
  }

  card.querySelector('.popup__avatar').src = offer.author.avatar;

  document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));
};

var offers = getRandomOffers(QUANTITY);
fitMapWithOffers(offers);
renderCard(offers[0]);
showMapBlock();
