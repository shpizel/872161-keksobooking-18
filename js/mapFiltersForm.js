'use strict';

(function () {
  /* Constants START */
  var PRICE_MAPPING = {
    'middle': [10000, 50000],
    'low': [0, 10000],
    'high': [50000, Number.MAX_SAFE_INTEGER]
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

  var initEvents = function () {
    mapFiltersElement.addEventListener('change', debounce(function () {
      window.map.removeCard();
      var offersCache = window.map.getOffersCache();
      if (offersCache) {
        window.map.clearPins();

        var filteredOffers = offersCache.slice(0, offersCache.length);

        if (mapFiltersHousingTypeElement.value !== 'any') {
          filteredOffers = filteredOffers.filter(function (element) {
            return element.offer.type === mapFiltersHousingTypeElement.value;
          });
        }

        if (mapFiltersHousingPriceElement.value !== 'any') {
          var mapping = PRICE_MAPPING[mapFiltersHousingPriceElement.value];
          var minValue = mapping[0];
          var maxValue = mapping[1];
          filteredOffers = filteredOffers.filter(function (element) {
            return element.offer.price > minValue && element.offer.price < maxValue;
          });
        }

        if (mapFiltersHousingRoomsElement.value !== 'any') {
          filteredOffers = filteredOffers.filter(function (element) {
            return element.offer.rooms === parseInt(mapFiltersHousingRoomsElement.value, 10);
          });
        }

        if (mapFiltersHousingGuestsElement.value !== 'any') {
          var guests = parseInt(mapFiltersHousingGuestsElement.value, 10);
          filteredOffers = filteredOffers.filter(function (element) {
            if (guests === 0) {
              return element.offer.guests > 3;
            }
            return element.offer.guest === guests;
          });
        }

        var selectedFeatures = [];
        featuresCheckboxes.forEach(function (element) {
          if (element.checked) {
            selectedFeatures.push(element.value);
          }
        });
        if (selectedFeatures.length > 0) {
          filteredOffers = filteredOffers.filter(function (element) {
            var features = element.offer.features;
            for (var i = 0; i < selectedFeatures.length; i++) {
              if (!features.includes(selectedFeatures[i])) {
                return false;
              }
            }
            return true;
          });
        }

        window.map.fitMapWithOffers(filteredOffers);
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
