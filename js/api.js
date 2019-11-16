'use strict';

(function () {
  var API_OFFERS_URL = 'https://js.dump.academy/keksobooking/data';
  var OFFER_REQUIRED_FIELD = 'offer';

  var getOffers = function (onSuccess, onError) {
    var _onSuccess = function (data) {
      onSuccess(data.filter(function (element) {
        return element.hasOwnProperty(OFFER_REQUIRED_FIELD) && typeof element[OFFER_REQUIRED_FIELD] === 'object';
      }));
    };

    var Request = new window.urllib.Request(_onSuccess, onError);
    Request.exec(API_OFFERS_URL);
  };

  window.api = {
    getOffers: getOffers
  };
})();
