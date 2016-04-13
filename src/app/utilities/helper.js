
//Helper utility functions

APP.factory('AppHelpers',function() {

    var factory = {};

    /**
     * Utility function to reset form
     * @param form
     */
    factory.resetForm = function(form) {
        console.log(form);
        if(form) {
            form.$setPristine();
            form.$setUntouched();
        }
    };

    return factory;
});
