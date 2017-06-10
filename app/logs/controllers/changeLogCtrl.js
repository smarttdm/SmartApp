'use strict';

angular.module('app.logs').controller('changeLogCtrl', function ($scope, $rootScope, APP_CONFIG, logManager, $stateParams) {

    var vm = this;
    vm.title = 'Log Viewer';

    vm.getWord = getWord;

    logManager.params.dbschema = $stateParams.logschema;
    logManager.params.dbclass = $stateParams.logclass;
    logManager.params.oid = $stateParams.logoid;
    logManager.params.property = $stateParams.logproperty;

    activate();

    function activate() {
        logManager.load(function (logs) {
            console.log(logs);
            vm.logs = logs;
        });
    }

    function getWord(key) {
        return $rootScope.getWord(key);
    }
});
