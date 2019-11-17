'use strict';

(function () {
  /* Constants START */
  var DEFAULT_DEBOUNCE_INTERVAL = 500;
  /* Constants END */

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

  var disableNodes = function (nodes) {
    nodes.forEach(function (node) {
      var targetElement = (node.parentNode.tagName === 'FIELDSET') ? node.parentNode : node;
      if (!targetElement.disabled) {
        targetElement.disabled = true;
      }
    });
  };

  var enableNodes = function (nodes) {
    nodes.forEach(function (node) {
      var targetElement = (node.parentNode.tagName === 'FIELDSET') ? node.parentNode : node;
      if (targetElement.disabled) {
        targetElement.disabled = false;
      }
    });
  };

  var debounce = function (callback, timeout) {
    var timer;

    return function () {
      var context = null;
      var args = arguments;

      var later = function () {
        timer = null;
        callback.apply(context, args);
      };

      clearTimeout(timer);
      timer = setTimeout(later, timeout || DEFAULT_DEBOUNCE_INTERVAL);
    };
  };

  var removeNode = function (element) {
    if (element && element.parentNode && element.parentNode.removeChild) {
      element.parentNode.removeChild(element);
    }
  };

  var onEscPressed = function (callback) {
    return function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        callback.apply(null, arguments);
      }
    };
  };

  var onEnterPressed = function (callback) {
    return function (evt) {
      if (evt.keyCode === window.constants.ENTER_KEY_CODE) {
        callback.apply(null, arguments);
      }
    };
  };

  var readFiles = function (callback, availableExts, allFiles) {
    return function (evt) {
      var target = evt.currentTarget;
      var files = Object.values(target.files);
      if (!allFiles) {
        files = files.slice(0, 1);
      }
      files.forEach(function (file) {
        var fileName = file.name.toLowerCase();
        var matches = availableExts.some(function (it) {
          return fileName.endsWith(it);
        });
        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function () {
            callback(reader.result);
          });
          reader.readAsDataURL(file);
        }
      });
    };
  };

  window.tools = {
    shuffle: shuffle,
    getRandomNumber: getRandomNumber,
    getRandomChoice: getRandomChoice,
    getCoords: getCoords,
    addLeadingZero: addLeadingZero,
    pluralize: pluralize,
    disableNodes: disableNodes,
    enableNodes: enableNodes,
    debounce: debounce,
    removeNode: removeNode,
    onEscPressed: onEscPressed,
    onEnterPressed: onEnterPressed,
    readFiles: readFiles
  };
  /* Code END */
})();
