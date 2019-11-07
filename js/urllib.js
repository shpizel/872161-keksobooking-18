'use strict';

(function () {
  /* Constants START */
  var DEFAULT_TIMEOUT = 5000;
  var DEFAULT_RESPONSE_TYPE = 'json';
  var DEFAULT_METHOD = 'GET';
  var DEFAULT_ASYNC = true;
  /* Constants END */

  /* Code START */
  var request = function (onSuccess, onError, responseType, async, timeout) {
    var onErrorWrapper = function () {
      return onError(xhr.status, xhr.statusText);
    };

    var xhr = new XMLHttpRequest();
    if (!async) {
      xhr.responseType = responseType || DEFAULT_RESPONSE_TYPE;
    }
    xhr.timeout = timeout || DEFAULT_TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onErrorWrapper();
      }
    });

    xhr.addEventListener('error', onErrorWrapper);
    xhr.addEventListener('timeout', onErrorWrapper);

    return function (url, method, payload) {
      xhr.open(method || DEFAULT_METHOD, url, (async === undefined) ? DEFAULT_ASYNC : async);
      xhr.send(payload);
    };
  };

  window.urllib = {
    request: request
  };
  /* Code END */
}());
