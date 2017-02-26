/**
 * Created by jenniferbondarchuk on 2/25/17.
 */
(function () {
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
            let userLoginData = userData;
            initFb(function () {
                FB.api(
                    "/me/feed",
                    {
                        access_token: userLoginData.accessToken
                    },
                    function (response) {
                        if (response && !response.error) {
                            console.log(response)
                        }
                    });
            });
        })
    });
})();