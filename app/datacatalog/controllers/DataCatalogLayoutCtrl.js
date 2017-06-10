'use strict';

angular.module('app.datacatalog').controller('DataCatalogLayoutCtrl', function ($http, APP_CONFIG, $scope, $state, $stateParams, propmisedParams, MetaDataCache, CartInfo) {

    $scope.dbschema = $stateParams.schema;
    $scope.class = $stateParams.class;
    var params = propmisedParams.data;

    $scope.treeName = params['treeName'];
    $scope.view = params['dataView'];
    $scope.formTemplate = params['formTemplate'];
    var cart = CartInfo.getCart($stateParams.schema, $stateParams.class);
    cart.dataViewName = params['dataView'];
    if (params['dataCart'] && params['dataCart'] === "true")
    {
        cart.showDataCart = true;
    }
 
    if (MetaDataCache.getNamedData($scope.treeName)) {
        $scope.catalogTree = MetaDataCache.getNamedData($scope.treeName);

        $state.go('app.datacatalog.datatable', { schema: $scope.dbschema, class: $scope.class, node: "none", view: $scope.view, formtemplate: $scope.formTemplate });
    }
    else {
        // url to get tree model
        var url = APP_CONFIG.ebaasRootUrl + "/api/metadata/classificationtree/" + encodeURIComponent($scope.dbschema) + "/" + $scope.treeName;

        $http.get(url).then(function (res) {

            var treeData = res.data;

            $scope.catalogTree = createMenuTree(treeData);

            MetaDataCache.setNamedData($scope.treeName, $scope.catalogTree);

            $state.go('app.datacatalog.datatable', { schema: $scope.dbschema, class: $scope.class, node: "none", view: $scope.view, formtemplate: $scope.formTemplate });
        });
    }

    $scope.OpenDataTable = function OpenDataTable(nodeName) {
        $state.go('app.datacatalog.datatable', { schema: $scope.dbschema, class: $scope.class, node: nodeName, tree: $scope.treeName, formtemplate: $scope.formTemplate});
    }

    var createMenuTree = function (treeData) {
        var node, rootMenuItem, roots = [];
        node = treeData;
        
        var rootMenuItem = {};
        //rootMenuItem.content = "<span><i class=\"fa fa-lg fa-plus-circle\"></i> " + node.title + "</span>";
        rootMenuItem.content = "<span class='label label-info'><i class=\"fa fa-lg fa-plus-circle\"></i>&nbsp;&nbsp;<a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('catalogTree')).scope().OpenDataTable('" + node.name + "');\">" + node.title + "</a></span>";
        rootMenuItem.children = [];
        rootMenuItem.expanded = true;
        roots.push(rootMenuItem);

        addChildMenuItems(rootMenuItem, treeData.children);

        return roots;
    };

    var addChildMenuItems = function(parentItem, nodes)
    {
        var node, menuItem;

        for (var i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            menuItem = {};
            menuItem.children = [];

            if (node.children.length > 0) {
                menuItem.content = "<span class='label label-info'><i class=\"fa fa-lg fa-plus-circle\"></i>&nbsp;&nbsp;<a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('catalogTree')).scope().OpenDataTable('" + node.name + "');\">" + node.title + "</a></span>";
            } else {
                menuItem.content = "<span class='label label-info'><a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('catalogTree')).scope().OpenDataTable('" + node.name + "');\">" + node.title + "</a></span>";
            }

            parentItem.children.push(menuItem);

            addChildMenuItems(menuItem, node.children);
        }
    }
});