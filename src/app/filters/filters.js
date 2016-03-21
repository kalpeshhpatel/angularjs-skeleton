/**
 * Put all common utilities filter here
 *
 */

APP.filter('firsttoupper', function() {
  return function(input) {
    if (input!=null)
    {    input = input.toLowerCase();
      return input.substring(0,1).toUpperCase()+input.substring(1);
    }
    return input;
  };
});

APP.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
});

APP.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});

APP.filter('mydate', function () {
  return function (input) {
    if (input != null) {
      var returnDate = moment(input).format('l');
    }
    return returnDate;
  };
});

APP.filter('myunixdate', function () {
  return function (input, format) {
    if (input != null) {
      var returnDate = moment.unix(input).format(format ? format : 'YYYY-MM-DD');
      return returnDate;
    }
    return input;
  };
});

APP.filter('mydatetime', function () {
  return function (input) {
    if (input != null) {
      var returnDate = moment(input).format('dddd, MMM Do, YYYY, ') + 'at' + moment(input).format(' h:mm A');
    }
    return returnDate;
  };
});

APP.filter('fromnow', function () {
  return function (input) {
    if (input != null) {
      var returnDate = moment.unix(input).fromNow();
    }
    return returnDate;
  };
});

APP.filter('replaceText', function($sce){
  return function (value, old_text, new_text) {
    var re = new RegExp(old_text, 'g');
    return old_text && new_text ? $sce.trustAsHtml(value.replace(re, new_text)) : console.log('Error occurred in filter: repalceText');
  };
});

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
APP.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

APP.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

APP.filter('replaceUnderscoreWithSpace', function() {
  return function(input) {
    return input.replace('_',' ');
  };
});

APP.filter("shortFormatNum", function () {
  return function (number, fractionSize) {

    if (number === null) return null;
    if (number === 0) return "0";

    if (!fractionSize || fractionSize < 0)
      fractionSize = 1;

    var abs = Math.abs(number);
    var rounder = Math.pow(10, fractionSize);
    var isNegative = number < 0;
    var key = '';
    var powers = [
      {key: "Q", value: Math.pow(10, 15)},
      {key: "T", value: Math.pow(10, 12)},
      {key: "B", value: Math.pow(10, 9)},
      {key: "M", value: Math.pow(10, 6)},
      {key: "K", value: 1000}
    ];

    for (var i = 0; i < powers.length; i++) {

      var reduced = abs / powers[i].value;

      reduced = Math.round(reduced * rounder) / rounder;

      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }

    return (isNegative ? '-' : '') + abs + key;
  };
});