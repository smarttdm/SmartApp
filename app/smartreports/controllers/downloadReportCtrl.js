'use strict';

angular.module('app.smartreports').controller('downloadReportCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, $modalInstance, fileManager) {
 
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.template = $stateParams.template;
    $scope.templateAttribute = $stateParams.templateAttribute;

    $scope.baseUrl = APP_CONFIG.ebaasRootUrl;
    if (APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash])
    {
        $scope.baseUrl = APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash];
    }
   
    $scope.loading = false;

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };

    $scope.download = function() {

        var getFileUrl = undefined;
 
        if ($scope.templateAttribute)
        {
            getFileUrl = $scope.baseUrl + "/api/report/" + $scope.dbschema + "/" + $scope.dbclass + "/" + $scope.oid + "?templateSource=property&property=" + $scope.templateAttribute;

        }
        else if ($scope.template) {
            getFileUrl = $scope.baseUrl + "/api/report/" + $scope.dbschema + "/" + $scope.dbclass + "/" + $scope.oid + "?templateSource=file&template=" + encodeURIComponent($scope.template);
        }

        if (getFileUrl) {
            $scope.loading = true;

            fileManager.performDownload(getFileUrl, function () {
                $scope.loading = false;
            });
        }
        else
        {
            BootstrapDialog.show({
                title: $rootScope.getWord("Info Dialog"),
                type: BootstrapDialog.TYPE_DANGER,
                message: "template or property parameter not defined",
                buttons: [{
                    label: $rootScope.getWord("Cancel"),
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
            
        }
    }
});
