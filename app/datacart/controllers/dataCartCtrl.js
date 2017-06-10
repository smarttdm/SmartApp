"use strict";

angular.module('app.datacart').controller('dataCartCtrl', function ($scope, $http, $stateParams, $modalInstance, APP_CONFIG, CartInfo, dataCartService, fileManager) {

    $scope.isEmpty = true;

    $scope.selectedTemplate = "0";

    $scope.loading = false;

    var cart = CartInfo.getCart($stateParams.schema, $stateParams.class);

    dataCartService.getColumns($stateParams.schema, $stateParams.class, cart.dataViewName, function (data) {
        
        $scope.columns = data;

        $scope.rowCollection = cart.items;

        if ($scope.rowCollection.length > 0)
        {
            $scope.isEmpty = false;
        }
    });

    dataCartService.getReportTemplates($stateParams.schema, $stateParams.class, function (data) {
        $scope.templates = data;
    });

    $scope.clearCartItems = function()
    {
        CartInfo.clearCart($stateParams.schema, $stateParams.class);
        $scope.rowCollection = [];
        $scope.isEmpty = true;
    }

    $scope.deleteItem = function(oid)
    {
        CartInfo.removeFromCart($stateParams.schema, $stateParams.class, oid);
        var cart = CartInfo.getCart($stateParams.schema, $stateParams.class);
        $scope.rowCollection = cart.items;
        if (cart.count === 0) {
            $scope.isEmpty = true;
        }
    }

    $scope.compareItems = function()
    {
        var objIds = "";
        var cart = CartInfo.getCart($stateParams.schema, $stateParams.class);
        for (var i = 0; i < cart.items.length; i++)
        {
            if (objIds != "")
            {
                objIds += ",";
            }

            objIds += cart.items[i].obj_id;
        }

        $scope.loading = true;
        var getFileUrl = APP_CONFIG.apiRootUrl + "/report/" + $stateParams.schema + "/" + $stateParams.class + "?template=" + encodeURIComponent($scope.selectedTemplate) + "&oids=" + objIds;

        fileManager.performDownload(getFileUrl, function () {
            $scope.loading = false;
        });
    }

    $scope.downloadDataPackage = function()
    {
        var objIds = "";
        var cart = CartInfo.getCart($stateParams.schema, $stateParams.class);
        for (var i = 0; i < cart.items.length; i++) {
            if (objIds != "") {
                objIds += ",";
            }

            objIds += cart.items[i].obj_id;
        }

        $scope.loading = true;
        var getDataPackageUrl = APP_CONFIG.apiRootUrl + "/export/datapackage/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "?oids=" + objIds;

        fileManager.performDownload(getDataPackageUrl, function () {
            $scope.loading = false;
        });
    }

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});