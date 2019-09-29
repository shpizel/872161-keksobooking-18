'use strict';

var leadingZero = function (number, size = 2) {
  var s = String(number);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

var shuffle = function (a) {
  for(var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * i)
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

var random = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var getRandomChoice = function (array, length = false) {
  return (length) ? shuffle(array).slice(0, length) : array[random(0, array.length - 1)];
}

var getAvatarImgUrl = function (length) {
  if (!window.hasOwnProperty('avatarVariants')) {
    window.avatarVariants = [];
    for (var i = 1; i <= length; i++) {
      window.avatarVariants.push("img/avatars/user" + leadingZero(i) + ".png");
    }

    avatarVariants = shuffle(avatarVariants);
  }

  if (window.avatarVariants.length > 0) {
    var ret = window.avatarVariants[0];
    window.avatarVariants.splice(0, 1);
    return ret;
  } else {
    delete window['avatarVariants'];
    return getAvatarImgUrl(length);
  }
}

var getOffers = function (length = 8) {
  var ret = [];
  for (var i = 0; i < length; i++) {
    var offer = {
      "author": {
        "avatar": getAvatarImgUrl(length),
      },

      "offer": {
        "title": "строка, заголовок предложения",
        "address":'600, 350',
        "price": random(1000, 50000),
        "type": getRandomChoice(["palace", "flat", "house", "bungalo"]),
        "rooms": random(1, 5),
        "guests": random(2, 5),
        "checkin": getRandomChoice(["12:00", "13:00", "14:00"]),
        "checkout": getRandomChoice(["12:00", "13:00", "14:00"]),
        "features": getRandomChoice(["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"], random(1, 6)),
        "description": 'строка с описанием',
        "photos": getRandomChoice(["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"], random(1, 3)),
      },
      "location": {
        "x": random(0, 1024), //???
        "y": random(130, 630)
      }
    }

    ret.push(offer);
  }
  return ret;
}

var offers = getOffers(8);

document.querySelector('.map').classList.remove('map--faded');

var template = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();

for (var o in offers) {
  var pin = template.cloneNode(true);
  pin.style.left = offers[o].location.x + "px";
  pin.style.top = offers[o].location.y + "px";

  var img = pin.querySelector("img");
  img.src = offers[o].author.avatar;
  img.alt = offers[o].offer.title;

  fragment.appendChild(pin);
}

document.querySelector('.map__pins').appendChild(fragment);
