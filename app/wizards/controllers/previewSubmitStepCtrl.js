'use strict';

angular.module('app.wizards').controller('previewSubmitStepCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, RequestInfo) {

    $scope.dbschema = this.dbschema;
    $scope.dbclass = this.dbclass;
    $scope.template = this.template;
    $scope.taskId = this.taskId;
    $scope.control = this.control;

    $scope.formId = "CreateTestRequestFormWizard"; // this will be posted as headers to the server to identify the form(optional)

    $scope.callbackMethod = this.callbackMethod;

    // implement standard wizard step method
    $scope.control.goNextError = function () {
        $scope.submitted = true;
        if (!$scope.ebaasform.$valid) { // we don't check dirty since nested form may have row deleted which doesn't flag as dirty
            $scope.message = $rootScope.getWord('ValidationError');
            return $scope.message;
        }
        else {
            $scope.message = "";
            return $scope.message;
        }
    }

    $scope.control.goPrevError = function () {
        return "";
    }

    $scope.control.goNext = function () {

        // save relationships between samples and items
        SaveSampleItemMappings();

        $scope.oid = RequestInfo.requestId();

        // set the selected item ids and item owners to the corresponding properties of the request
        if (RequestInfo.selectedItemIds) {
            var selectedIdArray = new Array();
            var idObj;
            var itemIdArrayName = RequestInfo.params["itemArray"];
            for (var i = 0; i < RequestInfo.selectedItemIds.length; i++) {
                idObj = new Object();
                idObj.col0 = RequestInfo.selectedItemIds[i];
                selectedIdArray.push(idObj);
            }

            var arrayObj = new Object();

            arrayObj.rows = selectedIdArray;

            $scope.model[itemIdArrayName] = arrayObj; // array property uses rows to keep array values
        }

        if (RequestInfo.selectedItemOwners) {
            var selectedOwnerArray = new Array();
            var ownerObj;
            var itemOwnerArrayName = RequestInfo.params["itemOwnerArray"];
            for (var i = 0; i < RequestInfo.selectedItemOwners.length; i++) {
                ownerObj = new Object();
                ownerObj.col0 = RequestInfo.selectedItemOwners[i];
                selectedOwnerArray.push(ownerObj);
            }

            var arrayObj = new Object();

            arrayObj.rows = selectedOwnerArray;

            $scope.model[itemOwnerArrayName] = arrayObj;
        }

        $scope.submitForm($scope.callbackMethod);
    }

    $scope.control.goPrev = function () {

    }

    $scope.control.init = function () {
        
        // get request instance with samples and items infos
        var template = RequestInfo.params['requestFormName'];

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + RequestInfo.requestId() + "?template=" + encodeURIComponent(template); // trailing slash to allow template name contans dot

        $http.get(url)
            .success(function (data) {

                RequestInfo.instance = data; // get upddate instance
                $scope.model = data;
            });
    }

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG, $stateParams: $stateParams }));

    function SaveSampleItemMappings() {
        var mappings = new Array();
        var mapping;
        var itemClass = RequestInfo.params['itemClass'];
        var sampleClass = RequestInfo.params['sampleClass'];

        var sampleCount = RequestInfo.sampleGridInstance.totalCount();
        for (var i = 0; i < sampleCount; i++) {
            var sampleKey = RequestInfo.sampleGridInstance.getKeyByRowIndex(i);
            var itemKeys = RequestInfo.sampleItemsMap[sampleKey];
            for (var j = 0; j < itemKeys.length; j++)
            {
                mapping = new Object();
                mapping.sampleKey = sampleKey;
                mapping.itemKey = itemKeys[j];

                mappings.push(mapping);
            }
        }

        // add mapoings to the db
        asyncLoop({
            length: mappings.length,
            functionToLoop: function (loop, i) {
                $http.post(APP_CONFIG.ebaasRootUrl + "/api/relationship/" + encodeURIComponent($stateParams.schema) + "/" + sampleClass + "/" + mappings[i]["sampleKey"] + "/" + itemClass + "/" + mappings[i]["itemKey"])
                     .success(function (data) {
                         loop();
                     });
            },
            callback: function () {
            }
        })
    }

    var asyncLoop = function (o) {
        var i = -1;

        var loop = function () {
            i++;
            if (i == o.length) {
                o.callback();
                return;
            }

            o.functionToLoop(loop, i);
        }

        loop(); // init
    }
});
