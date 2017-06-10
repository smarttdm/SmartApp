'use strict';

angular.module('app.smarttables').controller('dataGridBaseCtrl', function ($scope, $rootScope, $state, $http, APP_CONFIG, $timeout, ngProgressFactory) {

    // parameters to be provided by sub controllers
    $scope.dbschema;
    $scope.dbclass;
    $scope.view;
    $scope.tree;
    $scope.node;
    $scope.oid;
    $scope.filter;
    $scope.isrelated;
    $scope.relatedclass;
    $scope.relatedview;

    var url;
    if ($scope.isrelated && $scope.isrelated === true)
    {
        // get meta data for a related class
        if ($scope.relatedview) {
            url = APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent($scope.dbschema) + "/" + $scope.relatedclass + "?view=" + $scope.relatedview;
        }
        else {
            url = APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent($scope.dbschema) + "/" + $scope.relatedclass;
        }
    }
    else
    {
        // get meta data for a master class
        if ($scope.view) {
            url = APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "?view=" + $scope.view;
        }
        else {
            url = APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
        }
    }

    //console.debug("meta data url = " + url);

    $http.get(url).success(function (data) {

        var column;
        var columns = new Array();

        // data is a JSON Schema for the class
        var properties = data.properties; // data.properies contains infos of each property of the schema

        $scope.selectColumns = "";

        var propertyInfo;
        for (var property in properties)
        {
            if (properties.hasOwnProperty(property))
            {
                propertyInfo = properties[property];

                column = new Object();
                column.dataField = property;
                column.caption = propertyInfo["title"];
                column.dataType = convertDataType(propertyInfo);

                if ($scope.selectColumns === "")
                {
                    $scope.selectColumns = column.dataField + " AS [" + column.caption + "]";
                }
                else
                {
                    $scope.selectColumns += ", " + column.dataField + " AS [" + column.caption + "]";
                }

                if (propertyInfo["readonly"] === true)
                {
                    column.allowFiltering = false;
                    column.allowSorting = false;
                }
  
                if (propertyInfo["hidden"] === true)
                {
                    column.visible = false;
                }

                if (propertyInfo["type"] === "object") {

                    column.allowSearch = true;
                }
                else {
                    column.allowSearch = false;
                }

                if (column.dataType === "number")
                {
                    if (propertyInfo["format"] && propertyInfo["format"] === "progress") {
                        column.cellTemplate = function (container, options) {
                            $("<div><div class='progress-bar' aria-valuemin='0' aria-valuemax='100' aria-valuenow='" + options.value + "' style='width:" + options.value + "%'>" + options.value + "%</div></div>")
                              .attr("class", "progress")
                              .appendTo(container);
                        }
                    }
                }

                if (column.dataType === "string") {
                    if (propertyInfo["format"] && propertyInfo["format"] === "text") {
                        // long text, set the column width
                        column.width = "150";
                    }
                }

                if (propertyInfo.enum)
                {
                    if (propertyInfo.enum.length > 0)
                    {
                        // remove the first item which is for "unknown", wo don't need this filter value
                        propertyInfo.enum.splice(0, 1);
                    }
                    column.lookup = { dataSource: propertyInfo.enum };

                    if (propertyInfo["format"] && propertyInfo["format"] === "icon") {
                        column.cellTemplate = function (container, options) {
                            var src = "styles/custom/icons/" + options.value;
                            container.addClass("img-container");
                            $("<img />")
                                .attr("src", src)
                                .appendTo(container);
                        }
                    }
                }
                else if (propertyInfo["format"] && propertyInfo["format"] === "image")
                {
                    var thumbWidth = propertyInfo["minLength"];
                    var thumHeight = propertyInfo["maxLength"];
                    column.cellTemplate = function (container, options) {
                        var src = "styles/img/empty.jpg";
                        if (options.value)
                        {
                            src = "styles/custom/images/" + options.value;
                        }
                            
                        container.addClass("img-container");
                        $("<img />")
                            .attr("src", src)
                            .attr("width", thumbWidth)
                            .attr("height", thumHeight)
                            .appendTo(container);
                    }

                    column.allowFiltering = false;
                    column.allowSorting = false;
                }
                else if (column.dataType === "string") {
                    //column.width = "150";
                }

                columns.push(column);
            }
        }

        // Append a command column
        if ($scope.inlineCmds) {
            column = new Object();
            column.dataField = "obj_id";
            column.caption = "#";
            column.cellTemplate = "cellTemplate";
            columns.push(column);
        }

        $scope.columns = columns;
        $scope.caption = data.title;
    });

    function convertDataType(propertyInfo)
    {
        var dtype = "string";
        var dataFromat = undefined;
        var dataType = "string";

        if (propertyInfo["type"])
        {
            dtype = propertyInfo["type"];
        }

        if (propertyInfo["format"])
        {
            dataFromat = propertyInfo["format"];
        }

        switch (dtype)
        {
            case "integer":
                dataType = "number";
                break;

            case "string":

                if (dataFromat === "date") {
                    dataType = "date";
                }
                break;
        }

        return dataType;
    }

    function appendExpr(filterExpr, op, binaryExpr)
    {
        if (filterExpr) {
            var filter = JSON.parse(filterExpr);

            if (filterExpr[0] instanceof Array) {
                // filterExp is array of multipe binary exp
                filter.push(op, binaryExpr);

                return JSON.stringify(filter);
            }
            else {
                // filterExpr is a single binary expr
                var array = [];

                array.push(filter, op, binaryExpr);

                return JSON.stringify(array);
            }
        }
        else
        {
            return JSON.stringify(binaryExpr);
        }
    }

    var dbImpl = {
        key: 'obj_id',
        load: function (loadOptions) {

            var url;
            var params = "";
            
            if ($scope.isrelated && $scope.isrelated === true) {
                if ($scope.oid) {
                    if ($scope.relatedview) {
                        // get data for a related class using a view
                        url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + $scope.relatedclass;
                        params = "view=" + $scope.relatedview;
                    }
                    else {
                        // get data for a related class using default view
                        url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + $scope.relatedclass;
                    }
                }
            }
            else {
                // get data for a master class
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
            }

            if (url) {

                if ($scope.tree &&
                    $scope.node)
                {
                    // search for a tree node
                    params = "tree=" + $scope.tree + "&node=" + $scope.node;
                }
                else if ($scope.view)
                {
                    // search for a view
                    params = "view=" + $scope.view;
                }

                $scope.pageSize = 20;
                if (loadOptions.skip) {
                    var range = "from=" + loadOptions.skip + "&size=" + loadOptions.take;
                    $scope.pageSize = loadOptions.take;
                    if (params === "")
                    {
                        params = range;
                    }
                    else
                    {
                        params += "&" + range;
                    }
                }

                if (loadOptions.sort != null) {
                    var sortExpr = "sortfield=" + loadOptions.sort[0].selector + "&sortreverse=" + loadOptions.sort[0].desc;
                    if (params === "") {
                        params = sortExpr;
                    }
                    else {
                        params += "&" + sortExpr;
                    }
                }

                // keyword search text
                var searchText = $('#gridContainer').dxDataGrid('instance')._options.searchPanel.text;
                var filter = undefined;
                if (loadOptions.filter) {
                    var expr = JSON.stringify(loadOptions.filter);
                   
                    //Date.prototype.toJSON = function () { return moment(this).format(); };
                    if (searchText)
                    {
                        expr = appendExpr(expr, "and", ['keywords', 'contains', searchText]);
                    }
 
                    filter = "filter=" + expr;
                }
                else if ($scope.filter)
                {
                    var expr = $scope.filter;
                    if (searchText)
                    {
                        expr = appendExpr(expr, "and", ['keywords', 'contains', searchText]);
                    }
                    filter = "filter=" + expr;
                }
                else if (searchText)
                {
                    filter = "filter=['keywords', 'contains','" + searchText + "']";
                }

                if (filter)
                {
                    if (params === "") {
                        params = filter;
                    }
                    else {
                        params += "&" + filter;
                    }
                }

                if (params) {
                    url += "?" + params;
                }

                var def = $.Deferred();

                $scope.url = url;

                $http.get(url).success(function (result) {
                    def.resolve(result);

                }).error(function (err) {
                    def.reject(err);
                });

                return def.promise();
            }
        },
        totalCount: function (loadOptions) {
            var def = $.Deferred();

            var url;

            if ($scope.isrelated && $scope.isrelated === true) {
                if ($scope.oid) {
                    if ($scope.relatedview) {
                        // get total count for a related class using a view
                        url = APP_CONFIG.ebaasRootUrl + "/api/count/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + $scope.relatedclass + "?view=" + $scope.relatedview;
                    }
                    else {
                        // get total count for a related class using default view
                        url = APP_CONFIG.ebaasRootUrl + "/api/count/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + $scope.relatedclass
                    }
                }
            }
            else {
                // get total count for master class
                if ($scope.tree && $scope.node)
                {
                    url = APP_CONFIG.ebaasRootUrl + "/api/count/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "?tree=" + $scope.tree + "&node=" + $scope.node;
                }
                else if ($scope.view) {
                    url = APP_CONFIG.ebaasRootUrl + "/api/count/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "?view=" + $scope.view;
                }
                else {
                    url = APP_CONFIG.ebaasRootUrl + "/api/count/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
                }
            }

            // keyword search text
            var searchText = $('#gridContainer').dxDataGrid('instance')._options.searchPanel.text;
            var filter = undefined;
            if (loadOptions.filter) {
                var expr = JSON.stringify(loadOptions.filter)
                if (searchText) {
                    expr = appendExpr(expr, "and", ['keywords', 'contains', searchText]);
                }

                filter = "filter=" + expr;
            }
            else if ($scope.filter) {
                var expr = $scope.filter;
                if (searchText) {
                    expr = appendExpr(expr, "and", ['keywords', 'contains', searchText]);
                }
                filter = "filter=" + expr;
            }
            else if (searchText) {
                filter = "filter=['keywords', 'contains','" + searchText + "']";
            }

            if (filter) {
                var pos = url.indexOf("?");
                if (pos != -1) {
                    url += "&";
                }
                else {
                    url += "?";
                }
                url += filter;
            }

            if (url) {
                $http.get(url).success(function (result) {

                    $scope.totalCount = result;

                    def.resolve(result);
                })
                   .error(function (err) {
                       def.reject(err);
                   });

                return def.promise();
            }
            else
            {
                return 0;
            }
        },
        remove: function (key) {
            var def = $.Deferred();

            var url;

            if ($scope.isrelated && $scope.isrelated === true) {
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.relatedclass + "/" + key;
            }
            else {
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + key;
            }

            $http.delete(url).success(function (result) {
                def.resolve(result);
            })
            .error(function (err) {
                def.reject(err["message"] + ":" + err["exceptionMessage"]);
            });

            return def.promise();
        }

    };

    $scope.customStore = new DevExpress.data.CustomStore(dbImpl);

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

    $scope.progressbar = ngProgressFactory.createInstance();

    $scope.export = function () {
        if ($scope.totalCount < 1000 ||
            confirm(String.format($rootScope.getWord("Export All"), $scope.totalCount))) {
            var items = new Array();

            $scope.progressbar.start();
            asyncLoop({
                length: Math.ceil($scope.totalCount / $scope.pageSize),
                functionToLoop: function (loop, i) {
                    var url = $scope.url;

                    var startIndex = url.indexOf("from=");
                    var endIndex = url.indexOf("&size=");
                    var rest = url.substring(endIndex);
                    if (startIndex != -1) {
                        url = url.substring(0, startIndex);
                        url += "from=" + i * $scope.pageSize;
                        url += rest;
                    }
                    else {
                        var pos = url.indexOf("?");
                        if (pos != -1) {
                            url += "&";
                        }
                        else {
                            url += "?";
                        }
                        url += "from=" + i * $scope.pageSize + "&size=" + $scope.pageSize;
                    }

                    $http.get(url).success(function (data) {
                        if (items.length === 0) {
                            items = data;
                        }
                        else {
                            items = items.concat(data);
                        }

                        loop();
                    }).error(function () {

                        $scope.progressbar.reset();
                    });
                },
                callback: function () {
                    var sql = 'SELECT ' + $scope.selectColumns + ' INTO XLSX("data.xlsx",{headers:true}) FROM ?';
 
                    alasql(sql, [items]);

                    $timeout($scope.progressbar.complete(), 1000);
                }
            })
        }
    };

    $scope.import = function () {
        if ($scope.isrelated && $scope.isrelated === true) {
            $state.go(".importdata", { schema: $scope.dbschema, class: $scope.dbclass, oid: $scope.oid, relatedclass: $scope.relatedclass }, { location: false, notify: false });
        }
        else {
            $state.go(".importdata", { schema: $scope.dbschema, class: $scope.dbclass }, { location: false, notify: false });
        }
    }
});