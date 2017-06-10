'use strict';

angular.module('app.filemanager').controller('fileManagerCtrl', function ($scope, $rootScope, fileManager, APP_CONFIG, $stateParams) {

    /* jshint validthis:true */
    var vm = this;
    vm.title = 'File Manager';
    vm.files = fileManager.files;
    vm.uploading = false;
    vm.previewFile;
    vm.remove = fileManager.remove;
    vm.download = fileManager.download;
    vm.setPreviewFile = setPreviewFile;
    vm.getWord = getWord;

    $scope.showUpload = false;
   
    if (!$stateParams.readonly)
    {
        vm.readonly = false;
    }
    else
    {
        vm.readonly = $stateParams.readonly;
    }

    fileManager.params.schema = this.dbschema;
    if (!fileManager.params.schema)
    {
        fileManager.params.schema = $stateParams.schema;
    }
   
    fileManager.params.cls = this.dbclass;
    if (!fileManager.params.cls) {
        fileManager.params.cls = $stateParams.class;
    }

    fileManager.params.oid = this.oid;
    if (!fileManager.params.oid) {
        fileManager.params.oid = $stateParams.oid;
    }

    $scope.baseUrl = APP_CONFIG.ebaasRootUrl;
    if (APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash]) {
        $scope.baseUrl = APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash];
    }

    fileManager.params.path = "";

    fileManager.params.api = "api/file"; // Indicating the filemanager is for regular files

    fileManager.params.serviceBase = $scope.baseUrl;

    activate();

    function activate() {
        fileManager.load();
    }

    function setPreviewFile(file) {
        vm.previewFile = file
    }

    function remove(file) {
        fileManager.remove(file).then(function () {
            setPreviewFile();
        });
    }

    function getWord(key)
    {
        return $rootScope.getWord(key);
    }

    $scope.uploadFile = function () {
        $scope.processDropzone();
    }

    $scope.reset = function () {
        $scope.resetDropzone();
    }

    $scope.$on('directory.changedNode', function (event, args) {
        var path = getPath(args.newNode);
        path = encodeURIComponent(path);
       
        fileManager.params.path = path;
        fileManager.load();
    });

    $scope.setShowUpload = function (status) {
        $scope.showUpload = status;
    }

    function getPath(node) {
        var path = "";

        if (node.parent)
        {
            var parentPath = getPath(node.parent);
            if (parentPath)
            {
                path = parentPath + "\\" + node.name;
            }
            else
            {
                path = node.name;
            }
        }

        return path;
    }
});
