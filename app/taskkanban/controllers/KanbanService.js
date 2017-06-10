"use strict";

var resource1 = { name: '查看', imageUrl: 'styles/img/Resource1.png' }, resource2 = { name: '查看', imageUrl: 'styles/img/Resource2.png' };

angular.module('app.taskkanban').factory('KanbanService', function ($http, APP_CONFIG) {

    function getKanbanModel(dbschema, kanban, filter, keywords, pageIndex, callback)
    {
        var pageSize = 4;
        var paramsAdded = false;
        var url = APP_CONFIG.ebaasRootUrl + "/api/kanban/data/" + encodeURIComponent(dbschema) + "/" + encodeURIComponent(kanban);

        if (filter) {
            url += "?filter=" + filter;
            paramsAdded = true;
        }
        else if (keywords) {

            url += "?filter=[\"keywords\", \"contains\",\"" + keywords + "\"]";
            paramsAdded = true;
        }

        if (pageIndex) {
            var from = pageIndex * pageSize;
            if (paramsAdded) {
                url += "&from=" + from + "&size=" + pageSize;
            }
            else {
                url += "?from=" + from + "&size=" + pageSize;
            }
        }
        else {
            var from = 0;
            if (paramsAdded) {
                url += "&from=" + from + "&size=" + pageSize;
            }
            else {
                url += "?from=" + from + "&size=" + pageSize;
            }
        }

        $http.get(url).success(function (data) {
            callback(data);

        }).error(function () {
            callback([]);

        });
    }

	function getKanbanStates(dbschema, kanban){

	    var url = APP_CONFIG.ebaasRootUrl + "/api/kanban/states/" + encodeURIComponent(dbschema) + "/" + encodeURIComponent(kanban);
	    
	    $http.get(url).success(function (data) {

			return data;
				
		}).error(function(){
			return [];

		});
	}

	function getKanbanGroups(dbschema, kanban) {

	    var url = APP_CONFIG.ebaasRootUrl + "/api/kanban/groups/" + encodeURIComponent(dbschema) + "/" + encodeURIComponent(kanban);
		$http.get(url).success(function(data){

			return data;
				
		}).error(function(){
			return [];
		});

	}

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

	function getKanbanItems(dbschema, kanban, states, groups) {
	    var items = new Array();
	    var item;
	    var state;
	    // iterate groups to get items
	    asyncLoop({
	        length: groups.length,
	        functionToLoop: function (loop, i) {
	            var url = APP_CONFIG.ebaasRootUrl + "/api/kanban/items/" + encodeURIComponent(dbschema) + "/" + encodeURIComponent(kanban) + "/" + groups[i].id;
	            $http.get(url).success(function (data) {

	                for (var j = 0; j < data.length; j++) {
	                    item = new Object();
	                    item.id = data[j].id;
	                    item.name = data[j].name;
	                    item.group = groups[i];
	                    item.state = undefined;
	                    for (var k = 0; k < states.length; k++)
	                    {
	                        if (data[j].state === states[k].name)
	                        {
	                            item.state = states[k];
	                            break;
	                        }
	                    }
	                    item.assignedResource = resource1;
	                    items.push(item);
	                }

	                loop();
	            });
	        },
	        callback: function () {
	            //console.debug("All items obtained");

	            return items;
	        }
	    })
	}
	
	return {
	    getKanbanModel: function(dbschema, kanban, filter, keywords, pageIndex, callback)
	    {
	        getKanbanModel(dbschema, kanban, filter, keywords, pageIndex, callback);
	    },
		getStates:function(dbschema, kanban){
		    getKanbanStates(dbschema, kanban);
		},
		getGroups:function(dbschema, kanban){
		    getKanbanGroups(dbschema, kanban);
		},
		getItems: function (dbschema, kanban, states, groups) {
		    getKanbanItems(dbschema, kanban, states, groups);
		}
	}
});