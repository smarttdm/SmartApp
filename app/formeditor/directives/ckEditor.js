'use strict';

angular.module('app.smartforms').directive('ckEditor', function (APP_CONFIG, $stateParams, $compile) {
    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            CKEDITOR.config.contentsCss = ['plugin/bootstrap/dist/css/bootstrap.min.css'];
            var ck = CKEDITOR.replace(elm[0], { height: '450px', startupFocus: true });
            if (!ngModel) return;
            ck.scope = scope;
            ck.compile = $compile;
            ck.on('instanceReady', function () {
                ck.setData(ngModel.$viewValue);
            });
            function updateModel() {
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            };
            function saveModel() {
                scope.saveModel();

                return false;
            }
            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);
            ck.on('save', saveModel);

            ngModel.$render = function (value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
});
