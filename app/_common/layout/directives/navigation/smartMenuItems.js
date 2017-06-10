(function(){
    "use strict";

    angular.module('SmartAdmin.Layout').directive('smartMenuItems', function ($http, $rootScope, $compile, APP_CONFIG) {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            

            function createItem(item, parent, level){
                var li = $('<li />' ,{'ui-sref-active': "active"})
                var a = $('<a />');
                var i = $('<i />');

                li.append(a);

                if (item.sref) {
                    a.attr('ui-sref', item.sref);
                    // add this option to reload state when clicked

                    a.attr("ui-sref-opts", "{reload: true}");
                }
                if(item.href)
                    a.attr('href', item.href);
                if(item.icon){
                    i.attr('class', item.icon);
                    a.append(i);
                }
                if(item.title){
                    a.attr('title', item.title);
                    if(level == 1){ 
                        a.append(' <span class="menu-item-parent">' + item.title + '</span>');
                    } else {
                        a.append(' ' + item.title);

                    }

                    // add a badge to the app.tasks.list item
                    if (item.sref) {
                        var myTaskSref = "app.myspace";
                        if (item.sref.substring(0, myTaskSref.length) === myTaskSref) {
                            a.append('<span class="badge pull-right inbox-badge">{{getTotalCount()}}</span>');
                        }
                    }
                }

                if(item.items){
                    var ul = $('<ul />');
                    li.append(ul);
                    li.attr('data-menu-collapse', '');
                    _.forEach(item.items, function(child) {
                        createItem(child, ul, level+1);
                    })
                } 

                parent.append(li); 
            }

            $http.get(APP_CONFIG.ebaasRootUrl + attrs.smartMenuItems).then(function (res) {

                var ul = $('<ul />', {
                    'smart-menu': ''
                })
                _.forEach(res.data.items, function (item) {
                    if (item.visible) {
                        createItem(item, ul, 1);
                    }
                })
                
                var $scope = $rootScope.$new();
                var html = $('<div>').append(ul).html(); 
                var linkingFunction = $compile(html);
                
                var _element = linkingFunction($scope);

                element.replaceWith(_element);                
            })
        }
    }
});
})();