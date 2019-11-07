'use strict';

(function () {
  /* Constants START */
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

  var OFFERS_URL = 'https://js.dump.academy/keksobooking/data';

  var getRandomNumber = window.tools.getRandomNumber;
  var addLeadingZero = window.tools.addLeadingZero;
  var getRandomChoice = window.tools.getRandomChoice;
  /* Constants END */

  /* Variables START */
  var lastAvatarImgIndex = 0;
  /* Variables END */

  /* Code START */

  var getAvatarImgUrl = function () {
    var url = 'img/avatars/user' + addLeadingZero(++lastAvatarImgIndex) + '.png';
    if (lastAvatarImgIndex >= 8) {
      lastAvatarImgIndex = 0;
    }
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

  var getRandomOffers = function (quantity) {
    var ret = [];
    for (var i = 0; i < quantity; i++) {
      ret.push(getRandomOffer());
    }
    return ret;
  };

  var getOffers = function (onSuccess, onError, quantity) {
    var _onSuccess = function (data) {
      onSuccess(data.slice(0, quantity || QUANTITY));
    };
    window.urllib.request(_onSuccess, onError)(OFFERS_URL);
  };

  window.data = {
    randomOffers: getRandomOffers(QUANTITY),
    getOffers: getOffers
  };
  /* CODE END */
})();
