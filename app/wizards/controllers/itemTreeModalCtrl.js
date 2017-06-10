'use strict';

angular.module('app.wizards').controller('itemTreeModalCtrl', function ($rootScope, $scope, $http, APP_CONFIG, $stateParams, $state, RequestInfo, MetaDataCache, $modalInstance) {

    $scope.dbschema = $stateParams.schema;

    var itemTemplateClass = RequestInfo.params['itemTemplateClass'];
    var itemCategory = RequestInfo.params['itemTemplateGroup'];
    var itemName = RequestInfo.params['itemName'];
    var itemForm = RequestInfo.params['itemForm'];
    var itemClass = RequestInfo.params['itemClass'];

    $scope.loading = false;

    if (MetaDataCache.getNamedData("itemTree")) {
        $scope.itemTree = MetaDataCache.getNamedData("itemTree");
        $scope.itemCategories = MetaDataCache.getNamedData("itemCategories");
    }
    else {
        // url to go item tempplate tree model, assuming no more than 1000 template
        var url = GetItemCategoriesUrl();
        $http.get(url).then(function (res) {

            $scope.itemTree = CreateTree(res,
                itemCategory,
                itemName,
                itemForm,
                itemClass);

            MetaDataCache.setNamedData("itemTree", $scope.itemTree);
        });
    }

    function GetItemCategoriesUrl() {
        var url = undefined;
        url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + itemTemplateClass + "?view=full&from=0&size=1000";
        // add item template filter to the url 

        var searchParameters = RequestInfo.params['seacrhParameters'];
        if (searchParameters) {
            var parameterArray = searchParameters.split(";");

            var parameterName;
            var parameterValue;
            var filter = new Array();
            var equalExpr;
            for (var i = 0; i < parameterArray.length; i++) {
                parameterName = parameterArray[i];
                parameterValue = RequestInfo.getPropertyValue(parameterName);
                equalExpr = new Array();
                equalExpr.push(parameterName);
                equalExpr.push("=");
                equalExpr.push(parameterValue);

                if (i === 0) {
                    filter.push(equalExpr);
                }
                else
                {
                    filter.push("and");
                    filter.push(equalExpr);
                }
            }

            url += "&filter=" + JSON.stringify(filter);
        }

        return url;
    }


    function CreateTree(res, groupName, categoryName, categoryForm, bottomClass) {
        var treeNodes = new Array();

        var categories = res.data;

        $scope.itemCategories = categories;
        MetaDataCache.setNamedData("itemCategories", categories);

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
            if (hasGroups) {
                for (var j = 0; j < treeNodes.length; j++) {
                    if (treeNodes[j].name === categories[i][groupName]) {
                        menuItem = new Object();
                        //menuItem.content = "<span><i class=\"icon-leaf\"></i><a href=\"javascript:angular.element(document.getElementById('itemTreeModalCtrl')).scope().OpenFormLink('" + categories[i][categoryForm] + "', '" + bottomClass + "','" + categories[i]['obj_id'] + "');\">" + categories[i][categoryName] + "</a></span>";
                        menuItem.content = "<span><label class=\"checkbox inline-block\"><input type=\"checkbox\" class=\"checkbox style-0\" name=\"item" + j + "\" onclick=\"avascript:angular.element(document.getElementById('itemTreeModalCtrl')).scope().CheckItem(" + i + ")\"]\"><i class=\"icon-leaf\"></i>" + categories[i][categoryName] + "</span>";

                        treeNodes[j].children.push(menuItem);
                        break;
                    }
                }
            }
            else {
                menuItem = new Object();
                //menuItem.content = "<span><i class=\"icon-leaf\"></i><a href=\"javascript:angular.element(document.getElementById('itemTreeModalCtrl')).scope().OpenFormLink('" + categories[i][categoryForm] + "', '" + bottomClass + "');\">" + categories[i][categoryName] + "</a></span>";
                menuItem.content = "<span><label class=\"checkbox inline-block\"><input type=\"checkbox\" class=\"checkbox style-0\" name=\"item" + j + "\" onclick=\"avascript:angular.element(document.getElementById('itemTreeModalCtrl')).scope().CheckItem(" + i + ")\"]\"><i class=\"icon-leaf\"></i>" + categories[i][categoryName] + "</span>";

                treeNodes.push(menuItem);
            }
        }

        return treeNodes;
    }

    $scope.OpenFormLink = function OpenFormLink(formName, itemClassName, oid) {

        if (formName !== "undefined") {
            $state.go('.form', {rclass: itemClassName, rtemplate: formName, tid: oid });
        }
        else {
            $state.go('.form', { rclass: itemClassName, tid: oid });
        }
    }

    $scope.CheckItem = function (i) {
        var status = $scope.itemCategories[i].checked;

        if (status === true) {
            $scope.itemCategories[i].checked = false;
        }
        else {
            $scope.itemCategories[i].checked = true;
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
            length: $scope.itemCategories.length,
            functionToLoop: function (loop, i) {
                if ($scope.itemCategories[i].checked) {
                    updated = true;
                    $scope.itemCategories[i].checked = false; // reset it to false

                    // get a new item instance by cloning the item template instance
                    $http.get(APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + itemTemplateClass + "/" + $scope.itemCategories[i]['obj_id'] + "?formformat=true")
                        .success(function (data) {
                            // add the item with cloned values to the db
                            // set the item's relationship to request 
                            var toRequest = RequestInfo.params['itemToRequest'];
                            data[toRequest] = RequestInfo.requestPk();
                            $http.post(APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + itemClass, data)
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
                    $modalInstance.close("itemupdate");
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
