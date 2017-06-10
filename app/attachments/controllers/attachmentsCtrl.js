'use strict';

angular.module('app.attachments').controller('attachmentsCtrl', function ($scope, $rootScope, fileManager, APP_CONFIG, $stateParams) {

    /* jshint validthis:true */
    var vm = this;
    vm.title = 'File Manager';
    vm.files = fileManager.files;
    vm.uploading = false;
    vm.previewFile;
    vm.currentFile;
    vm.remove = fileManager.remove;
    vm.download = fileManager.download;
    vm.setPreviewFile = setPreviewFile;
    vm.setCurrentFile = setCurrentFile;
    vm.getWord = getWord;
    vm.readonly = false;

    $scope.showUpload = false;

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

    if (!fileManager.params.oid && !$stateParams.rclass) {
        fileManager.params.oid = $stateParams.oid;
    }

    if (fileManager.params.oid) {
        if ($stateParams.readonly && $stateParams.readonly === "true") {
            vm.readonly = true;
        }
        else if (this.read && this.read === true)
        {
            vm.readonly = true;
        }
        else {
            vm.readonly = false;
        }
    }
    else {
        vm.readonly = true;
    }

    fileManager.params.api = "api/attachment"; // Indicating the filemanager is for attachments

    fileManager.params.serviceBase = APP_CONFIG.ebaasRootUrl;

    activate();

    function activate() {
        fileManager.load();
    }

    function setPreviewFile(file) {
        console.debug("setPreviewFile");
        vm.previewFile = file
    }

    function setCurrentFile(file) {
        console.debug("setCurrentFile");
        vm.currentFile = file
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

    $scope.$on('instanceCreated', function (event, args) {
        fileManager.params.oid = args.oid;
        vm.readonly = false;
    });

    $scope.setShowUpload = function(status)
    {
        $scope.showUpload = status;
    }
});
