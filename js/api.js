'use strict';

(function () {
  var API_OFFERS_URL = 'https://js.dump.academy/keksobooking/data';
  var DEFAULT_OFFERS_QUANTITY = 8;

  var getOffers = function (onSuccess, onError, quantity) {
    var _onSuccess = function (data) {
      onSuccess(data.slice(0, quantity || DEFAULT_OFFERS_QUANTITY));
    };

    var Request = new window.urllib.Request(_onSuccess, onError);
    Request.exec(API_OFFERS_URL);
  };

  window.api = {
    getOffers: getOffers
  }
})();
