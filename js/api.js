'use strict';

(function () {
  var API_OFFERS_URL = 'https://js.dump.academy/keksobooking/data';

  var getOffers = function (onSuccess, onError) {
    var _onSuccess = function (data) {
      onSuccess(data);
    };

    var Request = new window.urllib.Request(_onSuccess, onError);
    Request.exec(API_OFFERS_URL);
  };

  window.api = {
    getOffers: getOffers
  };
})();
