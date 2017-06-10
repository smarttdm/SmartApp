"use strict";

angular.module('app.datacart').controller('addToDataCartCtrl', function ($scope, $http, $stateParams, $modalInstance, APP_CONFIG, CartInfo, dataCartService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;

    $scope.addToCart = function () {
        var exist = false;
        var cart = CartInfo.getCart($scope.dbschema, $scope.dbclass);
        var arrayLength = cart.items.length;
        for (var i = 0; i < arrayLength; i++) {
            if (cart.items[i].obj_id === $scope.oid) {
                exist = true;
                break;
            }
        }

        if (!exist)
        {
            dataCartService.getCartItem($stateParams.schema, $stateParams.class, cart.dataViewName, $stateParams.oid, function (data) {

                CartInfo.addToCart($scope.dbschema, $scope.dbclass, data);
            });
        }
 
        $modalInstance.dismiss("dismiss");
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});