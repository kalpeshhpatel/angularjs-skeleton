
var _src_path = 'src/';

//Root module 'App'
var APP = angular.module('app', ['ui.router','ui.bootstrap','app.auth','ipCookie','cgBusy','ngSanitize','dialogs.main','ngAnimate']);

//Module configurations
APP.config(['$stateProvider', '$urlRouterProvider','config', function ($stateProvider, $urlRouterProvider, config) {

    //Routes
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state('/',{
        url: "/",
        views : {
            '': {
                templateUrl:  _src_path + "app/layout/guest/container.html"
            },
            'content@/': {
                templateUrl: _src_path + "app/home.html",
                controller: 'AppCtrl'
            }
        },
        data : {
            access : ['GUEST']
        }
    });

}]);

APP.run(['$rootScope','$state','$stateParams', '$window', 'config','ipCookie','AuthFactory','AppHelpers','$log','REGEX', function($rootScope,$state,$stateParams, $window, config,ipCookie,AuthFactory,AppHelpers,$log,REGEX) {

    //declare global variable
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.helpers = AppHelpers;
    $rootScope.$log = $log;

    $rootScope.regEx = REGEX;

    //declare plugins
    $rootScope.plugins = {};
    $rootScope.plugins.tz = jstz.determine();

    //var userSession = ipCookie('session');
    //if(userSession && userSession.token) {
    //    //Verifies the token and perform required routing
    //    AuthFactory.verifyToken(userSession.token);
    //}

}]);

