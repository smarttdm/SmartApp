'use strict';

angular.module('app.smartforms').controller('ebaasFormModalCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, $modalInstance, $state) {
 
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.template = $stateParams.template;
    $scope.formAttribute = $stateParams.formAttribute;
    $scope.preview = false;
    
    if ($stateParams.previewid)
    {
        $scope.preview = true;
        $scope.previewid = $stateParams.previewid;
    }
    else
    {
        $scope.previewid = undefined;
    }

    if ($stateParams.readonly && $stateParams.readonly === "true") {
        $scope.readonly = true;
    }
    else {
        $scope.readonly = false;
    }

    if ($stateParams.duplicate && $stateParams.duplicate === "true") {
        $scope.duplicateBtn = true;
    }
    else {
        $scope.duplicateBtn = false;
    }

    if ($stateParams.cmd) {
        $scope.cmdName = $stateParams.cmd;
    }
    else {
        $scope.cmdName = undefined;
    }

    if ($stateParams.sref) {
        $scope.sref = $stateParams.sref;
    }
    else {
        $scope.sref = undefined;
    }

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG}));

    $scope.closeModal = function () {
        if ($scope.submitted)
            $modalInstance.close("update");
        else
            $modalInstance.dismiss("dismiss");
    };

    $scope.submitModalForm = function () {
        $scope.submitForm(function (result) {
            $scope.reloadForm();
        });
    }

    $scope.duplicateFunc = function()
    {
        if ($scope.cmdName && $scope.sref) {
            $scope.loading = true;
            // get custom commands, execute one of them
            var url = APP_CONFIG.ebaasRootUrl + "/api/sitemap/commands/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
            var cmdName;

            $http.get(url).success(function (commands) {
                // custom commands
                var cmdInfo;
                var item;
                var found = undefined;
                for (var cmd in commands) {
                    if (commands.hasOwnProperty(cmd)) {
                        cmdInfo = commands[cmd];
                        if (cmdInfo.name == $scope.cmdName) {
                            found = cmdInfo;
                            break;
                        }
                    }
                }

                if (found) {
                    url = $scope.getDuplicateDataUrl($scope.oid, true);

                    $http.get(url)
                       .success(function (data) {
                           //console.log(data);
                           var clonedObjId = data["obj_id"];

                           $scope.loading = false;

                           $state.go($scope.sref, { schema: $scope.dbschema, class: $scope.dbclass, oid: clonedObjId, hash: found.parameters.hash });
                       });

                }
                else {
                    console.debug("Unable to find a command with name " + $scope.cmdName);
                }
            })
        }
        else
        {
            $scope.loading = true;
            // get a shallow copy of instance and display it in the same modal window
            url = $scope.getDuplicateDataUrl($scope.oid, false);

            $http.get(url)
               .success(function (data) {
                   $scope.loading = false;
                   $scope.oid = data["obj_id"];
                   $scope.model = data;
                   $scope.submitted = true;
                   $scope.message = $rootScope.getWord("Instance Duplicated");
                   $scope.hasError = false;
               });
        }
    }
});
