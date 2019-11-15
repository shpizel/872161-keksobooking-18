'use strict';

(function () {
  /* Constants START */
  var ANY_VALUE = 'any';
  var PriceSettings = {
    middle: [10000, 50000],
    low: [0, 10000],
    high: [50000, 1000000]
  };

  var mapFiltersElement = document.querySelector('.map__filters');
  var mapFiltersElementInputs = mapFiltersElement.querySelectorAll('fieldset,input,select');
  var mapFiltersHousingTypeElement = mapFiltersElement.querySelector('select[name=housing-type]');
  var mapFiltersHousingPriceElement = mapFiltersElement.querySelector('select[name=housing-price]');
  var mapFiltersHousingRoomsElement = mapFiltersElement.querySelector('select[name=housing-rooms]');
  var mapFiltersHousingGuestsElement = mapFiltersElement.querySelector('select[name=housing-guests]');
  var featuresCheckboxes = mapFiltersElement.querySelectorAll('input[name=features]');

  var debounce = window.tools.debounce;
  /* Constants END */

  /* Code START */
  var enable = function () {
    window.tools.enableElements(mapFiltersElementInputs);
  };

  var disable = function () {
    window.tools.disableElements(mapFiltersElementInputs);
  };

  var filterByHousingType = function (offers) {
    if (mapFiltersHousingTypeElement.value !== ANY_VALUE) {
      offers = offers.filter(function (element) {
        return element.offer.type === mapFiltersHousingTypeElement.value;
      });
    }
    return offers;
  };

  var filterByHousingPrice = function (offers) {
    if (mapFiltersHousingPriceElement.value !== ANY_VALUE) {
      var mapping = PriceSettings[mapFiltersHousingPriceElement.value];
      var minValue = mapping[0];
      var maxValue = mapping[1];
      offers = offers.filter(function (element) {
        return element.offer.price > minValue && element.offer.price < maxValue;
      });
    }
    return offers;
  };

  var filterByHousingRooms = function (offers) {
    if (mapFiltersHousingRoomsElement.value !== ANY_VALUE) {
      offers = offers.filter(function (element) {
        return element.offer.rooms === parseInt(mapFiltersHousingRoomsElement.value, 10);
      });
    }
    return offers;
  };

  var filterByHousingGuests = function (offers) {
    if (mapFiltersHousingGuestsElement.value !== ANY_VALUE) {
      var guests = parseInt(mapFiltersHousingGuestsElement.value, 10);
      offers = offers.filter(function (element) {
        if (guests === 0) {
          return element.offer.guests > 3;
        }
        return element.offer.guest === guests;
      });
    }
    return offers;
  };

  var filterBySelectedFeatures = function (offers) {
    var selectedFeatures = [];
    featuresCheckboxes.forEach(function (element) {
      if (element.checked) {
        selectedFeatures.push(element.value);
      }
    });
    if (selectedFeatures.length > 0) {
      offers = offers.filter(function (element) {
        var features = element.offer.features;
        for (var i = 0; i < selectedFeatures.length; i++) {
          if (!features.includes(selectedFeatures[i])) {
            return false;
          }
        }
        return true;
      });
    }
    return offers;
  };

  var filterOffers = function (offers) {
    offers = filterByHousingType(offers);
    offers = filterByHousingPrice(offers);
    offers = filterByHousingRooms(offers);
    offers = filterByHousingGuests(offers);
    offers = filterBySelectedFeatures(offers);
    return offers;
  };

  var initEvents = function () {
    mapFiltersElement.addEventListener('change', debounce(function () {
      window.map.removeCard();
      var offersCache = window.map.getOffersCache();
      if (offersCache) {
        window.map.clearPins();
        var filteredOffers = offersCache.slice();
        window.map.fitMapWithOffers(filterOffers(filteredOffers));
      }
    }));
  };

  var reset = function () {
    mapFiltersElement.reset();
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
