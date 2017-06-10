"use strict";

angular.module('app').controller("LanguagesCtrl",  function LanguagesCtrl($scope, $rootScope, $log, Language){




    $scope.selectLanguage = function(language){
        $rootScope.currentLanguage = language;
        
        Language.getLang(language.key,function(data){

            $rootScope.lang = data;
            
        });
    }

 

});