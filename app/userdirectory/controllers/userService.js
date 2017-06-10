"use strict";

angular.module('app.userdirectory').factory('userService', function ($http, APP_CONFIG) {

    var convertUsers = function (userCollection) {

        var id = "ID";
        var firstName = "FirstName";
        var lastName = "LastName";
        var phoneNumber = "PhoneNumber";
        var email = "Email";
        var picture = "Picture";
        var division = "Department";
        var address = "Location";
        var displayText = "DisplayText";

        var users = new Array();

        if (userCollection) {

            for (var i = 0; i < userCollection.length; i++) {
                var user = userCollection[i];

                var userItem = new Object();

                userItem.obj_id = user["obj_id"];
                userItem.ID = user[id];
                if (user[displayText]) {
                    userItem.FullName = user[displayText];
                }
                else
                {
                    userItem.FullName = user[lastName] + user[firstName];
                }
                userItem.PhoneNumber = user[phoneNumber];
                userItem.Email = user[email];
                userItem.Division = user[division];
                userItem.Address = user[address];
                if (user[picture]) {
                    userItem.Picture = APP_CONFIG.avatarsUrl + userItem.ID + ".png";
                }
                else
                {
                    userItem.Picture = APP_CONFIG.avatarsUrl + "male.png";
                }

                users.push(userItem);
            }
        }

        return users;
    }

    var createUnitTree = function (nodes, currentNodeObjId) {
        var map = {}, node, menuItem, parentItem, roots = [], menuItems = [];
        for (var i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            
            menuItem = new Object();
            menuItem.name = node.Name;
            menuItem.text = node.Text;
            menuItem.children = new Array();
            map[menuItem.name] = i; // use map to look-up the parents
            menuItems.push(menuItem);
        }

        for (var i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            menuItem = menuItems[i];

            if (node.parentRole != "") {
                parentItem = menuItems[map[node.parentRole]];
                parentItem.children.push(menuItem);
                menuItem.parentItem = parentItem;
            } else {
                //menuItem.expanded = true;
                menuItem.parentItem = undefined;
                roots.push(menuItem);
            }
        }

        for (var i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            menuItem = menuItems[i];

            if (menuItem.children.length > 0) {
                menuItem.content = "<span><i class=\"fa fa-lg fa-plus-circle\"></i> " + node.Text + "</span>";
                //menuItem.content = "<span class='label label-info'><i class=\"fa fa-lg fa-plus-circle\"></i>&nbsp;&nbsp;<a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('unitTreeContainer')).scope().getUnitUsers(" + node.obj_id + ");\">" + node.Text + "</a></span>";
            } else {
                if (currentNodeObjId && currentNodeObjId === node.obj_id)
                {
                    menuItem.content = "<span class='label label-warning'><a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('unitTreeContainer')).scope().getUnitUsers(" + node.obj_id + ");\">" + node.Text + "</a></span>";

                    var thisItem = menuItem;
                    while (thisItem.parentItem) {
                        thisItem = thisItem.parentItem;
                        thisItem.expanded = true;
                    }
                }
                else
                {
                    menuItem.content = "<span class='label label-info'><a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('unitTreeContainer')).scope().getUnitUsers(" + node.obj_id + ");\">" + node.Text + "</a></span>";
                }
            }
        }

        return roots;
    };

    function getAllUsers(dbschema, userclass, pageIndex, callback) {
	    
	    var pageSize = 20;
	    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + userclass + "?view=full&size=" + pageSize;
	    if (pageIndex) {
	        var from = pageIndex * pageSize;
	        url += "&from=" + from;
	    }

        $http.get(url).success(function (data) {
	        callback(convertUsers(data));
				
		}).error(function(){
		    callback([]);

		});
    }

    function getUnitTree(dbschema, roleclass, currentNodeId, callback) {

        var pageSize = 200;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + roleclass + "?view=full&size=" + pageSize + "&filter=['RType', '=', 'Unit']";

        $http.get(url).success(function (data) {
            callback(createUnitTree(data, currentNodeId));

        }).error(function () {
            callback(undefined);

        });
    }

    function getFunctions(dbschema, roleclass, callback) {

        var pageSize = 200;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + roleclass + "?view=full&size=" + pageSize + "&filter=['RType', '=', 'Function']";

        $http.get(url).success(function (data) {
            callback(data);

        }).error(function () {
            callback(undefined);

        });
    }
	
	return {
	    getAllUsers: function (dbschema, userclass, pageIndex, callback) {
	        getAllUsers(dbschema, userclass, pageIndex, callback);
	    },
	    convertUsers: function (userCollection) {
	        return convertUsers(userCollection);
	    },
	    getUnitTree: function (dbschema, roleclass, currentNodeId, callback) {
	        return getUnitTree(dbschema, roleclass, currentNodeId, callback);
	    },
	    getFunctions: function (dbschema, roleclass, callback) {
	        return getFunctions(dbschema, roleclass, callback);
	    }
	}
});