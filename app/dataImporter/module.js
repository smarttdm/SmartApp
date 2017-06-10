"use strict";

angular.module("app.dataImporter", ["ui.router", "ui.bootstrap", "ngFileUpload"]);

angular.module("app.dataImporter").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.dataImporter', {
            url: '/dataimport/:schema/:class',
            data: {
                title: 'Data Importer'
            },
            views: {
                "content@app": {
                    controller: 'dataImportCtrl',
                    templateUrl: "app/dataImporter/views/dataimport-view.html"
                }
            }
        });
});