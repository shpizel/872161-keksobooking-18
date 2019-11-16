'use strict';

(function () {
  /* Constants START */
  var ANY_VALUE = 'any';
  var PriceSettings = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: 1000000
    }
  };

  var formNode = document.querySelector('.map__filters');
  var inputsList = formNode.querySelectorAll('fieldset,input,select');
  var housingTypeNode = formNode.querySelector('select[name=housing-type]');
  var housingPriceNode = formNode.querySelector('select[name=housing-price]');
  var housingRoomsNode = formNode.querySelector('select[name=housing-rooms]');
  var housingGuestsNode = formNode.querySelector('select[name=housing-guests]');
  var featuresCheckboxesList = formNode.querySelectorAll('input[name=features]');

  var debounce = window.tools.debounce;
  /* Constants END */

  /* Code START */
  var enable = function () {
    window.tools.enableElements(inputsList);
  };

  var disable = function () {
    window.tools.disableElements(inputsList);
  };

  var checkByHousingType = function (offer) {
    if (housingTypeNode.value !== ANY_VALUE) {
      return offer.type === housingTypeNode.value;
    }
    return true;
  };

  var checkByHousingPrice = function (offer) {
    if (housingPriceNode.value !== ANY_VALUE) {
      var mapping = PriceSettings[housingPriceNode.value];
      return offer.price >= mapping.min && offer.price <= mapping.max;
    }
    return true;
  };

  var checkByHousingRooms = function (offer) {
    if (housingRoomsNode.value !== ANY_VALUE) {
      return offer.rooms === parseInt(housingRoomsNode.value, 10);
    }
    return true;
  };

  var checkByHousingGuests = function (offer) {
    if (housingGuestsNode.value !== ANY_VALUE) {
      var guests = parseInt(housingGuestsNode.value, 10);
      if (guests === 0) {
        return offer.guests > 3;
      }
      return offer.guest === guests;
    }
    return true;
  };

  var checkByFeatures = function (features, offer) {
    if (features.length > 0) {
      var offerFeatures = offer.features;
      for (var i = 0; i < features.length; i++) {
        if (!offerFeatures.includes(features[i])) {
          return false;
        }
      }
    }
    return true;
  };

  var filterOffers = function (offers) {
    var selectedFeatures = Array.from(featuresCheckboxesList).filter(function (element) {
      return element.checked;
    }).map(function (element) {
      return element.value;
    });

    return offers.filter(function (offerObject) {
      var housingTypeCheckResult = checkByHousingType(offerObject.offer);
      var housingPriceCheckResult = checkByHousingPrice(offerObject.offer);
      var housingRoomsCheckResult = checkByHousingRooms(offerObject.offer);
      var housingGuestsCheckResult = checkByHousingGuests(offerObject.offer);
      var featuresCheckResult = checkByFeatures(selectedFeatures, offerObject.offer);

      var result = (
        housingTypeCheckResult
        && housingPriceCheckResult
        && housingRoomsCheckResult
        && housingGuestsCheckResult
        && featuresCheckResult
      );

      return result;
    });
  };

  var initEvents = function () {
    var onChange = function () {
      window.map.removeCard();
      var offers = window.map.getOffersCache();
      if (offers) {
        window.map.clearPins();
        var filteredOffers = filterOffers(offers);
        window.map.fitMapWithOffers(filteredOffers);
      }
    };
    formNode.addEventListener('change', debounce(onChange));
  };

  var reset = function () {
    formNode.reset();
  };

  var init = function () {
    disable();
    initEvents();
  };

  window.mapFiltersForm = {
    enable: enable,
    disable: disable,
    reset: reset
  };

  init();
  /* Code END */
})();
