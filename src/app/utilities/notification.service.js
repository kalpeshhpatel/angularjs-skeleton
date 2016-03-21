/**
 * Created by kalpesh on 21/03/16.
 */

/**
 * Service to show status messages
 */
APP.factory('NotifyFactory',function(){
    var factory = {};
    var settings = $.noty.defaults;
    settings.timeout = 5000; //default timeout
    settings.maxVisible = 1;

    var callNoty = function (newSettings) {
        newSettings.layout = 'topCenter';
        return noty(newSettings || {});
    };

    factory.show = function(message,timeout,type) {
        callNoty({text: message || settings.text, timeout: timeout || settings.timeout, type: type || settings.type});
    };

    factory.showWarning = function(message,timeout) {
        callNoty({text: message || settings.text, timeout: timeout || settings.timeout, type: 'warning' || settings.type});
    };

    factory.showInfo = function(message,timeout) {
        callNoty({text: message || settings.text, timeout: timeout || settings.timeout, type: 'information' || settings.type});
    };

    factory.showSuccess = function(message,timeout) {
        callNoty({text: message || settings.text, timeout: timeout || settings.timeout, type: 'success' || settings.type});
    };

    factory.showError = function(message,timeout) {
        callNoty({text: message || settings.text, timeout: timeout || settings.timeout, type: 'error' || settings.type});
    };

    factory.closeAll = function() {
        return $.noty.closeAll()
    };

    factory.clearShowQueue =  function () {
        return $.noty.clearQueue();
    };
    return factory;

});