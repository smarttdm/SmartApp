

'use strict';

angular.module('app.auth').factory('User', function ($http, $q, APP_CONFIG, authService) {
    var dfd = $q.defer();

    function imageExists(image_url) {

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();

        return http.status != 404;
    }

    var UserModel = {
        initialized: dfd.promise,
        userName: undefined,
        picture: undefined,
        email: undefined,
        phoneNumber : undefined,
        password: undefined,
        confirmPassword: undefined,
        firstName: undefined,
        lastName: undefined,
        displayName : undefined,
        division: undefined,
        address: undefined,
        imageUrl: undefined,
        pictureChangeTime: undefined,
        userImageUrls: undefined,
        load: function(callback)
        {
            $http.get(APP_CONFIG.ebaasRootUrl + '/api/accounts/user/' + authService.authentication.userName).then(function (response) {
                UserModel.userName = response.data.userName;
                UserModel.email = response.data.email;
                UserModel.password = response.data.password;
                UserModel.firstName = response.data.firstName;
                UserModel.lastName = response.data.lastName;
                UserModel.displayName = response.data.displayName;
                UserModel.phoneNumber = response.data.phoneNumber;
                UserModel.division = response.data.division;
                UserModel.address = response.data.address;
                UserModel.imageUrl = undefined;
                UserModel.userImageUrls = {};

                UserModel.picture = UserModel.userName + ".png";

                dfd.resolve(UserModel);

                if (callback) {
                    callback();
                }
            });
        },
        save : function (callback) {
            var model = {};
            model.userName = UserModel.userName;
            model.email = UserModel.email;
            model.phoneNumber = UserModel.phoneNumber;
            model.firstName = UserModel.firstName;
            model.lastName = UserModel.lastName;
            model.picture = UserModel.picture;
           
            $http.post(APP_CONFIG.ebaasRootUrl + '/api/accounts/update', model).success(function (data) {
                if (callback) {
                    callback();
                }
            });
        },
        image : function()
        {
            if (!UserModel.imageUrl) {
                var imageUrl = APP_CONFIG.avatarsUrl + UserModel.picture;
                if (!imageExists(imageUrl)) {
                    UserModel.imageUrl = APP_CONFIG.avatarsUrl + "male.png";
                }
                else {
                    UserModel.imageUrl = imageUrl + '?' + UserModel.pictureChangeTime;
                }
            }
            //console.debug(UserModel.imageUrl);
            return UserModel.imageUrl;
        },
        getUserImage: function (userId) {
            var imageUrl = UserModel.userImageUrls[userId];
            if (!imageUrl) {
                imageUrl = APP_CONFIG.avatarsUrl + userId + ".png";
                if (!imageExists(imageUrl)) {
                    imageUrl = APP_CONFIG.avatarsUrl + "male.png";
                    UserModel.userImageUrls[userId] = imageUrl;
                }
                else {
                    UserModel.userImageUrls[userId] = imageUrl;
                }
            }
     
            return imageUrl;
        }
    };

    return UserModel;
});
