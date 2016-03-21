
APP.value('cgBusyDefaults',{
    //message:'Loading Stuff',
    //backdrop: false,
    templateUrl: '/src/app/layout/angular-busy.html'
    //delay: 300,
    //minDuration: 700,
    //wrapperClass: 'my-class my-class2'
});


//Allowed photo files URL
//Valid image file extentions
APP.constant('VALID_IMAGE_FILE_TYPES',['image/jpg','image/gif','image/png','image/png', 'image/jpeg']);

APP.constant('REGEX',{
   'ipAddress' : '/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/'
});