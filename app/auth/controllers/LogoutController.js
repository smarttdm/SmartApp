"use strict";

angular.module('app.auth').controller('LogoutController', function ($scope, authService, hubService) {
    hubService.disconnect();
    authService.logOut();
})