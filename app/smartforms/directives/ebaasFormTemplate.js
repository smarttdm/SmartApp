'use strict';

angular.module('app.smartforms').directive('ebaasFormTemplate', function ($templateRequest, $compile, $sce, APP_CONFIG, $stateParams) {
    return {
        restrict: "E",
        scope: true,
        link: function (scope, element, attrs) {
            var schema = scope.$eval(attrs.dbschema);
            var cls = scope.$eval(attrs.dbclass);
            var oid = scope.$eval(attrs.oid);
            var template = scope.$eval(attrs.template);
            var formAttribute = scope.$eval(attrs.formattribute);
            var previewid = scope.$eval(attrs.previewid);
            var taskId = undefined;
            var readOnly = false;
            if (attrs.readonly)
            {
                readOnly = scope.$eval(attrs.readonly);
            }

            if (attrs.taskid) {
                taskId = scope.$eval(attrs.taskid);
            }

            var url = undefined;
            if (cls) {
                if (formAttribute && oid)
                {
                    // get custom form from an property value
                    url = APP_CONFIG.ebaasRootUrl + "/api/form/template/" + encodeURIComponent(schema) + "/" + cls + "/" + oid + "?templateSource=property&property=" + formAttribute + "&readOnly=" + readOnly;
                }
                else if (template) {
                    if (oid) {
                        // get custom form
                        url = APP_CONFIG.ebaasRootUrl + "/api/form/template/" + encodeURIComponent(schema) + "/" + cls + "/" + oid + "?templateSource=file&template=" + encodeURIComponent(template) + "&readOnly=" + readOnly;
                    }
                    else {
                        url = APP_CONFIG.ebaasRootUrl + "/api/form/template/" + encodeURIComponent(schema) + "/" + cls + "?templateSource=file&template=" + encodeURIComponent(template) + "&readOnly=" + readOnly;
                    }
                }
                else {
                    if (oid) {
                        // get a default form
                        url = APP_CONFIG.ebaasRootUrl + "/api/form/template/" + encodeURIComponent(schema) + "/" + cls + "/" + oid + "?readonly=" + readOnly;
                    }
                    else {
                        url = APP_CONFIG.ebaasRootUrl + "/api/form/template/" + encodeURIComponent(schema) + "/" + cls + "?readOnly=" + readOnly;
                    }
                }

                if (previewid)
                {
                    url += "&previewid=" + previewid;
                }

                if (taskId)
                {
                    url += "&taskId=" + taskId;
                }
            }
            
            if (url) {
                // Load the html through $templateRequest
                $templateRequest($sce.trustAsResourceUrl(url)).then(function (html) {
                    // Convert the html to an actual DOM node
                    html = html.slice(1, html.length); // remove double quote at start and end
                    html = html.replace(/\\/g, "");

                    var template = angular.element($.trim(html)); // remove spaces

                    // Append it to the directive element
                    element.append(template);
                    // And let Angular $compile it
                    $compile(template)(scope);
                });
            }
        }
    }
});
