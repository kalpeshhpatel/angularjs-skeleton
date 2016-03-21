
APP.controller('AppCtrl',['$scope','$rootScope', '$state','$stateParams','NotifyFactory','AuthFactory','$sce','GridParser','$compile', function($scope,$rootScope,$state,$stateParams,NotifyFactory,AuthFactory,$sce,GridParser,$compile) {

    ////////////////////////////////////////////////////////////////////////////////
    //
    // GRID Operation
    //
    ////////////////////////////////////////////////////////////////////////////////

    //Reset grid data
    $scope.__resetGridData = function() {
        $scope.__gridPromise = null;
        $scope.__grid = {filters: [], tag_filters: [], columns: [], content: [],
            inputs: {page: 1, per_page: 10, filters: [], tag_filters: [], partial_search: false, sorting: []},
            total: null, callback : null, loaded: false};
        $scope.__displayColumns = [];
    };

    /**
     * Set's grid service and calls load grid function
     * @param promise
     * @param input
     * @param callback
     * @private
     */
    $scope.__setGridService = function(promise,input, callback) {
        $scope.__gridPromise = promise;
        $scope.__loadGrid(input, callback);
    };

    /**
     * Common load grid function
     * @param input
     * @param callback
     * @private
     */
    $scope.__loadGrid = function(input, callback) {
        $scope.gridBusy = $scope.__gridPromise(angular.extend($scope.__grid.inputs,input));
        $scope.gridBusy.success(function(data,status,headers,config){
            if(data.message.id == 2040 && data.success) {
                $scope.__grid.content = data.data.content;
                $scope.__grid.columns = data.data.columns ? data.data.columns : [];
                $scope.__grid.extra_columns = data.data.extra_columns ? data.data.extra_columns : [];
                $scope.__grid.filters = data.data.filters ? data.data.filters : [];
                $scope.__grid.labels = data.data.labels ? data.data.labels : [];
                $scope.__grid.services = data.data.services ? data.data.services : [];
                $scope.__grid.stages = data.data.stages ? data.data.stages : [];
                $scope.__grid.inputs = data.data.inputs ? data.data.inputs : [];
                $scope.__grid.inputs.search = data.data.inputs && data.data.inputs.search  ? data.data.inputs.search[0] : null;
                $scope.__grid.total = data.data.total;
                $scope.__grid.callback = callback;
                $scope.__searching = false;
                if($scope.__grid.total > 0 && $scope.__grid.content.length == 0) {
                    $scope.__grid.inputs.page = 1;
                    $scope.__loadGrid({}, callback);
                }

                if(angular.isFunction(callback)) {
                    // Execute callback function here
                    callback();
                }

                var parsedColumns = GridParser.parseDisplayColumns($scope.__grid.columns, $scope.__grid.inputs);
                $scope.__displayColumns = parsedColumns.newColumns;
                $scope.__searchColumns = parsedColumns.searchColumns;
                $scope.__grid.loaded = true;
                $scope.__doPagination((parseInt($scope.__grid.inputs.page) - 1),$state.href($state.current.name),true);
            } else {
                NotifyFactory.showError(data.message.description);
            }
        });
    };

    /**
     * Generate pagination links
     * @param start
     * @param uri
     * @param onlyPaginate
     * @private
     */
    $scope.__doPagination = function(start, uri, onlyPaginate) {
        $scope.__grid.inputs.page = parseInt(start) + 1;
//        $scope.checkedAll = false;
//        $scope.isAnyChecked = false;
        //Change this according to your requirement
        var per_page = parseInt($scope.__grid.inputs.per_page);//per page records
        var total = $scope.__grid.total;//total number of content
        var html = GridParser.generatePaginationLinks(start, per_page, total, uri,'__doPagination');
        $(".pagination").html($compile(html)($scope));
        if (!onlyPaginate) {
            $scope.__loadGrid({}, $scope.__grid.callback);
        }
    };

    /**
     * Sort/order grid
     * @param sort_by
     * @param order_by
     * @returns {boolean}
     * @private
     */
    $scope.__setSortBy = function(sort_by, order_by) {
        if (!$scope.__grid.content.length)
            return false;
        var data = {
            key: sort_by,
            direction: order_by
        };
        var flag = 0;
        angular.forEach($scope.__grid.inputs.sorting, function (item, key) {
            if (item.key == sort_by) {
                flag = 1;
                $scope.__grid.inputs.sorting[key].direction = order_by;
                var tempArr = $scope.__grid.inputs.sorting[key];
                delete $scope.__grid.inputs.sorting[key];
                $scope.__grid.inputs.sorting.unshift(tempArr);
            }
        });
        if (flag == 0) {
            $scope.__grid.inputs.sorting.unshift(data);
        }
        $scope.__grid.inputs.sorting = _.compact($scope.__grid.inputs.sorting);
//        $scope.checkedAll = false;
//        $scope.isAnyChecked = false;
        $scope.__loadGrid({}, $scope.__grid.callback);
    };

    /**
     * Set grid search value
     * @param event
     */
    $scope.__setGridSearchValue = function(event) {
        /* Will get fired only after clicking Go button or hitting enter key on text-box */
        if(!$scope.__searching) {
            clearTimeout($scope.__timer);
            $scope.__timer = setTimeout(function(){
                $scope.__grid.inputs.page = 1;
                $scope.__searching = true;
                $scope.__grid.inputs.partial_search = event.keyCode != 13;
                $scope.__loadGrid({}, $scope.__grid.callback);
            }, 800);
        }
    };

    /**
     * Submits search form
     */
    $scope.__submitGridSearchForm = function() {
        if(!$scope.__searching) {
            clearTimeout($scope.__timer);
            $scope.__grid.inputs.page = 1;
            $scope.__searching = true;
            $scope.__grid.inputs.partial_search = false;
            $scope.__loadGrid({}, $scope.__grid.callback);
        }
    };

    //////////////////////////////////////////////////////////////////////////
    //
    // End Grid Operation
    //
    /////////////////////////////////////////////////////////////////////////


    //user access control
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var session = AuthFactory.getSession();
        if(typeof toState.data != "undefined" && typeof toState.data.access != "undefined") {
            if(toState.data.access.indexOf('USER') != -1) {
                if(!session) {
                    event.preventDefault();
                    $state.go('/');
                }
            } else if(toState.data.access.indexOf('GUEST') != -1) {
                if(session) {
                    event.preventDefault();
                    //go to any user page
                    $state.go('user');
                }
            }

        }
    });


    //when state change success
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        //Reset grid data on each state change
        $scope.__resetGridData();

        //Set Page Title
        if (angular.isDefined( toState.data ) && angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle =  toState.data.pageTitle;
        }

    });


}]);
