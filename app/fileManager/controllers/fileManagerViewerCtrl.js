'use strict';

angular.module('app.filemanager').controller('fileManagerViewerCtrl', function ($scope, $rootScope, $http, APP_CONFIG, $stateParams) {

    // url to get a directory tree
    $scope.baseUrl = APP_CONFIG.ebaasRootUrl;
    if (APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash]) {
        $scope.baseUrl = APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash];
    }

    var url = $scope.baseUrl + "/api/file/directory/" + $stateParams.schema + "/" + $stateParams.class + "/" + $stateParams.oid;
    $http.get(url).then(function (res) {

        var tree = createDirectoryTree(res.data);

        $scope.directoryTree = tree;
    });

    var createDirectoryTree = function (rootDir) {
        var roots = [];
        
        var root = {};
        root.name = rootDir.name;
        root.title = rootDir.name;
        root.children = [];
        root.expanded = true;
        root.parent = undefined;
        roots.push(root);

        addSubDirs(root, rootDir.subdirs);

        return roots;
    };

    var addSubDirs = function (parent, subDirs) {
        var subDir, node;

        for (var i = 0; i < subDirs.length; i += 1) {
            subDir = subDirs[i];
            node = {};
            node.children = [];

            node.name = subDir.name;
            node.title = subDir.name;
            node.children = [];
            node.expanded = true;
            node.parent = parent;

            parent.children.push(node);

            addSubDirs(node, subDir.subdirs);
        }
    };

    $scope.$watch('directory.currentNode', function (newObj, oldObj) {
        if ($scope.directory && angular.isObject($scope.directory.currentNode)) {

            $rootScope.$broadcast('directory.changedNode', {newNode : newObj});
        }
    }, false);

    $scope.createDir = function()
    {

    }
});
