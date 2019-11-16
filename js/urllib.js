'use strict';

(function () {
  /* Constants START */
  var DEFAULT_TIMEOUT = 5000;
  var DEFAULT_RESPONSE_TYPE = 'json';
  var DEFAULT_METHOD = 'GET';
  /* Constants END */

  /* Code START */
  var Request = function (onSuccess, onError, responseType, timeout) {
    var onErrorWrapper = function () {
      return onError(xhr.status, xhr.statusText);
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = responseType || DEFAULT_RESPONSE_TYPE;
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

    this.xhr = xhr;
  };

  Request.prototype.exec = function (url, method, payload) {
    this.xhr.open(method || DEFAULT_METHOD, url);
    this.xhr.send(payload);
  };

  window.urllib = {
    Request: Request
  };
  /* Code END */
}());
