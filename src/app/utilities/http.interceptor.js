
'use strict';
APP.factory('MyHttpRequestInterceptor',['$rootScope','$q','$location','$injector','ipCookie','lang','config',function ($rootScope,$q,$location,$injector,ipCookie,lang,appConfig) {
    return {
        request: function (config) {
            if(config.url.indexOf(appConfig.apiUrl) != -1 || config.url.indexOf(appConfig.adminUrl) != -1) {
                var session = $injector.get('AuthFactory').getSession();
                var sep = config.url.indexOf('?') === -1 ? '?' : '&';
                //Add timezone
                config.url = config.url + sep + 'timezone=' + $rootScope.plugins.tz.name();
                //calculate separator
                sep = config.url.indexOf('?') === -1 ? '?' : '&';
                //If token is present appends it to url
                if(config.url.indexOf('token') === -1 && (session != null || typeof session != "undefined"))
                    config.url = config.url + sep + 'token=' + session.token;
                else {
                    config.url.replace(/\?token.*&$/g, "?");
                }
            }
            return config || $q.when(config);
        },
        response: function (config) {
            return config || $q.when(config);
        },
        responseError: function(config) {
            // do something on error
            if(config.status == 500) {
                $injector.get('NotifyFactory').showError(lang.server_error_500.message,false);
                return $q.reject(config);
            }
            if(config.status === 404) {
                $injector.get('$state').transitionTo('404',{},{location:'replace'});
                return $q.reject(config);
            }
        }
    };
}]);

APP.config(function ($httpProvider) {
    $httpProvider.interceptors.push('MyHttpRequestInterceptor');
});
