/**
 * Created by jenniferbondarchuk on 2/25/17.
 */
(function () {
    "use strict";
    let accessToken;
    class User {
<<<<<<< HEAD
<<<<<<< HEAD
        constructor (userId) {
            this.id = userId;
        }
        init () {
            FB.api("/" + this.id,
=======
        constructor (userId) { //<---- CONSTRUCTOR
            this.id = userId;
        }
        async init () {
            await FB.api("/" + this.id,
>>>>>>> 098c0c030756919a12582103f1d6dc803c2b695b
=======
        constructor (userId) {
            this.id = userId;
        }
        init () {
            FB.api("/" + this.id,
>>>>>>> parent of 098c0c0... Please work this time!
                {
                    access_token: accessToken,
                    fields: "first_name,last_name,name,cover,picture"
                },
                (response) => {
<<<<<<< HEAD
                if (response && !response.error) {
                this.first_name = response.first_name;
                this.last_name = response.last_name;
                this.name = response.name;
                this.cover = response.cover.source;
                this.picture = response.picture.data.url;
                this.feed = new Feed(this.id);
                this.friends = [];
                if (response.friends) {
                    $.each(response.friends.data, (ignore, friend) => {
                        this.friends.push(new User(friend.id));
                });
                }
            } else {
                throw new Error("Error loading User " + this.id + ": " + JSON.stringify(response));
            }
        });
=======
                    if (response && !response.error) {
                        this.first_name = response.first_name;
                        this.last_name = response.last_name;
                        this.name = response.name;
                        this.cover = response.cover.source;
                        this.picture = response.picture.data.url;
                        this.feed = new Feed(this.id);
                    } else {
                        throw new Error("Error loading User " + this.id + ": " + JSON.stringify(response));
                    }
                });
>>>>>>> 098c0c030756919a12582103f1d6dc803c2b695b
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
<<<<<<< HEAD
                if (response && !response.error) {
                this.message = response.message;
                this.from = new User(response.from.id);
            } else {
                throw new Error("Error loading comment " + this.id + ": " + JSON.stringify(response));
            }
        });
=======
                    if (response && !response.error) {
                        this.message = response.message;
                        this.from = new User(response.from.id);
                    } else {
                        throw new Error("Error loading comment " + this.id + ": " + JSON.stringify(response));
                    }
                });
>>>>>>> 098c0c030756919a12582103f1d6dc803c2b695b
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
            this.story = "";
            FB.api("/" + this.id,
                {
                    access_token: accessToken,
<<<<<<< HEAD
<<<<<<< HEAD
                    fields: "comments,likes,message,attachments,story"
                },
                (response) => {
                console.log(response);
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
                this.message = response.message;
            } else {
                throw new Error("Error loading post " + this.id + ": " + JSON.stringify(response));
            }
        });
=======
                    fields: "comments,likes,message,attachments,story,created_time"
=======
                    fields: "comments,likes,message,attachments,story"
>>>>>>> parent of 098c0c0... Please work this time!
                },
                (response) => {
                console.log(response);
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
                        this.message = response.message;
                    } else {
                        throw new Error("Error loading post " + this.id + ": " + JSON.stringify(response));
                    }
                });
>>>>>>> 098c0c030756919a12582103f1d6dc803c2b695b
            return this;
        }
    }
    class Feed {
        constructor (userId) {
            this.userId = userId;
        };

        init() {
            this.posts = [];
            FB.api("/" + this.userId + "/feed",
                {
                    access_token: accessToken
                },
                (response) => {
<<<<<<< HEAD
                if (response && !response.error) {
                $.each(response.data, (ignore, post) => {
                    this.posts.push(new Post(post.id));
            });
                this.nextPostsCall = response.paging.next;
            } else {
                throw new Error("Invalid User ID " + this.userId + " passed to Feed Init" + ": " + JSON.stringify(response));
            }
        });
=======
                    if (response && !response.error) {
                        $.each(response.data, (ignore, post) => {
                            this.posts.push(new Post(post.id));
                        });
                        this.nextPostsCall = response.paging.next;
                    } else {
                        throw new Error("Invalid User ID " + this.userId + " passed to Feed Init" + ": " + JSON.stringify(response));
                    }
                });
>>>>>>> 098c0c030756919a12582103f1d6dc803c2b695b
            return this;
        }

        morePosts() {
            if (this.nextPostsCall) {
                $.getJSON(this.nextPostsCall, (response) => {
                    if (response && !response.error) {
<<<<<<< HEAD
                    $.each(response.data, (ignore, post) => {
                        this.posts.push(new Post(post.id));
                });
                    this.nextPostsCall = response.paging.next;
                } else {
                    throw new Error("Error while finding more Posts for user " + this.userId + ": " + JSON.stringify(response));
                }
            });
=======
                        $.each(response.data, (ignore, post) => {
                            this.posts.push(new Post(post.id));
                        });
                        this.nextPostsCall = response.paging.next;
                    } else {
                        throw new Error("Error while finding more Posts for user " + this.userId + ": " + JSON.stringify(response));
                    }
                });
>>>>>>> 098c0c030756919a12582103f1d6dc803c2b695b
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
            accessToken = userData.accessToken;
            initFb(function () {
                window.me = new User(userData.id);
                console.log(window.me);
                /*FB.api(
<<<<<<< HEAD
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
=======
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
>>>>>>> 098c0c030756919a12582103f1d6dc803c2b695b
            });
        })
    });
})();