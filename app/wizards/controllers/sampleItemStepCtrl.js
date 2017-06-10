'use strict';

angular.module('app.wizards').controller('sampleItemStepCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, RequestInfo) {

    $scope.dbschema = this.dbschema;
    $scope.dbclass = this.dbclass;
    $scope.control = this.control;
    $scope.oid = RequestInfo.requestId();

    $scope.callbackMethod = this.callbackMethod;

    $scope.message = "";

    // implement standard wizard step method
    $scope.control.goNextError = function () {
        return $scope.message;
    }

    $scope.control.goPrevError = function () {
        return "";
    }

    $scope.control.goNext = function () {
        if (RequestInfo.selectdSampleKey) {
            // remember the item selections for the current selected sample by clone the array
            RequestInfo.sampleItemsMap[RequestInfo.selectdSampleKey] = RequestInfo.itemGridInstance.getSelectedRowKeys().slice(0);
        }

        // check if there are samples
        if (RequestInfo.sampleGridInstance.totalCount() === 0) {
            $scope.message = $rootScope.getWord("NoSamples");
            if ($scope.callbackMethod) {
                $scope.callbackMethod({ 'instance': undefined });
            }
        }
        else if (RequestInfo.itemGridInstance.totalCount() === 0) {
            $scope.message = $rootScope.getWord("NoTestItems");
            if ($scope.callbackMethod) {
                $scope.callbackMethod({ 'instance': undefined });
            }
        }
        else if (SampleHasNoItems())
        {
            $scope.message = $rootScope.getWord("SampleHasNoItems");
            if ($scope.callbackMethod) {
                $scope.callbackMethod({ 'instance': undefined });
            }
        }
        /*
        else if (ItemHasNoSamples()) {
            $scope.message = $rootScope.getWord("ItemHasNoSamples");
            if ($scope.callbackMethod) {
                $scope.callbackMethod({ 'instance': undefined });
            }
        }
        */
        else {

            // build an array of test item ids and test item owners which will be set to the properties of the request
            // They are required by the process
            var masterId = RequestInfo.requestId();
            var itemClassName = RequestInfo.params["itemClass"];
            var itemOwnerProperty = RequestInfo.params["itemOwner"];
            var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + masterId + "/" + itemClassName + "?view=full";

            $http.get(url)
                .success(function (data) {
                    var itemIds = new Array();
                    var owners = new Array();
                    var itemId;
                    var itemOwner;
                    for (var i = 0; i < data.length; i++) {
                        itemId = data[i].obj_pk;
                        itemIds.push(itemId);

                        itemOwner = data[i][itemOwnerProperty];
     
                        if (owners.indexOf(itemOwner) === -1) // Note: this method doesn't work for IE 8
                        {
                            // do not allow duplicated item owner name in the array
                            owners.push(itemOwner);
                        }
                    }

                    RequestInfo.selectedItemIds = itemIds;
                    RequestInfo.selectedItemOwners = owners;

                    $scope.message = "";

                    if ($scope.callbackMethod) {
                        $scope.callbackMethod({ 'instance': undefined });
                    }
            });
        }
    }

    function SampleHasNoItems()
    {
        var status = false;

        var totalCount = RequestInfo.sampleGridInstance.totalCount();

        for (var i = 0; i < totalCount; i++)
        {
            var key = RequestInfo.sampleGridInstance.getKeyByRowIndex(i);

            if (!RequestInfo.sampleItemsMap[key])
            {
                status = true;
                break;
            }
            else if (RequestInfo.sampleItemsMap[key].length === 0)
            {
                status = true;
                break;
            }
        }
        return status;
    }

    function ItemHasNoSamples() {
        var status = true;

        var totalCount = RequestInfo.itemGridInstance.totalCount();

        for (var i = 0; i < totalCount; i++) {
            var itemKey = RequestInfo.itemGridInstance.getKeyByRowIndex(i);

            for (var sampleKey in RequestInfo.sampleItemsMap)
            {
                if (RequestInfo.sampleItemsMap.hasOwnProperty(sampleKey)) {
                    var itemKeys = RequestInfo.sampleItemsMap[sampleKey];

                    if (itemKeys && itemKeys.indexOf(itemKey) > -1)
                    {
                        status = false;
                        break;
                    }
                }
            }

            if (!status)
            {
                break;
            }
        }

        return status;
    }

    $scope.control.goPrev = function () {

    }

    $scope.control.init = function () {
    }

});
