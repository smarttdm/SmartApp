'use strict';

angular.module('app.userdirectory').controller('assignRolesCtrl', function ($scope, $controller, $rootScope, $http, APP_CONFIG, $stateParams, $modalInstance) {
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = "Role";
    $scope.masterclass = $stateParams.class;
    $scope.masterid = $stateParams.oid;
    $scope.roletype = $stateParams.roletype;

    if ($stateParams.dataview)
    {
        $scope.view = $stateParams.dataview;
    }
    else
    {
        $scope.view = undefined;
    }

    $scope.filter = "['RType', '=', '" + $scope.roletype + "']";

    angular.extend(this, $controller('dataGridBaseCtrl', { $scope: $scope, $rootScope: $rootScope, $http: $http, APP_CONFIG: APP_CONFIG }));

    $scope.gridInstance = null;
    $scope.existingKeys = null;
    $scope.isUpdated = false;
    $scope.loading = false;
    $scope.dataGridSettings = {
        dataSource: {
            store: $scope.customStore
        },
        columnAutoWidth: true,
        sorting: {
            mode: "multiple"
        },
        editing: {
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false
        },
        grouping: {
            autoExpandAll: false
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            showInfo: true
        },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: { visible: false },
        selection: { mode: 'multiple' },
        remoteOperations: true,
        bindingOptions: {
            columns: 'columns'
        },
        headerFilter: {
            visible: true
        },
        rowAlternationEnabled: true,
        onInitialized: function (e) {
            $scope.gridInstance = e.component;
        },
        onContentReady: function (e) {
            selectGridRows();
        }
    };

    var asyncLoop = function(o)
    {
        var i = -1;

        var loop = function() {
            i++;
            if (i == o.length)
            {
                o.callback();
                return;
            }

            o.functionToLoop(loop, i);
        }

        loop(); // init
    }

    var selectGridRows = function()
    {
        if ($scope.existingKeys) {
            //console.debug("Paging set keys " + $scope.existingKeys);
            $scope.gridInstance.selectRows($scope.existingKeys, false);
        }
        else {
            if ($scope.masterid) {
                $http.get(APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $scope.masterclass + "/" + $scope.masterid + "/" + $scope.dbclass)
                    .success(function (data) {
                        var keys = new Array();
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                keys.push(data[i].obj_id);
                            }

                            if (keys.length > 0) {
                                // set the existing selections of rows
                                $scope.gridInstance.selectRows(keys, false);
                            }
                        }

                        //console.debug("Existing keys " + JSON.stringify(keys));

                        $scope.existingKeys = keys; // keep the existing keys for later
                    });
            }
        }
    }

    $scope.saveSelection = function () {
        var selectedKeys = $scope.gridInstance.getSelectedRowKeys();
        var addedKeys = new Array();
        var removedKeys = new Array();
        var found;

        // find the new selections
        for (var i = 0; i < selectedKeys.length; i++)
        {
            found = false;

            for (var j = 0; j < $scope.existingKeys.length; j++)
            {
                if (selectedKeys[i] === $scope.existingKeys[j])
                {
                    found = true;
                    break;
                }
            }

            if (!found)
            {
                addedKeys.push(selectedKeys[i]);
            }
        }

        // find the removed selections
        for (var i = 0; i < $scope.existingKeys.length; i++) {
            found = false;

            for (var j = 0; j < selectedKeys.length; j++) {
                if ($scope.existingKeys[i] === selectedKeys[j]) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                removedKeys.push($scope.existingKeys[i]);
            }
        }

        if (addedKeys.length > 0)
        {
            $scope.loading = true;

            // add relationhsips to the db
            asyncLoop({
                length: addedKeys.length,
                functionToLoop : function(loop, i)
                {
                    if ($scope.masterid) {
                        $http.post(APP_CONFIG.ebaasRootUrl + "/api/relationship/" + encodeURIComponent($stateParams.schema) + "/" + $scope.masterclass + "/" + $scope.masterid + "/" + $scope.dbclass + "/" + addedKeys[i])
                             .success(function (data) {
                                 loop();
                             });
                    }
                },
                callback: function () {
                    $scope.loading = false;
                    $scope.isUpdated = true;
                }
            })
        }

        if (removedKeys.length > 0) {
            $scope.loading = true;
            // delete relationhsips from the db
            asyncLoop({
                length: removedKeys.length,
                functionToLoop: function (loop, i) {
                    $http.delete(APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $scope.masterclass + "/" + $scope.masterid + "/" + $scope.dbclass + "/" + removedKeys[i])
                         .success(function (data) {
                             loop();
                         });
                },
                callback: function () {
                    $scope.existingKeys = selectedKeys;
                    $scope.loading = false;
                    $scope.isUpdated = true;
                }
            })
        }
   
    };

    $scope.goBack = function () {
        if ($scope.isUpdated) {
            $modalInstance.close({ "modal": "viewManyToMany"});
        }
        else {
            $modalInstance.dismiss("dismiss");
        }
    };
});
