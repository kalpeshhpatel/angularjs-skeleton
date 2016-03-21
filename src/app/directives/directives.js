/**
 * Put utilities directives here
 */
APP.directive('goBack',['$window', function($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);

/**
 * Handle empty or # anchor tags
 */
APP.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
    };
});

//ng-min directive
APP.directive('ngMin', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function(){
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === "" || value === null;
            }
            var minValidator = function(value) {
                var min = scope.$eval(attr.ngMin) || 0;
                if (!isEmpty(value) && value < min) {
                    ctrl.$setValidity('ngMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMin', true);
                    return value;
                }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

//ng-max directive
APP.directive('ngMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function(){
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === "" || value === null;
            }
            var maxValidator = function(value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});

APP.directive('ngclipboard', function() {
    return {
        restrict: 'A',
        scope: {
            ngclipboardSuccess: '&',
            ngclipboardError: '&'
        },
        link: function(scope, element) {

            var _id = element.attr('id');
            if (!_id) {
                element.attr('id', 'ngclipboard' + Date.now());
                _id = element.attr('id');
            }

            var clipboard = new Clipboard('#' + _id);

            clipboard.on('success', function(e) {

                scope.ngclipboardSuccess({
                    e: e
                });
            });

            clipboard.on('error', function(e) {
                scope.ngclipboardError({
                    e: e
                });
            });

        }
    };
});

/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

APP.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
        // contains
        function contains(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item, comparator) {
            arr = angular.isArray(arr) ? arr : [];
            if(!contains(arr, item, comparator)) {
                arr.push(item);
            }
            return arr;
        }

        // remove
        function remove(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // exclude recursion, but still keep the model
            var checklistModel = attrs.checklistModel;
            attrs.$set("checklistModel", null);
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);
            attrs.$set("checklistModel", checklistModel);

            // getter for original model
            var checklistModelGetter = $parse(checklistModel);
            var checklistChange = $parse(attrs.checklistChange);
            var checklistBeforeChange = $parse(attrs.checklistBeforeChange);
            var ngModelGetter = $parse(attrs.ngModel);

            // value added to list
            var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


            var comparator = angular.equals;

            if (attrs.hasOwnProperty('checklistComparator')){
                if (attrs.checklistComparator[0] == '.') {
                    var comparatorExpression = attrs.checklistComparator.substring(1);
                    comparator = function (a, b) {
                        return a[comparatorExpression] === b[comparatorExpression];
                    };

                } else {
                    comparator = $parse(attrs.checklistComparator)(scope.$parent);
                }
            }

            // watch UI checked change
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    ngModelGetter.assign(scope, contains(checklistModelGetter(scope.$parent), value, comparator));
                    return;
                }

                setValueInChecklistModel(value, newValue);

                if (checklistChange) {
                    checklistChange(scope);
                }
            });

            function setValueInChecklistModel(value, checked) {
                var current = checklistModelGetter(scope.$parent);
                if (angular.isFunction(checklistModelGetter.assign)) {
                    if (checked === true) {
                        checklistModelGetter.assign(scope.$parent, add(current, value, comparator));
                    } else {
                        checklistModelGetter.assign(scope.$parent, remove(current, value, comparator));
                    }
                }

            }

            // declare one function to be used for both $watch functions
            function setChecked(newArr, oldArr) {
                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    setValueInChecklistModel(value, ngModelGetter(scope));
                    return;
                }
                ngModelGetter.assign(scope, contains(newArr, value, comparator));
            }

            // watch original model change
            // use the faster $watchCollection method if it's available
            if (angular.isFunction(scope.$parent.$watchCollection)) {
                scope.$parent.$watchCollection(checklistModel, setChecked);
            } else {
                scope.$parent.$watch(checklistModel, setChecked, true);
            }
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function(tElement, tAttrs) {
                if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') && (tElement[0].tagName !== 'MD-CHECKBOX') && (!tAttrs.btnCheckbox)) {
                    throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
                }

                if (!tAttrs.checklistValue && !tAttrs.value) {
                    throw 'You should provide `value` or `checklist-value`.';
                }

                // by default ngModel is 'checked', so we set it if not specified
                if (!tAttrs.ngModel) {
                    // local scope var storing individual checkbox model
                    tAttrs.$set("ngModel", "checked");
                }

                return postLinkFn;
            }
        };
    }]);

APP.directive('match',function($parse){
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
            if(!ctrl) {
                return;
            }

            var matchGetter = $parse(attrs.match);
            var caselessGetter = $parse(attrs.matchCaseless);
            var noMatchGetter = $parse(attrs.notMatch);

            scope.$watch(getMatchValue, function(){
                ctrl.$$parseAndValidate();
            });

            ctrl.$validators.match = function(){
                var match = getMatchValue();
                var notMatch = noMatchGetter(scope);
                var value;

                if(caselessGetter(scope)){
                    value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
                }else{
                    value = ctrl.$viewValue === match;
                }
                /*jslint bitwise: true */
                value ^= notMatch;
                /*jslint bitwise: false */
                return !!value;
            };

            function getMatchValue(){
                var match = matchGetter(scope);
                if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
});