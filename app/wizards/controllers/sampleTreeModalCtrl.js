'use strict';

angular.module('app.wizards').controller('sampleTreeModalCtrl', function ($rootScope, $scope, $http, APP_CONFIG, $stateParams, $state, RequestInfo, MetaDataCache, $modalInstance) {

    $scope.dbschema = $stateParams.schema;

    var sampleCategoryClass = RequestInfo.params['sampleCategoryClass'];
    var sampleCategoryGroup = RequestInfo.params['sampleCategoryGroup'];
    var sampleCategoryName = RequestInfo.params['sampleCategoryName'];
    var sampleCategoryForm = RequestInfo.params['sampleCategoryForm'];
    var sampleBottomClass = RequestInfo.params['sampleBottomClass'];

    $scope.loading = false;

    if (MetaDataCache.getNamedData("sampleTree")) {
        $scope.sampleTree = MetaDataCache.getNamedData("sampleTree");
        $scope.sampleCategories = MetaDataCache.getNamedData("sampleCategories");
    }
    else {
        // url to go sample category tree model, assuming no more than 500 categories
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + sampleCategoryClass + "?view=full&from=0&size=500";

        $http.get(url).then(function (res) {

            $scope.sampleTree = CreateTree(res,
                sampleCategoryGroup,
                sampleCategoryName,
                sampleCategoryForm,
                sampleBottomClass);

            MetaDataCache.setNamedData("sampleTree", $scope.sampleTree);
        });
    }

    function CreateTree(res, groupName, categoryName, categoryForm, bottomClass) {
        var treeNodes = new Array();

        var categories = res.data;

        $scope.sampleCategories = categories;
        MetaDataCache.setNamedData("sampleCategories", categories);

        var groupNames = new Array();
        var found;
        var hasGroups = false;
        var menuItem;
        // create folder items
        if (groupName) {
            for (var i = 0; i < categories.length; i++) {
                var gn = categories[i][groupName];

                found = false;
                for (var j = 0; j < groupNames.length; j++) {
                    if (groupNames[j] === gn) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    groupNames.push(gn);
                }
            }

            if (groupNames.length > 0) {
                hasGroups = true;

                // add gorup names as first level menus, they are not clickable
                for (var i = 0; i < groupNames.length; i++) {
                    menuItem = new Object();
                    menuItem.content = "<span class=\"label label-success\"><i class=\"fa fa-lg fa-plus-circle\"></i>" + groupNames[i] + "</span>";
                    menuItem.name = groupNames[i];
                    menuItem.expanded = true;
                    menuItem.children = new Array();

                    treeNodes.push(menuItem);
                }
            }
        }

        // create item category menu items
        for (var i = 0; i < categories.length; i++) {
            categories[i].checked = false;
            if (hasGroups) {
                for (var j = 0; j < treeNodes.length; j++) {
                    if (treeNodes[j].name === categories[i][groupName]) {
                        menuItem = new Object();
                        //menuItem.content = "<span><label class=\"checkbox inline-block\"><input type=\"checkbox\" class=\"checkbox style-0\" name=\"sample" + j + "\" onclick=\"avascript:angular.element(document.getElementById('sampleTreeModalCtrl')).scope().CheckSample(" + i + ")\"]\"><i class=\"icon-leaf\"></i><a href=\"javascript:angular.element(document.getElementById('sampleTreeModalCtrl')).scope().OpenFormLink('" + categories[i][categoryForm] + "', '" + categories[i][bottomClass] + "');\">" + categories[i][categoryName] + "</a></span>";
                        menuItem.content = "<span><label class=\"checkbox inline-block\"><input type=\"checkbox\" class=\"checkbox style-0\" name=\"sample" + j + "\" onclick=\"avascript:angular.element(document.getElementById('sampleTreeModalCtrl')).scope().CheckSample(" + i + ")\"]\"><i class=\"icon-leaf\"></i>" + categories[i][categoryName] + "</span>";
                        treeNodes[j].children.push(menuItem);
                        break;
                    }
                }
            }
            else {
                menuItem = new Object();
                //menuItem.content = "<span><label class=\"checkbox inline-block\"><input type=\"checkbox\" class=\"checkbox style-0\" name=\"sample" + j + "\" onclick=\"avascript:angular.element(document.getElementById('sampleTreeModalCtrl')).scope().CheckSample(" + i + ")\"><i class=\"icon-leaf\"></i><a href=\"javascript:angular.element(document.getElementById('sampleTreeModalCtrl')).scope().OpenFormLink('" + categories[i][categoryForm] + "', '" + categories[i][bottomClass] + "');\">" + categories[i][categoryName] + "</a></span>";
                menuItem.content = "<span><label class=\"checkbox inline-block\"><input type=\"checkbox\" class=\"checkbox style-0\" name=\"sample" + j + "\" onclick=\"avascript:angular.element(document.getElementById('sampleTreeModalCtrl')).scope().CheckSample(" + i + ")\"><i class=\"icon-leaf\"></i>" + categories[i][categoryName] + "</span>";

                treeNodes.push(menuItem);
            }
        }

        //console.debug("rootNodes=" + JSON.stringify(treeNodes));
        return treeNodes;
    }

    $scope.CheckSample = function (i)
    {
        var status = $scope.sampleCategories[i].checked;

        if (status === true)
        {
            $scope.sampleCategories[i].checked = false;
        }
        else
        {
            $scope.sampleCategories[i].checked = true;
        }
    }

    $scope.OpenFormLink = function OpenFormLink(formName, sampleClassName) {
        if (formName !== "undefined") {
            $state.go('.form', { rclass: sampleClassName, rtemplate: formName});
        }
        else {
            $state.go('.form', { rclass: sampleClassName});
        }
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

    $scope.ok = function () {
        var updated = false;
        $scope.loading = true;

        // add selected sample instances to the db
        asyncLoop({
            length: $scope.sampleCategories.length,
            functionToLoop: function (loop, i) {
                if ($scope.sampleCategories[i].checked) {
                    updated = true;
                    $scope.sampleCategories[i].checked = false; // reset it to false
                    // get a new sample instance with initial value
                    $http.get(APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.sampleCategories[i][sampleBottomClass] + "/new")
                        .success(function (data) {
                            // add the sample with initial values to the db
                            // set the sample's relationship to request 
                            var toRequest = RequestInfo.params['sampleToRequest'];

                            data[toRequest] = RequestInfo.requestPk();
                            data[sampleCategoryForm] = $scope.sampleCategories[i][sampleCategoryForm]; // keep sample form name in the instance
                            $http.post(APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.sampleCategories[i][sampleBottomClass], data)
                            .success(function (data) {
                                loop();
                        });
                    });
                }
                else {
                    loop();
                };
            },
            callback: function () {
                $scope.loading = false;
                if (updated) {
                    $modalInstance.close("sampleupdate");
                }
                else {
                    $modalInstance.dismiss("dismiss");
                }
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss("dismiss");
    }
});
