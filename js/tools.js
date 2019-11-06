'use strict';

(function () {
  /* Code START */
  var getCoords = function (element) {
    var box = element.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      width: box.width,
      height: box.height
    };
  };

  var getRandomNumber = function (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
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

  var getRandomChoice = function (array, length) {
    return (length) ? shuffle(array).slice(0, length) : array[getRandomNumber(0, array.length - 1)];
  };

  var addLeadingZero = function (number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {
      s = '0' + s;
    }
    return s;
  };

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

  window.tools = {
    shuffle: shuffle,
    getRandomNumber: getRandomNumber,
    getRandomChoice: getRandomChoice,
    getCoords: getCoords,
    addLeadingZero: addLeadingZero,
    pluralize: pluralize,
  };
  /* Code END */
})();
