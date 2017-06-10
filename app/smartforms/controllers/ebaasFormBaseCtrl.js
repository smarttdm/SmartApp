'use strict';

angular.module('app.smartforms').controller('ebaasFormBaseCtrl', function ($rootScope, $scope, $http, APP_CONFIG, $state, $stateParams, MetaDataCache) {
    
    $scope.submitted = false;
    $scope.message = "";
    $scope.loading = false;
    $scope.hasError = false;

    if ($scope.dbclass) {
        var metadata = MetaDataCache.getClassView($scope.dbschema, $scope.dbclass, "full");
        if (metadata) {
            // get from cache
            $scope.caption = metadata.title;
        }
        else {
            $http.get(APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "?view=full")
                    .success(function (data) {
                        $scope.caption = data.title;
                        MetaDataCache.setClassView($scope.dbschema, $scope.dbclass, "full", data)
                    });
        }
    }

    loadFormData();

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

    $scope.updateListOptions = function (propertyNames, filterValue) {
        // getting options from api one by one in asunc mode
        asyncLoop({
            length: propertyNames.length,
            functionToLoop: function (loop, i) {
                var url = APP_CONFIG.ebaasRootUrl + "/api/form/listoptions/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + propertyNames[i] + "/" + encodeURIComponent(filterValue);
                $http.get(url).success(function (data) {

                    $scope.model[propertyNames[i]].options = data; // set the new options

                    loop();
                });
            },
            callback: function () {

            }
        })
    }

    $scope.reloadInstance = function(propertyName)
    {
        // something important changed in the instance, reload it from db
        var url;
        if ($scope.formAttribute) {
            if ($scope.oid)
                // get data for a form template which is an attribute value of the instance
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + propertyName + "/refresh" + "?formAttribute=" + $scope.formAttribute;
            else
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + propertyName + "/refresh" + "?formAttribute=" + $scope.formAttribute;
        }
        else if ($scope.template) {
            if ($scope.oid)
                // get data for a template-based custom form
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + propertyName + "/refresh" + "?template=" + encodeURIComponent($scope.template); // trailing slash to allow template name contans dot
            else
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + propertyName + "/refresh" + "?template=" + encodeURIComponent($scope.template); // trailing slash to allow template name contans dot
        }
        else {
            if ($scope.oid)
                // get a detailed instance
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + propertyName + "/refresh" + "?formformat=true";
            else
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + "/" + propertyName + "/refresh" + "?formformat=true";
        }

        $http.post(url, $scope.model)
          .success(function (data) {
              //console.log(data);
              $scope.model = data;
          });
    }

    $scope.getDuplicateDataUrl = function (oid, deepclone)
    {
        var url = undefined;
        if (oid) {
            if ($scope.formAttribute) {
                // get data for a form template which is an attribute value of the instance
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + oid + "/clone" + "?formAttribute=" + $scope.formAttribute + "&deep=" + deepclone;
            }
            else if ($scope.template) {
                // get data for a template-based custom form
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + oid + "/clone" + "?template=" + encodeURIComponent($scope.template) + "&deep=" + deepclone;
            }
            else {
                // get a detailed instance
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + oid + "/clone" + "?formformat=true" + "&deep=" + deepclone;
            }
        }

        return url;
    }

    $scope.submitForm = function(callbackMethod)
    {
        // validate the form data using server-side rules
        serverSideValidate(function(isValid, msg)
        {
           submitFormData(callbackMethod, isValid, msg);
        })
    }

    $scope.onSubmit = function () {
        // validate the form data using server-side rules
        serverSideValidate(function (isValid, msg) {
           submitFormData(null, isValid, msg);
        })
    };

    $scope.reloadForm = function()
    {
        loadFormData();
    }

    function loadFormData()
    {
        var url;

        if ($scope.oid) {
            if ($scope.formAttribute) {
                // get data for a form template which is an attribute value of the instance
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "?formAttribute=" + $scope.formAttribute;
            }
            else if ($scope.template) {
                // get data for a template-based custom form
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "?template=" + encodeURIComponent($scope.template); // trailing slash to allow template name contans dot
            }
            else {
                // get a detailed instance
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "?formformat=true";
            }

            if (url) {
                $http.get(url)
                    .success(function (data) {
                        $scope.model = data;
                    });
            }
        }
        else {
            if ($scope.cloneid && $scope.cloneclass) {
                // get a cloned instance as initial values for the new instance, clone id and clone class are set by sub controller
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.cloneclass + "/" + $scope.cloneid + "?formformat=true";
            }
            else if ($scope.template) {
                // get data for a template-based custom form
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/new?template=" + encodeURIComponent($scope.template); // tralling slash allowing template name conatain dot
            }
            else {
                // get a default form
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/new";
            }

            if (url) {
                $http.get(url)
                    .success(function (data) {
                        $scope.model = data;
                    });
            }
        }
    }

    var serverSideValidate = function(callbackFunc)
    {
        var url = APP_CONFIG.ebaasRootUrl + "/api/form/validate/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;

        $http.post(url, $scope.model)
            .success(function (msg) {
                if (msg) {
                    callbackFunc(false, msg);
                }
                else {
                    callbackFunc(true, "");
                }
            });
    }

    var submitFormData = function (callbackMethod, isValid, errMsg)
    {
        var url;

        $scope.submitted = true;

        //console.debug("submite form called with valid form =" + $scope.ebaasform.$valid);

        //if ($scope.ebaasform.$valid && $scope.ebaasform.$dirty) {
        if (isValid) {
            if ($scope.ebaasform.$valid) { // we don't check dirty since nested form may have row deleted which doesn't flag as dirty
                if ($scope.formAttribute && $scope.oid) {
                    // get data for a form template which is an attribute value of the instance
                    url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "?formAttribute=" + $scope.formAttribute;
                }
                else if ($scope.template) {
                    if ($scope.oid) {
                        // update data for a template-based custom form
                        url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "?template=" + encodeURIComponent($scope.template);
                    }
                    else {
                        // add a data for a template-based custom form
                        url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "?template=" + encodeURIComponent($scope.template);
                    }
                }
                else {
                    if ($scope.oid) {
                        // update data for a default form
                        url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid;
                    }
                    else {
                        // add data for a default form
                        url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
                    }
                }

                //console.debug("pos url = " + url);
                $scope.loading = true;
                $http.post(url, $scope.model, {
                    headers: {
                        'formId': $scope.formId,
                        'taskId': $scope.taskId,
                        'actionId': $scope.actionId
                    }
                })
                .success(function (data) {
                    $scope.message = $rootScope.getWord('Submitted');
                    $scope.loading = false;
                    $scope.hasError = false;
                    if (!$scope.oid && data.obj_id)
                    {
                        // get oid from the newly created instance
                        $scope.oid = data.obj_id;
                    }

                    if (callbackMethod) {
                        callbackMethod({ 'instance': data });
                    }
                })
                .error(function (err) {
                    $scope.message = err.message;
                    $scope.hasError = true;
                    $scope.loading = false;
                });
            }
            else {
                console.debug("invalid error");
                $scope.message = $rootScope.getWord('ValidationError');
            }
        }
        else
        {
            $scope.hasError = true;
            $scope.message = errMsg;
            /*
            BootstrapDialog.show({
                title: $rootScope.getWord("Error Dialog"),
                type: BootstrapDialog.TYPE_DANGER,
                message: errMsg,
                buttons: [{
                    label: $rootScope.getWord("Cancel"),
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
            */

            if (callbackMethod) {
                callbackMethod({ 'instance': undefined });
            }
        }
    }

    var deepValue = function (obj, path) {
        for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
            obj = obj[path[i]];
        };
        return obj;
    };

    $scope.removeArrayRow = function (path, index)
    {
        var array = deepValue($scope.model, path);
        if (array) {
            array.splice(index, 1);
        }
    }

    $scope.addEmptyArrayRow = function(path)
    {
        var array = deepValue($scope.model, path);
        if (array) {
            var newObject = {};
            array.push(newObject);
        }
    }

    $scope.imageChangeTime = new Date().getTime();

    $scope.getImageUrl = function(property)
    {
        if ($scope.model &&
            $scope.model[property]) {
            return "styles/custom/images/" + $scope.model[property] + '?' + $scope.imageChangeTime;
        }
        else {
            return "styles/img/blank.jpg";
        }
    }

    $scope.ClearImage = function(property)
    {
        if ($scope.model &&
            $scope.model[property]) {
            // delete the image on server
            var url = APP_CONFIG.ebaasRootUrl + "/api/images/images/" + $scope.model[property];
            $http.delete(url).success(function (data) {
                $scope.model[property] = "";
            });
        }
    }

    $scope.getImageId = function(property)
    {
        if ($scope.model && $scope.model["obj_id"])
        {
            return "img-" + $scope.dbschema + "-" + $scope.dbclass + "-" + property + "-" + $scope.model["obj_id"] + ".png";
        }
        else
        {
            return "";
        }
    }

    $scope.showImageEditButtons = function()
    {
        if ($scope.model && $scope.model["obj_id"]) {
            return true;
        }
        else
        {
            return false;
        }
    }

    $scope.copyArrayRow = function (path, index) {

        var array = deepValue($scope.model, path);

        if (array) {
            var oldObject = array[index];
            var newObject = jQuery.extend(true, {}, oldObject);
            newObject.obj_id = "";
            array.push(newObject);
        }
    }

    $rootScope.$on('modalClosed', function (event, data) {
        if (data)
        {
            if (data.modal === "pickPrimaryKey")
            {
                $scope.model[data.property] = data.value;

                if (data.callback && data.callback === "true")
                    // pk change need to call the server-end callback function
                    $scope.reloadInstance(data.property);
            }
            else if (data.modal === "uploadImage") {
                $scope.model[data.property] = data.value;
                $scope.imageChangeTime = new Date().getTime();
            }
            else if (data.modal === "viewManyToMany") {
                loadFormData(); // reload the form data
            }
        }
    });

    $scope.getSelectedText = function getSelectedText(elementId) {
        var elt = document.getElementById(elementId);

        console.log(elt);
        if (elt.selectedIndex == -1)
            return null;

        return elt.options[elt.selectedIndex].text;
    }

    $scope.getCssClasses = function (ngModelController) {
        return {
            'has-error': ngModelController && ngModelController.$invalid && (ngModelController.$dirty || $scope.submitted),
            'has-success': ngModelController && ngModelController.$valid && (ngModelController.$dirty || $scope.submitted)
        };
    };

    $scope.getFormCssClasses = function (formModelController) {
        return {
            'alert alert-danger': formModelController.$invalid || $scope.hasError,
            'alert alert-success': formModelController.$valid && !$scope.hasError
        };
    };

    $scope.showError = function (formModelController, ngModelController, error) {
        return (ngModelController.$dirty || $scope.submitted) && ngModelController.$error[error];
 
    };

    $scope.canSave = function () {
        //return $scope.ebaasform.$dirty && $scope.ebaasform.$valid;
        return true;
    };

    $scope.goBack = function () {
        if ($scope.submitted) {
            $state.go($scope.parentStateName, {}, { reload: true });
        }
        else {
            $state.go($scope.parentStateName);
        }
    }

    $scope.duplicate = function () {
        BootstrapDialog.show({
            title: $rootScope.getWord("Confirm Dialog"),
            type: BootstrapDialog.TYPE_WARNING,
            message: $rootScope.getWord("Confirm Duplicate Form"),
            buttons: [{
                label: $rootScope.getWord("Confirm"),
                action: function (dialog) {
                    dialog.close();
                    // duplicateFunc defined in sub controller to duplicate the current data instance
                    if ($scope.duplicateFunc)
                    {
                        $scope.duplicateFunc();
                    }
                }
            }, {
                label: $rootScope.getWord("Cancel"),
                action: function (dialog) {
                    dialog.close();
                }
            }]
        });
    }

    $scope.allowSubmit = function()
    {
        if (($scope.preview && $scope.preview === true) ||
            ($scope.readonly && $scope.readonly === true) ||
            ($scope.model && $scope.model.allowWrite === false) ||
            (!$scope.oid && $scope.model && $scope.model.allowCreate === false))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    $scope.allowDuplicate = function () {
        if ($scope.duplicateBtn && $scope.duplicateBtn === true && $scope.model && $scope.model.allowCreate === true)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    $scope.options = {
        height: 250,
        focus: true,
        toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['table', ['table']],
                ['insert', ['link','picture']],
                ['view', ['codeview']]
        ]
    };
});
