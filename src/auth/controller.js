angular.module('app.auth').controller('AuthController', ['$scope', '$rootScope', '$state', '$stateParams','AuthFactory','NotifyFactory','Upload','VALID_IMAGE_FILE_TYPES','config', function ($scope, $rootScope, $state, $stateParams,AuthFactory,NotifyFactory,Upload,VALID_IMAGE_FILE_TYPES,config) {

    //register user
    $scope.register = function(form) {
        if(form.$valid) {
            var user = $scope.user;
            user.role = 'student'; //hard setting role for now
            $scope.signUpBusy = AuthFactory.signUp(user);
            $scope.signUpBusy.success(function(data,status, headers, config) {
                //2010 Normal login
                if(data.message.id == 2010) {
                    var loginProcessed = AuthFactory.postProcessLogin(data.data);
                    if(loginProcessed) {
                        NotifyFactory.showSuccess("Registration Successful");
                        $state.go('profile');
                    }
                } else {
                    NotifyFactory.showError(data.message.description,2000);
                }
            });
            $scope.signUpBusy.error(function(data,status, headers, config) {
                //reset form on invalid
                $scope.user = {};
                form.$setPristine();
                form.$setUntouched();
            });
        }
    };

    //login user
    $scope.login = function(form) {
        if(form.$valid) {
            var user = $scope.user;
            $scope.loginBusy = AuthFactory.signIn(user);
            $scope.loginBusy.success(function(data,status, headers, config) {
                //2010 Normal login
                if(data.message.id == 2010) {
                    var loginProcessed = AuthFactory.postProcessLogin(data.data);
                    if(loginProcessed) {
                        $state.go('profile');
                    }
                } else {
                    NotifyFactory.showError(data.message.description,2000);
                }
            });
            $scope.loginBusy.error(function(data,status, headers, config) {
                //reset form on invalid
                $scope.user = {};
                form.$setPristine();
                form.$setUntouched();
            });
        }
    };

    //Logout user
    $scope.logout = function() {
        var response = AuthFactory.logout();
        response.success(function(data,status,headers,config) {
            if(data.message.id == 2020) {
                var logoutProcessed = AuthFactory.postProcessLogout();
                if(logoutProcessed) {
                    $state.go('/');
                }
            } else {
                NotifyFactory.showError(data.message.description);
            }
        });
    };


    /**
     * Upload file
     */
    $scope.uploadFile = function($files) {
        var file = $files[0];
        $scope.flash =  {};
        if(typeof file != "undefined") {
            //check if valid file is uploaded
            if(VALID_IMAGE_FILE_TYPES.indexOf(file.type) > -1) {
                var data = {
                    "file": file
                };
                $scope.signUpBusy = Upload.upload({
                    url : config.apiUrl + "common/fileUpload",
                    method: 'POST',
                    file: file
                });
                $scope.signUpBusy.success(function(res,status,headers,config){
                    if(res.message.id == 2080) {
                        //save photo url
                        $scope.user.profile_pic_url = res.data.url;
                    } else {
                        NotifyFactory.showError(res.message.description);
                    }
                });
            } else {
                NotifyFactory.showError(lang.upload_valid_image_files.message);
            }
        }
    };

}]);