"use strict";

angular.module('app.layout').controller('layoutCtrl', function ($rootScope, $scope) {
    $scope.IntroOptions = {
        steps: [
            {
                element: '#logo',
                intro: $rootScope.getWord("ReturnToHomeIntro"),
                position: 'bottom'
            },
            {
                element: '#activity',
                intro: $rootScope.getWord("ViewActivitiesIntro"),
                position: 'bottom'
            },
            {
                element: '#fullscreen',
                intro: $rootScope.getWord("FullScreenIntro"),
                position: 'bottom'
            },
            {
                element: '#logout',
                intro: $rootScope.getWord("LogoutIntro"),
                position: 'bottom'
            },
            {
                element: '#hide-menu',
                intro: $rootScope.getWord("HideMenuIntro"),
                position: 'bottom'
            },
            {
                element: '#my-login-info',
                intro: $rootScope.getWord("MyLoginInfoIntro"),
                position: 'bottom'
            },
            {
                element: '#reset-settings',
                intro: $rootScope.getWord("ResetSettingsIntro"),
                position: 'bottom'
            },
            {
                element: '#demo-setting',
                intro: $rootScope.getWord("DemoSettingIntro"),
                position: 'left'
            },
            {
                element: '#sidemenu',
                intro: $rootScope.getWord("SidemenuIntro"),
                position: 'right'
            },
            {
                element: '#minimize-sidemenu',
                intro: $rootScope.getWord("MinimizeSidemenuIntro"),
                position: 'right'
            },
            {
                element: '#return-home',
                intro: $rootScope.getWord("ReturnToHomeIntro"),
                position: 'bottom'
            },
            {
                element: '#content',
                intro: $rootScope.getWord("ContentIntro"),
                position: 'center'
            }
        ],
        nextLabel: $rootScope.getWord("NextStep"),
        prevLabel: $rootScope.getWord("PreviousStep"),
        skipLabel: $rootScope.getWord("IntroSkip"),
        doneLabel: $rootScope.getWord("IntroComplete"),
    }
});
