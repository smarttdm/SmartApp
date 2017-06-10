"use strict";

angular.module("app.auth").factory("authService", function($rootScope, $http, $q, localStorageService, APP_CONFIG) {

    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    var _saveRegistration = function(registration) {

        _logOut();

        return $http.post(APP_CONFIG.ebaasRootUrl + '/api/accounts/create', registration).then(function(response) {
            return response;
        });
    };

    var _login = function(loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        var deferred = $q.defer();

        var url = APP_CONFIG.ebaasRootUrl + '/oauth/token';

        $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function(response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;

            deferred.resolve(response);

        }).error(function (err, status) {
            if (err.error === "invalid_grant")
            {
                err.error_description = $rootScope.getWord("Invalid user name or password");
            }
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function() {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";

    };

    var _fillAuthData = function() {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }

    }

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    return authServiceFactory;
});