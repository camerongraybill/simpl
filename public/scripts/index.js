/**
 * Created by jenniferbondarchuk on 2/25/17.
 */
(function () {
    "use strict";
    let accessToken;
    class User {
        constructor (userId) {
            this.id = userId;
        }
        init () {
            FB.api("/" + this.id,
                {
                    access_token: accessToken,
                    fields: "first_name,last_name,name"
                },
                (response) => {
                    if (response && !response.error) {
                        this.first_name = response.first_name;
                        this.last_name = response.last_name;
                        this.name = response.name;
                        this.feed = new Feed(this.id);
                    } else {
                        throw new Error("Error loading User " + this.id);
                    }
                });
            return this;
        }
    }
    class Comment {
        constructor (commentId) {
            this.id = commentId;
        }
        init () {
            this.from = null;
            this.message = "";
            FB.api("/" + this.id,
                {
                    access_token: accessToken
                },
                (response) => {
                    if (response && !response.error) {
                        this.message = response.message;
                        this.from = new User(response.from.id);
                    } else {
                        throw new Error("Error loading comment " + this.id);
                    }
                });
            return this;
        }
    }
    class Post {
        constructor (postId) {
            this.id = postId;
        }

        init () {
            this.comments = [];
            this.likes = [];
            this.message = "";
            FB.api("/" + this.id,
                {
                    access_token: accessToken,
                    fields: "comments,likes,message"
                },
                (response) => {
                    if (response && !response.error) {
                        $.each(response.comments.data, (ignore, comment) => {
                            this.comments.push(new Comment(comment.id));
                        });
                        $.each(response.likes.data, (ignore, like) => {
                            this.likes.push(new User(like.id));
                        });
                        this.message = response.message;
                    } else {
                        throw new Error("Error loading post " + this.id);
                    }
                });
            return this;
        }
    }
    class Feed {
        constructor (userId) {
            this.userId = userId;
        };

        init() {
            this.posts = [];
            this.nextCall = "";
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
                    } else {
                        throw new Error("Invalid User ID " + this.userId + " passed to Feed Init");
                    }
                });
            return this;
        }

        morePosts() {
            if (this.nextPostsCall) {
                $.getJSON(this.nextPostsCall, (response) => {
                    if (response && !response.error) {
                        $.each(response.data, (ignore, post) => {
                            this.posts.push(new Post(post.id));
                        });
                        this.nextPostsCall = response.paging.next;
                    } else {
                        throw new Error("Error while finding more Posts for user " + this.userId);
                    }
                });
            } else {
                throw new Error("Called for more posts when Feed has not been initialized");
            }
            return this;
        }
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
            window.userLoginData = userData;
            initFb(function () {
                window.me = new User(userData.id);
                console.log(window.me);
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