/**
 * Created by jenniferbondarchuk on 2/25/17.
 */

/**
 * Cam's Intro to JS Classes and my structure
 *
 * Javascript classes are pretty simple - they have a constructor (marked below) which is called by executing "new <type>()"
 * So to make a user it would be "let newUser = new User(userid);"
 *
 * All of the classes I wrote have the "init" method which populates all of the properties of the object.
 * Rather than initializing all of them you must call the "init" method to populate the fields
 *
 * Init has one parameter - the function to be called after it is done (Anything that depends on those fields being
 * initialized should be put in the callback function rather than in line after the call to init.
 *
 * I have assigned the "window.me" variable to the current user so you can use that to access any of it's information or do anything with it.
 * You should be able to include this file in any of the .html files the same way it is included in index.html and it should work.
 *
 * Example usage:
 *  Print a User's Friends to the console:
 *      Window.me.init((me) => {
 *           $.each(me.friends, (index, friend) => {
 *                  friend.init(() => {console.log(friend);});
 *           });
 *       });
 */
(function () {
    "use strict";
    let accessToken;
    let initializedObjects = {};
    /**
     * User Properties:
     * id: The userID for the API
     * first_name: First Name
     * last_name: Last Name
     * name: first name and last name
     * cover: Link to cover photo
     * picture: Link to profile picture
     * feed: Feed object for the user's facebook feed (need to call init() before using)
     * friends: array of User objects, each one needs to call init() to start using it
     */
    class User {
        constructor (userId) { //<---- CONSTRUCTOR
            this.id = userId;
        }
        init (callback) {
            FB.api("/" + this.id,
                {
                    access_token: accessToken,
                    fields: "first_name,last_name,name,cover,picture,friends"
                },
                (response) => {
                    if (response && !response.error) {
                        this.first_name = response.first_name;
                        this.last_name = response.last_name;
                        this.name = response.name;
                        this.cover = response.conver ? response.cover.source : undefined;
                        this.picture = response.picture.data.url;
                        this.feed = new Feed(this.id);
                        this.friends = [];
                        if (response.friends) {
                            $.each(response.friends.data, (ignore, friend) => {
                                this.friends.push(new User(friend.id));
                            });
                        }
                        typeof callback !== "undefined" ? callback(this) : null;
                    } /*else {
                        throw new Error("Error loading User " + this.id + ": " + JSON.stringify(response));
                    }*/
                });
            return this;
        }
    }
    /**
     * Comment Class Attributes:
     * id: the comment ID for the API
     * message: the text of the comment
     * from: User the message came from, needs to be initialized before using
     * timestamp: The time the comment was posted
     */
    class Comment {
        constructor (commentId) {
            this.id = commentId;
        }
        init (callback) {
            this.from = null;
            this.message = "";
            FB.api("/" + this.id,
                {
                    access_token: accessToken,
                    fields: "message,from,created_time"
                },
                (response) => {
                    if (response && !response.error) {
                        this.message = response.message;
                        this.from = new User(response.from.id);
                        this.timestamp = response.created_time;
                        callback(this);
                    } else {
                        throw new Error("Error loading comment " + this.id + ": " + JSON.stringify(response));
                    }
                });
            return this;
        }
    }
    /**
     * Post class Attributes:
     * id: the post ID for the API
     * comments: Array of comment objects, each one needs to be initialized to use
     * likes: Array of users who like the post, each one needs to be initialzed to use
     * message: The message of the Post
     * story: The "story" (automated wall posts) text
     * image: Link to attached image of post
     * timestamp: The time the post was created
     */
    class Post {
        constructor (postId) {
            this.id = postId;
        }

        init (callback) {
            this.comments = [];
            this.likes = [];
            this.message = "";
            this.story = "";
            FB.api("/" + this.id,
                {
                    access_token: accessToken,
                    fields: "comments,likes,message,attachments,story,created_time,from"
                },
                (response) => {
                    if (response && !response.error) {
                        if (response.comments) {
                            $.each(response.comments.data, (ignore, comment) => {
                                this.comments.push(new Comment(comment.id));
                            });
                        }
                        if (response.likes) {
                            $.each(response.likes.data, (ignore, like) => {
                                this.likes.push(new User(like.id));
                            });
                        }
                        if (response.attachments && response.attachments.data[0].media.image.src) {
                            this.image = response.attachments.data[0].media.image.src;
                        }
                        if (response.story) {
                            this.story = response.story;
                        }
                        if (response.from) {
                            this.from = new User(response.from.id);
                        }
                        this.timestamp = response.created_time;
                        this.message = response.message;
                        callback(this);
                    } else {
                        throw new Error("Error loading post " + this.id + ": " + JSON.stringify(response));
                    }
                });
            return this;
        }
    }
    /**
     * Feed Class Properties:
     * userId: The ID of the User who this feed belongs to
     * nextPostsCall: the URL to call to get more posts
     * posts: An array of posts that each need to be initialized before using
     * Methods:
     * morePosts: Gets more posts and adds them to the posts array
     */
    class Feed {
        constructor (userId) {
            this.userId = userId;
        };

        init(callback) {
            this.posts = [];
            FB.api("/" + this.userId + "/feed",
                {
                    access_token: accessToken
                },
                (response) => {
                    if (response && !response.error) {
                        $.each(response.data, (ignore, post) => {
                            this.posts.push(new Post(post.id));
                        });
                        this.nextPostsCall = response.paging.next;
                        callback(this);
                    } else {
                        throw new Error("Invalid User ID " + this.userId + " passed to Feed Init" + ": " + JSON.stringify(response));
                    }
                });
            return this;
        }
        morePosts(callback) {
            if (this.nextPostsCall) {
                $.getJSON(this.nextPostsCall, (response) => {
                    if (response && !response.error) {
                        $.each(response.data, (ignore, post) => {
                            this.posts.push(new Post(post.id));
                        });
                        this.nextPostsCall = response.paging.next;
                        callback(this);
                    } else {
                        throw new Error("Error while finding more Posts for user " + this.userId + ": " + JSON.stringify(response));
                    }
                });
            } else {
                throw new Error("Called for more posts when Feed has not been initialized");
            }
            return this;
        }
    }

    const postsDiv = $("#newsfeedPosts");
    function showPost(post) {
        post.init((post) => {
            const postDiv = $(document.createElement("div")).addClass("row center");
            const innerDiv = $(document.createElement("div")).addClass("col-sm-offset-3 col-sm-6 well").prop("align", "left");
            postDiv.append(innerDiv);
            if (post.image) {
                const imageDiv = $(document.createElement("div")).addClass("il").prop("vertical-align", "top");
                imageDiv.append($(document.createElement("img")).prop("src", post.image).prop("width", "84px").prop("height", "84px"));
                innerDiv.append(imageDiv);
                postDiv.append(imageDiv);
            }
            const userDiv = $(document.createElement("div")).addClass("il").prop("vertical-align", "bottom");
            const nameDiv = $(document.createElement("p")).addClass("name");
            userDiv.append(nameDiv);
            post.from.init((user) => {
                nameDiv.append(user.name);
            });
            userDiv.append($(document.createElement("div")).addClass("time").append(post.timestamp));
            postDiv.append(userDiv);
            postDiv.append($(document.createElement("br")));
            postDiv.append($(document.createElement("div")).append($(document.createElement("h3")).append(post.message)));
            const buttonsDiv = $(document.createElement("div"));
            buttonsDiv.append($(document.createElement("button")).prop("type", "button").addClass("btn btn-default")).append("Like");
            buttonsDiv.append($(document.createElement("button")).prop("type", "button").addClass("btn btn-default")).append("Comment");
            postDiv.append(buttonsDiv);
            postsDiv.append(postDiv);
            console.log(postDiv);
        });
    }
    $(document).ready(function () {
        function initFb(callback) {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '217184532019801',
                    xfbml: true,
                    version: 'v2.8'
                });
                FB.AppEvents.logPageView();
                callback();
            };

            (function (d, s, id) {
                let js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

        $.getJSON("/me").done(function (userData, resObject) {
            accessToken = userData.accessToken;
            initFb(function () {
                window.me = new User(userData.id);
                window.me.init((me) => {
                    me.feed.init((feed) => {
                        $.each(feed.posts, (index, post) => {
                            showPost(post);
                        });
                    });
                });
                /*FB.api(
                    "/me/feed",
                    {
                        access_token: userLoginData.accessToken
                    },
                    function (response) {
                        if (response && !response.error) {
                            console.log(response)
                        }
                        $.each(response.data, (index, item) => {
                            console.log(item);
                            FB.api("/" + item.id + "/attachments", {access_token: userLoginData.accessToken/!*, fields: "id,admin_creator,application,call_to_action,caption,description,message,name,icon,from"*!/}, (response) => {
                                console.log(response);
                            });
                        });
                    });*/
            });
        })
    });
})();