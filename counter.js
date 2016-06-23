/**
  @toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'

@usage

| Attribute              | Default | Description                                                       |
| ---------------------- | ------- | ----------------------------------------------------------------- |
| min/data-min           | null    | A minimum value, never to go below.                               |
| max/data-min           | null    | A maximum value, never to go above.                               |
| step/data-step         | 1       | How much to increment/decrement by.                               |
| addclass/data-addclass | null    | Add a class to the container.                                     |
| width/data-width       | null    | Set the width of the input field.                                 |
| editable/data-editable | false   | Whether the field is readyonly or not. By default, it's readonly. |

partial / html:
<div fs-counter value="someValue"
    data-min="0"
    data-max="100"
    data-step="1"
    data-addclass="someClass"
    data-width="130px"
    data-editable
    ></div>

//end: usage
*/

'use strict';

var counterModule = angular.module('Firestitch.angular-counter', []);

counterModule.controller('counterCtrl', ['$scope', function($scope) {
  var counterCtrl = this;

  /*
   * Parses the string/number input. Returns an integer
   * if the input is valid, otherwise, return NaN.
   */
  counterCtrl.parse = function(n) {
    n = String(n).trim().split('.')[0];
    var invalidInput = {
      hex: ~String(n).indexOf('0x'),
      falsy: !n && n !== 0,
      isObj: typeof n === 'object'
    };
    return (invalidInput.hex || invalidInput.falsy || invalidInput.isObj) ? NaN : Number(n);
  };

  /*
   * checks if the given inputs are valid
   * number/number strings. If they are valid, return true,
   * otherwise return false.
   */
  counterCtrl.isValidNumString = function() {
    var vals = [].concat(Array.prototype.slice.call(arguments, 0));
    return vals.reduce(function(c, val) {
      var parsedVal = counterCtrl.parse(val);
      return c && !isNaN(parsedVal);
    }, vals.length ? true : false);
  };

  /**
   * Sets the value as an integer. If the value cannot be parsed,
   * i.e. returns NaN, then the min value or 0 will be used instead.
   */
  counterCtrl.setValue = function(val, min, max) {
    var parsedVal = counterCtrl.parse(val);
    if (counterCtrl.isValidNumString(val)) {
      if (min !== undefined && min > parsedVal) {
        parsedVal = min;
        return parsedVal;
      }
      if (max !== undefined && max < parsedVal) {
        parsedVal = max;
        return parsedVal;
      }
      return parsedVal;
    } else {
      /* if the value is invalid, set it to 0 or the min value */
      parsedVal = min || 0;
      return parsedVal;
    }
  };
}]);

counterModule.directive('fsCounter', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    scope: {
      value: '=',
      onChange: '&?',
      noActiveValidate: '=?',
      pattern: '@?'
    },
    controller: 'counterCtrl as counterCtrl',
    template: ['<div class="fs-counter input-group" ng-class="addclass" ng-style="{width: width}" data-test-id="counter-wrapper">',
        '<span class="input-group-btn" ng-click="minus()" data-test-id="dec-button">',
          '<button class="btn btn-default"><span class="glyphicon glyphicon-minus"></span></button>',
        '</span>',
        '<form name="counterForm" style="display: inline"><input data-test-id="counter-input" name="counter" type="text" class="form-control text-center" ng-model="value" ng-blur="blurred()" ng-change="changed()" ng-readonly="editable !== \'\' "></form>',
        '<span class="input-group-btn" ng-click="plus()" data-test-id="inc-button">',
          '<button class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>',
        '</span>',
      '</div>'
    ].join(''),
    replace: true,
    link: function(scope, element, attrs, counterCtrl) {



      /**
       * Configuration for min/max/step.
       */
      var config = {
        step: isNaN(counterCtrl.parse(attrs.step)) ? 1 : counterCtrl.parse(attrs.step),
        min: counterCtrl.parse(attrs.min),
        max: counterCtrl.parse(attrs.max)
      };

      /**
       * Confirm the value attribute exists on the element
       */
      if (typeof scope.value === 'undefined') {
        throw 'Missing the value attribute on the counter directive.';
      }

      /**
       * Set some scope wide properties
       */
      var defaults = {
        editable: false,
        addclass: null,
        width: {},
        digitPattern: '[^-0-9\.]',
        noActiveValidate: true
      };
      Object.keys(defaults).forEach(function(key) {
        if (key in attrs) {
          defaults[key] = attrs[key];
        }
      });

      /** Set up data and methods on scope. */
      angular.extend(scope, defaults, {
        /**
         * Initialize the value model.
         */
        value: counterCtrl.setValue(scope.value, config.min, config.max),

        /**
         * Decrement the value and make sure we stay within the limits, if defined.
         */
        minus: function() {
          scope.value = counterCtrl.setValue(scope.value - config.step, config.min, config.max);
        },

        /**
         * Increment the value and make sure we stay within the limits, if defined.
         */
        plus: function() {
          scope.value = counterCtrl.setValue(scope.value + config.step, config.min, config.max);
        },

        /**
         * This is only triggered 1 second after a field is manually edited
         * by the user. Where we can perform some validation and make sure
         * that they enter the correct values from within the restrictions.
         */
        changed: function() {
          var changeDelay;
          if (scope.noActiveValidate === '') {
            return;
          } else {
            changeDelay = $timeout(function() {
              scope.value = counterCtrl.setValue(scope.value, config.min, config.max);
            }, 1000);
          }
        },

        /**
         * This is only triggered when user leaves a manually edited field.
         * Where we can perform some validation and make sure that they
         * enter the correct values from within the restrictions.
         */
        blurred: function() {
          scope.value = counterCtrl.setValue(scope.value, config.min, config.max);
        }
      });

      /* Enable only number chracters */
      var ngModelCtrl = scope.counterForm.counter;
      function fromUser(text) {
        if (text) {
          var pattern = new RegExp(scope.digitPattern, 'g');
          var transformedInput = text.replace(pattern, '');
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        return undefined;
      }
      ngModelCtrl.$parsers.push(fromUser);

      /**
       * Watch for change and call the provided callback
       * if any callback function is provided.
       */
      if (scope.onChange && typeof scope.onChange === 'function') {
        scope.$watch('value', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            scope.onChange();
          }
        });
      }
    }
  };
}]);
