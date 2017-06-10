'use strict';

angular.module('app.forum').controller('forumTopicsCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, User, forumService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.groupCategory = $stateParams.category;
    $scope.topicClass = "Topic";
    $scope.groupName = $stateParams.groupName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupPK = $stateParams.groupPK;

    if ($stateParams.keywords)
        $scope.keywords = $stateParams.keywords;
    else
        $scope.keywords = "";

    $scope.topicName = "";
    $scope.topicDesc = "";

    if ($stateParams.pageIndex) {
        $scope.pageIndex = parseInt($stateParams.pageIndex);
    }
    else {
        $scope.pageIndex = 0;
    }

    // Getting topics
    if ($scope.groupName) {
        forumService.getTopics($stateParams.schema, $stateParams.class, $stateParams.groupId, $scope.topicClass, 0, function (data) {
            $scope.topics = data;
        });
    }
    else
    {
        forumService.searchTopics($stateParams.schema, $scope.topicClass, $scope.keywords, 0, function (data) {

            $scope.topics = data;
        });
    }

    if ($scope.groupName) {
        // Getting popular topics in the given group
        forumService.getPopularTopicsInGroup($stateParams.schema, $stateParams.class, $stateParams.groupId, $scope.topicClass, function (data) {
            $scope.populartopics = data;

        });
    }
    else
    {
        // Getting popular topics across groups
        forumService.getPopularTopics($stateParams.schema, $scope.topicClass, function (data) {
            $scope.populartopics = data;

        });
    }

    $scope.reload = function (pageIndex) {

        $scope.pageIndex = pageIndex;

        if ($scope.groupName) {
            forumService.getTopics($stateParams.schema, $stateParams.class, $stateParams.groupId, $scope.topicClass, pageIndex, function (data) {

                $scope.topics = data;
            });
        }
        else {
            forumService.searchTopics($stateParams.schema, $scope.topicClass, $scope.keywords, pageIndex, function (data) {

                $scope.topics = data;
            });
        }
    }

    $scope.prev = function () {
        if ($scope.pageIndex > 0) {
            var pageIndex = $scope.pageIndex - 1;
            $scope.pageIndex = pageIndex;

            if ($scope.groupName) {
                forumService.getTopics($stateParams.schema, $stateParams.class, $stateParams.groupId, $scope.topicClass, pageIndex, function (data) {

                    $scope.topics = data;
                });
            }
            else {
                forumService.searchTopics($stateParams.schema, $scope.topicClass, $scope.keywords, pageIndex, function (data) {

                    $scope.topics = data;
                });
            }
        }
    }

    $scope.next = function () {
        var pageIndex = $scope.pageIndex + 1;
        $scope.pageIndex = pageIndex;

        if ($scope.groupName) {
            forumService.getTopics($stateParams.schema, $stateParams.class, $stateParams.groupId, $scope.topicClass, pageIndex, function (data) {

                $scope.topics = data;
            });
        }
        else {
            forumService.searchTopics($stateParams.schema, $scope.topicClass, $scope.keywords, pageIndex, function (data) {

                $scope.topics = data;
            });
        }
    }

    $scope.searchTopics = function () {
        forumService.searchTopics($stateParams.schema, $scope.topicClass, $scope.keywords, 0, function (data) {

            $scope.topics = data;
        });
    }

    $scope.addTopic = function() {
        var topic = new Object();
        topic.poster = User.userName;
        topic.PostTime = new Date();
        topic.name = $scope.topicName;
        topic.desc = $scope.topicDesc;
        topic.groupPK = $scope.groupPK;


        // Add topic
        forumService.addTopic($stateParams.schema, $scope.topicClass, topic, function (data) {

            $scope.topics.unshift(data);
            $scope.topicName = "";
            $scope.topicDesc = "";
        });
    }
});