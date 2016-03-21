
var _src_path = 'src/';

angular.module('app.auth',['ui.router','ngMessages','ipCookie','ngFileUpload']);

angular.module('app.auth').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

    //declare routes
    $stateProvider
        .state('login', {
            url: "/login",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/guest/container.html"
                },
                'content@login': {
                    "templateUrl": _src_path + "auth/views/login.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['GUEST']
            }
        })
        .state('register', {
            url: "/register",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/guest/container.html"
                },
                'content@register': {
                    "templateUrl": _src_path + "auth/views/register.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['GUEST']
            }
        })


}]);