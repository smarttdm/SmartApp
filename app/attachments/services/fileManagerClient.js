'use strict';

angular.module('app.attachments').factory('fileManagerClient', function ($resource, APP_CONFIG) {

    return $resource(APP_CONFIG.ebaasRootUrl + "/:api/:schema/:cls/:oid?path=:path",
        { id: "@Id" },
        {
            'query': { method: 'GET', params: {api: "api", schema: "schema", cls: "cls", oid: "oid", path: "path"} },
            'save': { method: 'POST', params: { api: "api", schema: "schema", cls: "cls", oid: "oid", path: 'path' }, transformRequest: angular.identity, headers: { 'Content-Type': undefined } },
            'remove': { method: 'DELETE', url: APP_CONFIG.ebaasRootUrl + '/:api/:schema/:cls/:oid/:fileId?path=:path', params: {api: "api", schema: "schema", cls: "cls", oid: "oid", fileId: "fileId", path: "path"} }
        });
});