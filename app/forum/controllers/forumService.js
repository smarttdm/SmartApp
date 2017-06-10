"use strict";

angular.module('app.forum').factory('forumService', function ($http, APP_CONFIG) {

    var convertTopics = function(topicCollection) {

        var id = "ID";
        var name = "Name";
        var desc = "Description";
        var postQty = "PostQty";
        var poster = "LatestPostUser";
        var postTime = "LatestPostTime";

        var topics = new Array();

        if (topicCollection) {

            for (var i = 0; i < topicCollection.length; i++) {
                var topic = topicCollection[i];

                var topicItem = new Object();

                topicItem.obj_id = topic["obj_id"];
                topicItem.id = topic[id];
                topicItem.name = topic[name];
                topicItem.desc = topic[desc];
                topicItem.postQty = topic[postQty];
                topicItem.poster = topic[poster];
                topicItem.postTime = topic[postTime];

                topics.push(topicItem);
            }
        }

        return topics;
    }

    var convertPosts = function (postCollection) {

        var id = "ID";
        var content = "Content";
        var poster = "Poster";
        var posterName = "PosterName";
        var postTime = "PostTime";

        var posts = new Array();

        if (postCollection) {

            for (var i = 0; i < postCollection.length; i++) {
                var post = postCollection[i];

                var postItem = new Object();

                postItem.obj_id = post["obj_id"];
                postItem.id = post[id];
                postItem.content = post[content];
                postItem.poster = post[poster];
                postItem.posterName = post[posterName];
                postItem.postTime = post[postTime];

                posts.push(postItem);
            }
        }

        return posts;
    }

    function getForumTopics(dbschema, dbclass, groupId, topicClass, pageIndex, callback) {
	    
        var pageSize = 20;
      
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + groupId + "/" + topicClass + "?view=full&size=" + pageSize;
	    if (pageIndex) {
	        var from = pageIndex * pageSize;
	        url += "&from=" + from;
	    }

	    $http.get(url).success(function (data) {
	        callback(convertTopics(data));
				
		}).error(function(){
		    callback([]);

		});
    }

    function getPopularTopics(dbschema, topicClass, callback) {

        var pageSize = 15;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + topicClass + "?view=full&size=" + pageSize + "&sortfield=PostQty&sortreverse=true";

        $http.get(url).success(function (data) {
            callback(convertTopics(data));

        }).error(function () {
            callback([]);

        });
    }

    function getGroupPopularTopics(dbschema, dbclass, groupId, topicClass, callback) {

        var pageSize = 5;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + groupId + "/" + topicClass + "?view=full&size=" + pageSize + "&sortfield=PostQty&sortreverse=true";

        $http.get(url).success(function (data) {
            callback(convertTopics(data));

        }).error(function () {
            callback([]);

        });
    }

    function searchTopicsWithKeywords(dbschema, topicClass, keywords, pageIndex, callback) {
        var pageSize = 20;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + topicClass + "?view=full&size=" + pageSize + "&filter=[\"Name\", \"contains\",\"" + encodeURIComponent(keywords) + "\"]";
        if (pageIndex) {
            var from = pageIndex * pageSize;
            url += "&from=" + from;
        }

        $http.get(url).success(function (data) {
            callback(convertTopics(data));

        }).error(function () {
            callback([]);
        });
    }

    function getForumPosts(dbschema, dbclass, topicId, postClass, pageIndex, callback) {
        var pageSize = 100;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + topicId + "/" + postClass + "?view=full&size=" + pageSize;
        if (pageIndex) {
            var from = pageIndex * pageSize;
            url += "&from=" + from;
        }

        $http.get(url).success(function (data) {
            callback(convertPosts(data));

        }).error(function () {
            callback([]);

        });
    }

    function addForumTopic(dbschema, topicClass, topic, callback) {
        var model = new Object();
        model.Name = topic.name;
        model.Description = topic.desc;
        model.Poster = topic.poster;
        model.PostTime = topic.postTime;
        model.PostQty = 0;
        model.LatestPostUser = "None";
        model.LatestPostTime = "";
        model.toGroup = topic.groupPK;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + topicClass;
        if (topic.obj_id) {
            url += "/" + topic.obj_id;
        }

        $http.post(url, model)
            .success(function (data) {
                if (data) {
                    var array = new Array();
                    array.push(data)
                    array = convertTopics(array);
                    callback(array[0]);
                }
                else {
                    callback(data);
                }
            })
            .error(function () {
            });
    }

    function addTopicPost(dbschema, postClass, post, callback) {
        var model = new Object();
        model.Poster = post.poster;
        model.PostTime = post.postTime;
        model.IsPublic = "1";
        model.Content = post.content;
        model.toTopic = post.topicPK;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + postClass;
        if (post.obj_id) {
            url += "/" + post.obj_id;
        }

        $http.post(url, model)
            .success(function (data) {
                if (data) {
                    var array = new Array();
                    array.push(data)
                    array = convertPosts(array);
                    callback(array[0]);
                }
                else {
                    callback(data);
                }
            })
            .error(function () {
            });
    }
	
	return {
	    getTopics: function (dbschema, dbclass, groupId, topicClass, pageIndex, callback) {
	        getForumTopics(dbschema, dbclass, groupId, topicClass, pageIndex, callback);
	    },
	    getPopularTopics: function (dbschema, topicClass, callback) {
	        getPopularTopics(dbschema, topicClass, callback);
	    },
	    getPopularTopicsInGroup: function (dbschema, dbclass, groupId, topicClass, callback) {
	        getGroupPopularTopics(dbschema, dbclass, groupId, topicClass, callback);
	    },
	    searchTopics: function (dbschema, topicclass, keywords, pageIndex, callback) {
	        searchTopicsWithKeywords(dbschema, topicclass, keywords, pageIndex, callback);
	    },
	    getPosts: function (dbschema, dbclass, topicId, postClass, pageIndex, callback) {
	        getForumPosts(dbschema, dbclass, topicId, postClass, pageIndex, callback);
	    },
	    addTopic: function (dbschema, topicClass, topic, callback) {
	        addForumTopic(dbschema, topicClass, topic, callback);
	    },
	    addPost: function (dbschema, postClass, post, callback) {
	        addTopicPost(dbschema, postClass, post, callback);
	    }
	}
});