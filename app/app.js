'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular.module('app', [
    //'ngSanitize',
    'ngAnimate',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'angular-intro',

    'summernote',

    // Smartadmin Angular Common Module
    'SmartAdmin',

    // angular-local-storage
    'LocalStorageModule',

    // App
    'app.auth',
    'app.layout',
    'app.dashboard',
    'app.graphs',
    'app.tables',
    'app.forms',
    'app.smarttables',
    'app.smartforms',
    'app.ui',
    'app.wizards',
    'app.tasks',
    'app.stations',
    'app.homepage',
    'app.user',
    'app.attachments',
    'app.taskforum',
    'app.taskkanban',
    'app.datacatalog',
    'app.dataviewer',
    "app.galleryview",
    "app.forum",
    "app.blog",
    "app.userdirectory",
    "app.myspace",
    "app.tasktrack",
    "app.filemanager",
    'app.formeditor',
    "app.smartreports",
    "app.datacart",
    "app.bulletinboard",
    "app.hub",
    "app.dataImporter",
    "app.logs",
    "app.mldashboard"
])
.config(function ($provide, $httpProvider) {


    // Intercept http calls.
    $provide.factory('ErrorHttpInterceptor', function ($q) {
        var errorCounter = 0;

        function notifyError(rejection) {

            if (rejection.status === 401 ||
                rejection.status === 500) {
                console.log(rejection);
            }
            else if (rejection.status === 400)
            {
                if (rejection.data.error &&
                    rejection.data.error === "invalid_grant") {
                    return;
                }
                else {
                    //console.log(rejection);
                    $.bigBox({
                        title: 'The request encounters an error',
                        content: rejection.data.message,
                        color: "#C46A69",
                        icon: "fa fa-warning shake animated",
                        number: ++errorCounter,
                        timeout: 6000
                    });
                }
            }
            else if (rejection.status === 404) {
                    //console.log(rejection);
                $.bigBox({
                    title: 'The request encounters an error',
                    content: "API not found",
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: ++errorCounter,
                    timeout: 6000
                });
            }
            else {
                //console.log(rejection);
                var msg = "Server is down.";
                if (rejection && rejection.data)
                {
                    if (rejection.data.message)
                    {
                        msg = rejection.data.message;
                    }
                    else
                    {
                        msg = "Unknown error type, please check the server log."
                    }
                }
                $.bigBox({
                    title: 'The request encounters an error',
                    content: msg,
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: ++errorCounter,
                    timeout: 6000
                });
            }
        }

        return {
            // On request failure
            requestError: function (rejection) {
                // show notification
                notifyError(rejection);

                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response failure
            responseError: function (rejection) {
                // show notification
                notifyError(rejection);
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('ErrorHttpInterceptor');

})
.config(['$httpProvider', function ($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}])
.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('NewteraTDM')
      .setStorageType('sessionStorage')
      .setNotify(true, true)
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptorService');
})
.constant('APP_CONFIG', window.appConfig)

.run(function ($rootScope, $http, APP_CONFIG,
    $state, $stateParams, TasksInfo, myActivityService, Language
    ) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.getTaskCount = function () {
        return TasksInfo.count;
    }

    $rootScope.getMsgCount = function () {
        return myActivityService.MessageModel.count;
    }

    $rootScope.getTotalCount = function () {
        return TasksInfo.count + myActivityService.MessageModel.count;
    }

    Globalize.culture("us");

    // get default settings from the sitemap
    $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/settings")
       .success(function (settings) {
           if (settings.database) {
               // remember the default schema name in the APP_CONFIG
               var pos = settings.database.indexOf(" ");
               if (pos !== -1) {
                   APP_CONFIG.dbschema = settings.database.slice(0, pos); // get db name without version number
               }
               else {
                   throw "Missing database value in the sitemap";
               }

               $rootScope.setLanguage(settings.language);

               Language.getLanguages(function (data) {

                   var langIndex = $rootScope.langIndex;

                   $rootScope.currentLanguage = data[langIndex];

                   $rootScope.languages = data;

                   Language.getLang(data[langIndex].key, function (data) {

                       $rootScope.lang = data;
                   });

               });
           }
           else {
               throw "Missing database value in the sitemap";
           }
       });

    // setup default language here as us
    $rootScope.lang = {};

    $rootScope.setLanguage = function(lang)
    {
        switch (lang) {
            case "us":
                $rootScope.langIndex = 0;
                break;
            case "cn":
                $rootScope.langIndex = 1;
                break;
            default:
                $rootScope.langIndex = 1;
                break;
        }
    }

    $rootScope.getWord = function (key) {
        if (angular.isDefined($rootScope.lang[key])) {
            return $rootScope.lang[key];
        }
        else {
            return key;
        }
    }

    // editableOptions.theme = 'bs3';

});


