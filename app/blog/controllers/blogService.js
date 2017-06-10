"use strict";

angular.module('app.blog').factory('blogService', function ($http, APP_CONFIG) {

    var convertGroups = function(groupCollection) {

        var id = "ID";
        var name = "Name";
        var desc = "Desc";
        var blogQty = "BlogQty";
        var icon = "Icon";

        var groups = new Array();

        if (groupCollection) {

            for (var i = 0; i < groupCollection.length; i++) {
                var group = groupCollection[i];

                var groupItem = new Object();

                groupItem.obj_id = group["obj_id"];
                groupItem.id = group[id];
                groupItem.name = group[name];
                groupItem.desc = group[desc];
                groupItem.blogQty = group[blogQty];
                groupItem.icon = group[icon];

                groups.push(groupItem);
            }
        }

        return groups;
    }

    var convertBlogs = function (blogCollection) {

        var id = "ID";
        var name = "Name";
        var abstract = "Abstract";
        var content = "Content";
        var image = "Image";
        var poster = "Poster";
        var posterName = "PosterName";
        var postTime = "PostTime";
        var commentQty = "CommentQty";
        var toGroup = "toGroup";

        var blogs = new Array();

        if (blogCollection) {

            for (var i = 0; i < blogCollection.length; i++) {
                var blog = blogCollection[i];

                var blogItem = new Object();

                blogItem.obj_id = blog["obj_id"];
                blogItem.id = blog[id];
                blogItem.name = blog[name];
                blogItem.abstract = blog[abstract];
                blogItem.content = blog[content];
                if (blog[image])
                {
                    blogItem.image = blog[image];
                }
                else
                {
                    blogItem.image = "styles/custom/blogs/superbox-full-5.jpg";
                }
                blogItem.toGroup = blog[toGroup];
                blogItem.poster = blog[poster];
                blogItem.posterName = blog[posterName];
                blogItem.postTime = blog[postTime].substring(0, 10);

                if (blog[commentQty])
                {
                    blogItem.commentQty = blog[commentQty];
                }
                else
                {
                    blogItem.commentQty = 0;
                }

                blogs.push(blogItem);
            }
        }

        return blogs;
    }

    var convertComments = function (commentCollection) {

        var id = "ID";
        var content = "Content";
        var poster = "Poster";
        var posterName = "PosterName";
        var postTime = "PostTime";

        var comments = new Array();

        if (commentCollection) {

            for (var i = 0; i < commentCollection.length; i++) {
                var comment = commentCollection[i];

                var commentItem = new Object();

                commentItem.obj_id = comment["obj_id"];
                commentItem.id = comment[id];
                commentItem.content = comment[content];
                commentItem.poster = comment[poster];
                commentItem.posterName = comment[posterName];
                commentItem.postTime = comment[postTime];

                comments.push(commentItem);
            }
        }

        return comments;
    }

    function getBlogGroups(dbschema, groupclass, pageIndex, callback) {
	    
	    var pageSize = 20;
	    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + groupclass + "?view=full&size=" + pageSize;
	    if (pageIndex) {
	        var from = pageIndex * pageSize;
	        url += "&from=" + from;
	    }

	    $http.get(url).success(function (data) {
	        callback(convertGroups(data));
				
		}).error(function(){
		    callback([]);

		});
    }

    function getPopularBlogs(dbschema, blogclass, callback) {

        var pageSize = 20;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + blogclass + "?size=" + pageSize + "&sortfield=CommentQty&sortreverse=true";

        $http.get(url).success(function (data) {
            callback(convertBlogs(data));

        }).error(function () {
            callback([]);

        });
    }

    function getMyBlogs(dbschema, blogclass, username, callback) {

        var pageSize = 50;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + blogclass + "?size=" + pageSize + "&filter=['Poster', '=', '" + username + "']";

        $http.get(url).success(function (data) {
 
            callback(convertBlogs(data));

        }).error(function () {
            callback([]);

        });
    }

    function getBlogByID(dbschema, blogclass, oid, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + blogclass + "/" + oid;

        $http.get(url).success(function (data) {
            if (data) {
                var array = new Array();
                array.push(data)
                array = convertBlogs(array);
                callback(array[0]);
            }
            else
            {
                callback(data);
            }

        }).error(function () {
            callback([]);

        });
    }

    function getGroupBlogs(dbschema, groupclass, groupId, blogClass, pageIndex, callback) {
        var pageSize = 20;
        var url;
        if (groupId) {
            url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + groupclass + "/" + groupId + "/" + blogClass + "?size=" + pageSize;
        }
        else
        {
            // get blogs withput group id
            url = APP_CONFIG.ebaasRootUrl + "/api/data/" + dbschema + "/" + blogClass + "?size=" + pageSize;
        }
        if (pageIndex) {
            var from = pageIndex * pageSize;
            url += "&from=" + from;
        }

        $http.get(url).success(function (data) {
            callback(convertBlogs(data));

        }).error(function () {
            callback([]);

        });
    }

    function searchBlogsWithKeywords(dbschema, blogclass, keywords, pageIndex, callback) {
        var pageSize = 20;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + blogclass + "?size=" + pageSize + "&filter=[\"Abstract\", \"contains\",\"" + encodeURIComponent(keywords) + "\"]";
        if (pageIndex) {
            var from = pageIndex * pageSize;
            url += "&from=" + from;
        }

        $http.get(url).success(function (data) {
            callback(convertBlogs(data));

        }).error(function () {
            callback([]);
        });
    }

    function getBlogComments(dbschema, blogclass, blogId, commentClass, pageIndex, callback) {
        var pageSize = 50;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + blogclass + "/" + blogId + "/" + commentClass + "?view=full&size=" + pageSize;
        if (pageIndex) {
            var from = pageIndex * pageSize;
            url += "&from=" + from;
        }

        $http.get(url).success(function (data) {
            callback(convertComments(data));

        }).error(function () {
            callback([]);

        });
    }

    function postBlogComment(dbschema, commentclass, blogPK, comment, callback) {
        var model = new Object();
        model.Poster = comment.poster;
        model.PostTime = comment.postTime;
        model.Content = comment.content;
        model.toBlog = blogPK;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + commentclass;

        $http.post(url, model)
            .success(function (data) {
                callback(data);
            })
            .error(function (err) {
            });
    }
	
	return {
	    getGroups: function (dbschema, groupclass, pageIndex, callback) {
	        getBlogGroups(dbschema, groupclass, pageIndex, callback);
	    },
	    getPopularBlogs: function (dbschema, blogclass, callback) {
	        getPopularBlogs(dbschema, blogclass, callback);
	    },
	    getMyBlogs: function (dbschema, blogclass, username, callback) {
	        getMyBlogs(dbschema, blogclass, username, callback);
	    },
	    searchBlogs: function (dbschema, blogclass, keywords, pageIndex, callback) {
	        searchBlogsWithKeywords(dbschema, blogclass, keywords, pageIndex, callback);
	    },
	    getBlog: function (dbschema, blogclass, oid, callback) {
	        getBlogByID(dbschema, blogclass, oid, callback);
	    },
	    getBlogs: function (dbschema, groupclass, groupId, blogClass, pageIndex, callback) {
	        getGroupBlogs(dbschema, groupclass, groupId, blogClass, pageIndex, callback);
	    },
	    getComments: function (dbschema, blogclass, blogId, commentClass, pageIndex, callback) {
	        getBlogComments(dbschema, blogclass, blogId, commentClass, pageIndex, callback);
	    },
	    postComment: function (dbschema, commentclass, blogPK, comment, callback) {
	        postBlogComment(dbschema, commentclass, blogPK, comment, callback);
	    }
	}
});