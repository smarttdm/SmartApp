(function (app) {
    var LoginController = function ($rootScope, $scope, $http, $state, $location, authService, APP_CONFIG, User, TasksInfo, myActivityService, hubService) {

        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";

        $scope.login = function () {
            authService.login($scope.loginData).then(function (response) {

                if ($rootScope.returnToState) {
                    $location.path($rootScope.returnToState);
                } else {
                    $location.path('/');
                }

                // load user's info
                User.load(function () {
                    hubService.connect(APP_CONFIG.dbschema, function (type, message) {
                        myActivityService.add(type, message);
                    }); // connect to server hub to receive messages
                }); // load user info

                //get user's task count to display at header
                $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/" + encodeURIComponent(APP_CONFIG.dbschema) + "/count")
                    .success(function (data) {
                        TasksInfo.count = data;
                    });

                //get user's message count to display at header
                $http.get(APP_CONFIG.ebaasRootUrl + "/api/messages/count")
                    .success(function (data) {
                        myActivityService.MessageModel.count = data;
                    });
            },
            function (err) {
                $scope.message = err.error_description;
            });
        };

        if (!String.format) {
            String.format = function (format) {
                var args = Array.prototype.slice.call(arguments, 1);
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                      ? args[number]
                      : match
                    ;
                });
            };
        }
  
    }

    app.controller("LoginController", LoginController);

}(angular.module("app.auth")));