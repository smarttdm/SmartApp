"use strict";

angular.module("app.hub").factory("hubService", function($http, $q, localStorageService, APP_CONFIG, User) {

    var hubServiceFactory = {};

    var _connect = function(schema, callback) {
        // establish signalr connection
        var hub = $.connection.messageHub; // create a proxy to signalr hub on web server

        // Create a function that the hub can call to broadcast messages.
        hub.client.addMessage = function (type, message) {
            if (callback)
            {
                callback(type, message);
            }
        };

        $.connection.hub.stop();

        $.connection.hub.qs = { 'user': User.userName, 'schema': schema }; // user name as part of query string of signalr connection
 
        $.connection.hub.start(); // connect to signalr hub

        $.connection.hub.error(function (error) {
            console.log('SignalR error: ' + error)
        });
    };

    var _dicconnect = function () {
        $.connection.hub.stop();
    };

    var _addToGroup = function (group) {

        var hub = $.connection.messageHub; // create a proxy to signalr hub on web server

        hub.server.addToGroup(group);
    };

    var _removeFromGroup = function (group, callback) {

        var hub = $.connection.messageHub; // create a proxy to signalr hub on web server

        hub.server.removeFromGroup(group).done(function () {
            if (callback)
            {
                callback();
            }
        });
    };

    var _getUserGroups = function (callback) {

        var hub = $.connection.messageHub; // create a proxy to signalr hub on web server

        hub.server.getUserGroups().done(function (groups) {
            callback(groups);
        });
    };

    var _isUserInGroup = function (group, callback) {

        var hub = $.connection.messageHub; // create a proxy to signalr hub on web server

        hub.server.isUserInGroup(group).done(function (status) {
            callback(status);
        });
    };

    hubServiceFactory.connect = _connect;
    hubServiceFactory.disconnect = _dicconnect;
    hubServiceFactory.addToGroup = _addToGroup;
    hubServiceFactory.removeFromGroup = _removeFromGroup;
    hubServiceFactory.getUserGroups = _getUserGroups;
    hubServiceFactory.isUserInGroup = _isUserInGroup;

    return hubServiceFactory;
});