"use strict";


angular.module('app.wizards').controller('requestFormWizardCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, promiseParams, promiseInstance, RequestInfo, MetaDataCache, $location, $timeout, hubService) {

    // get wizard parameters
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.firstStepCallbacked = false;
    $scope.secondStepCallbacked = false;
    $scope.taskId = $stateParams.taskid;

    // clear the RequestInfo to start a new request
    RequestInfo.init();

    if (promiseInstance)
    {
        RequestInfo.instance = promiseInstance.data;
    }

    $scope.message = RequestInfo.error;

    $scope.allowGoNext = true;
    $scope.allowGoPrev = false;
    $scope.loading = false;
    $scope.currentStep = 1;

    RequestInfo.params = promiseParams.data;

    $scope.params = RequestInfo.params; // expose params to html template

    // initialize step controls
    $scope.firstStepControl = {
    };

    $scope.secondStepControl = {
    };

    $scope.thirdStepControl = {
    };

    $scope.firstStepCallback = function (instance) {
        if (instance) {
            RequestInfo.instance = instance; // keep return instance data in RequestInfo service
            RequestInfo.metadata = MetaDataCache.getClassView($scope.dbschema, $scope.dbclass, "full"); // meta data was saved by ebaasFormBaseCtlr
            $scope.firstStepCallbacked = true;

            // broadcast the obj_id of the new instance, since the attachment directive need to become editable
            $rootScope.$broadcast('instanceCreated', { oid: instance.obj_id });

            $scope.wizardInstance.wizard('next');
        }
        else
        {
            $scope.loading = false;
        }
    };

    $scope.secondStepCallback = function (instance) {
        //RequestInfo.instance = instance; // keep updated instance data in RequestInfo service
        $scope.secondStepCallbacked = true;

        $scope.wizardInstance.wizard('next');
    };

    $scope.thirdStepCallback = function (instance) {
        if (instance) {
            $scope.thirdStepCallbacked = true;

            // add the request submitter to the group to track the task
            var groupName = $scope.dbschema + "-" + $scope.dbclass + "-" + instance.obj_id;
            hubService.addToGroup(groupName);

            $scope.wizardInstance.wizard('next');
        }
        else
        {
            $scope.loading = false;
        }
    };

    $scope.wizardInstance = {};

    $scope.wizardCompleteCallback = function(wizardData){
        //console.log('wizardCompleteCallback', wizardData);
        if ($scope.thirdStepControl.goNextError() !== "") {

        }
        else {
            if (!$scope.thirdStepCallbacked) {
                // the form has not been submited, submit data wait for callback to switch to the next step
                $scope.loading = true;
                $scope.thirdStepControl.goNext();
            }
            else {
                $scope.thirdStepCallbacked = false;

                $scope.loading = false;
                $scope.allowGoNext = false;
                $scope.allowGoPrev = false;

                $.smallBox({
                    title: $rootScope.getWord('RequestSubmitted'),
                    content: "<i class='fa fa-info'></i> <i>" + $rootScope.getWord('Track Test Request') + "</i>",
                    color: "#5F895F",
                    iconSmall: "fa fa-check bounce animated",
                    timeout: 8000
                });

                startTimer();
            }
        }

    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);

            $location.path('/home/mainmenu');
        }, 1000);
    }

    $scope.getNextStepWord = function(key)
    {
        if ($scope.currentStep === 3)
        {
            return $rootScope.getWord("Submit");
        }
        else
        {
            return $rootScope.getWord(key);
        }
    }

    $scope.wizardStepEntered = function (e, data) {
        if (data.step === 1)
        {
            $scope.currentStep = 1;
            $scope.firstStepControl.init();
        }
        else if (data.step === 2)
        {
            $scope.currentStep = 2;
            $scope.secondStepControl.init();
        }
        else if (data.step === 3)
        {
            $scope.currentStep = 3;
            $scope.thirdStepControl.init();
        }
    }

    $scope.wizardStepChanged = function (e, data) {
        if (data.step === 1)
        {
            if (data.direction === "next") {
                if ($scope.firstStepControl) {
                    if ($scope.firstStepControl.goNextError() !== "") {
                        e.preventDefault();
                    }
                    else {
                        if (!$scope.firstStepCallbacked) {
                            // the form has not been submited, submit data wait for callback to switch to the next step
                            $scope.loading = true;
                            $scope.firstStepControl.goNext();
                            e.preventDefault();
                        }
                        else {
                            $scope.firstStepCallbacked = false;

                            // go to second step
                            $scope.allowGoPrev = true;
                            $scope.loading = false;
                        }
                    }
                }
            }
        }
        else if (data.step === 2)
        {
            if (data.direction === "next") {
                if (!$scope.secondStepCallbacked) {
                    // goNext will get data from server to validate the step, use async mode
                    $scope.loading = true;
                    $scope.secondStepControl.goNext();
                    e.preventDefault();
                }
                else {
                    $scope.secondStepCallbacked = false;
                    $scope.loading = false;

                    if ($scope.secondStepControl.goNextError() === "")
                    {
                        $scope.message = "";

                        // go to third step
                        $scope.allowGoPrev = true;
                    }
                    else
                    {
                        $scope.message = $scope.secondStepControl.goNextError();

                        // there are validating errors, prevent go to next step
                        e.preventDefault();
                    }
                }
            }
            else if (data.direction === "previous")
            {
                if ($scope.secondStepControl.goPrevError() !== "") {
                    e.preventDefault();
                }
                else
                {
                    $scope.secondStepControl.goPrev();
                    $scope.allowGoPrev = false;
                }
            }
        }
        else if (data.step === 3) {
            if (data.direction === "previous") {
                if ($scope.thirdStepControl.goPrevError() !== "") {
                    e.preventDefault();
                }
                else {
                    $scope.thirdStepControl.goPrev();
                }
            }
        }
    };

});