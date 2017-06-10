"use strict";

angular.module("app.userdirectory", ["ui.router", "ui.bootstrap"]);

angular.module("app.userdirectory").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.userdirectory.userlist', {
            url: '/userdirectory/userlist/:schema/:class?functionObjId&unitObjId',
            data: {
                title: 'User List',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            authenticate: true,
            views: {
                "content@app": {
                    templateUrl: 'app/userdirectory/views/user-list.html',
                    controller: 'UserListCtrl',
                    resolve: {
                        promisedUsers: function ($http, APP_CONFIG, $stateParams) {
                            var pageSize = 500;
                            var url;
                            if ($stateParams.functionObjId) {
                                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/Role/" + $stateParams.functionObjId + "/" + $stateParams.class + "?view=full&size=" + pageSize;
                            }
                            else if ($stateParams.unitObjId) {
                                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/Role/" + $stateParams.unitObjId + "/" + $stateParams.class + "?view=full&size=" + pageSize;

                            }
                            else {
                                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "?view=full&size=" + pageSize;
                            }

                            return $http.get(url);
                        }
                    }
                }
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'datatables',
                        'datatables-bootstrap',
                        'datatables-colvis',
                        'datatables-tools',
                        'datatables-responsive'
                    ]);
                }
            }
        })
        .state('app.userdirectory', {
            url: '/userdirectory/:schema/:class/:edit/:delete/:insert/:search/:export/:import/:hash',
            data: {
                title: 'user directory',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/userdirectory/views/user-directory-layout.html",
                    controller: 'UserDirectoryLayoutCtrl'
                }
            },
            authenticate: true,
            resolve: {
                propmisedParams: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash)
                }
            }

        })
        .state('app.userdirectory.usertable', {
            url: '/userdirectoryusertable/:schema/:baseclass/:baseoid/:relatedclass/:view/:formtemplate',
            data: {
                title: 'User Table',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "datatable@app.userdirectory": {
                    controller: 'UserListViewCtrl',
                    templateUrl: "app/userdirectory/views/user-list-view.html"
                }
            },
            authenticate: true
        })
        .state('app.userdirectory.roletable', {
            url: '/userdirectoryroletable/:schema/:baseclass/:roletype',
            data: {
                title: 'Role Table',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "datatable@app.userdirectory": {
                    controller: 'RoleListViewCtrl',
                    templateUrl: "app/userdirectory/views/role-list-view.html"
                }
            },
            authenticate: true
        });

        modalStateProvider.state('app.userdirectory.help', {
            url: '^/userdirectoryhelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.userdirectory.usertable.modalform', {
            url: '^/userdirectoryusersmodalform/:schema/:class/:oid/:readonly/:template/:formAttribute/:duplicate/:cmd/:sref',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.userdirectory.roletable.modalform', {
            url: '^/userdirectoryrolesmodalform/:schema/:class/:oid/:readonly/:template/:formAttribute/:duplicate/:cmd/:sref',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.userdirectory.roletable.modalform.pickpk', {
            url: '^/userdirectoryrolesmodalformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.userdirectory.usertable.assignroles', {
            url: '^/userdirectoryassignroles/:schema/:class/:oid/:roletype/:dataview',
            templateUrl: "app/userdirectory/views/assign-roles.html",
            controller: 'assignRolesCtrl',
            animation: false,
            size: 'md'
        });
    });