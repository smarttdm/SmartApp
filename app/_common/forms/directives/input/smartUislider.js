'use strict';

angular.module('SmartAdmin.Forms').directive('smartUislider', function ($parse, lazyScript) {
    return {
        restrict: 'A',
        compile: function (tElement, tAttributes) {

            tElement.removeAttr('smart-uislider data-smart-uislider');

            lazyScript.register('bootstrap-slider').then(function(){
			    tElement.bootstrapSlider();

			    $(tElement.data('bootstrapSlider').sliderElem).prepend(tElement);      	
            })

        }
    }
});