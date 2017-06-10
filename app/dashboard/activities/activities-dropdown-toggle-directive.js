"use strict";

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

angular.module('app').directive('activitiesDropdownToggle', function($log) {

	var link = function($scope,$element, attrs){
		var ajax_dropdown = null;

		$element.on('click', function () {
			var badge = $(this).find('.badge');

            /*
			if (badge.hasClass('bg-color-red')) {

				badge.removeClass('bg-color-red').text(0);

			}
            */

			ajax_dropdown = $(this).next('.ajax-dropdown');

			if (!ajax_dropdown.is(':visible')) {

				ajax_dropdown.fadeIn(150);

				$(this).addClass('active');

			}
			 else {
				
				ajax_dropdown.fadeOut(150);
				
				$(this).removeClass('active');

			}

		})

		$(document).mouseup(function (e) {
		    if (ajax_dropdown && !ajax_dropdown.is(e.target) && (ajax_dropdown.has(e.target).length === 0 || isEmpty(e.target))) {
				ajax_dropdown.fadeOut(150);
				$element.removeClass('active');
			}
		});
	}
	
	return{
		restrict:'EA',
		link:link
	}
});