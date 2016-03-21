var systemEnvironment = "local";
var domain = "realmile.com";
var projectKey = 'KEY'; //add your project key
var configUrl = systemEnvironment != 'prod' ? "//"+projectKey+"-config-"+systemEnvironment+"."+domain+"/config.json" : "//config.dagent.com/config.json";
var config = {};

angular.element(document).ready(function () {
    //set config details
    if (systemEnvironment.length == 0 || systemEnvironment == "prod") {
        systemEnvironment = "prod";
        config.apiUrl = '//api.thewcos.com/app/1.0/';
    } else {
        config.apiUrl = '//' + projectKey + '-api-' + systemEnvironment + '.' + domain + '/app/1.0/';
    }
    angular.module('app').constant("config", config);
    angular.bootstrap('#app', ['app']);
});



