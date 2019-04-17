lazyTroll = {
    profileKeywordKillList: [],
    userNameKeywordKillList: [],
    blockDefaultProfileImage: true,
    blockScreenNameIsNumeric: true,
    blockProfileTextIsNull: false,

    alreadyChecked: [],
    blockQueue: [],

    checkUser: function(node) {
        let userId = $(node).attr('data-user-id');
        if (!userId) return true;
        if (lazyTroll.alreadyChecked.includes(userId)) return true;
        if ($(node).attr('data-you-follow') === 'true') return true;
        if ($(node).attr('data-you-block') === 'true') return true;

        let screenName = $(node).attr('data-screen-name');

        // console.log('lazyTroll: ' + " : " + screenName + " (" + userId + ")");

        if (lazyTroll.blockScreenNameIsNumeric && $.isNumeric(screenName.slice(-8))) {
            return lazyTroll.blockUser(node, userId, screenName, 'screen-name-is-numeric');
        }

        let profileImage = $(node).find('img.avatar').attr('src');
        if (lazyTroll.blockDefaultProfileImage && profileImage.indexOf('default_profile_images') !== -1) {
            return lazyTroll.blockUser(node, userId, screenName, 'default-profile-image');
        }

        if (lazyTroll.checkProfile(node, userId, screenName)){
            lazyTroll.alreadyChecked.push(userId);
        }
    },

    blockUser: function(node, userId, screenName, reason) {

        lazyTroll.blockQueue.push(function () {
            // Make sure this isn't someone who got blocked for something else
            let youBlock = $(node).attr('data-you-block');
            if (youBlock === 'true') return true;

            // one last check to make sure we're not accidentally
            // triggering a block on the wrong tweet
            if((screenName !== $(node).attr('data-screen-name')) ||
                (userId !== $(node).attr('data-user-id'))) {
                return true;
            }

            console.log('lazyTroll: blockUser ' + screenName + ': ' + reason);

            let blockButton = $(node)
                .find('li.block-link')
                .find('button.dropdown-link');

            if (!blockButton) {
                blockButton = $(node)
                    .find("li.not-blocked");
            }
            blockButton.click();

            $("body").removeClass("modal-enabled");
            $('div#block-dialog.block-dialog')
                .hide()
                .find('button.block-button')
                .click();

            return false;
        });
    },

    checkProfile: function(node, userId, screenName) {
        // Assume they'll pass
        let allClear = true;

        // get the profile and then check it when the response comes back
        let url = 'https://twitter.com/i/profiles/popup?user_id=' + userId;

        $.getJSON(url, function (data) {
            let profileText = $(data['html']).find('p.bio').text().toLowerCase().trim();

            if (profileText) {
                if (lazyTroll.blockProfileTextIsNull && profileText === '""') {
                    lazyTroll.blockUser(node, userId, screenName, 'profile-text-is-null');
                    allClear = false;
                }
                else lazyTroll.profileKeywordKillList.forEach(function (killText) {
                    if (profileText.indexOf(killText) !== -1) {
                        lazyTroll.blockUser(node, userId, screenName, 'profileText "' + killText + '"');
                        allClear = false;
                    }
                });
            }
            else if (lazyTroll.blockProfileTextIsNull) {
                lazyTroll.blockUser(node, userId, screenName, 'profile-text-is-null');
                allClear = false;
            }
        });

        return allClear;
    },

    loadConfig: function() {
        chrome.storage.local.get({
            blockDefaultProfileImage: true,
            blockScreenNameIsNumeric: true,
            blockProfileTextIsNull: false,
            profileKeywordKillList: "",
            userNameCharacterKillList: ""
        }, function(items) {
            let profileKeywordKillList = items.profileKeywordKillList.split('\n');
            let userNameKeywordKillList = items.userNameCharacterKillList.split('\n');

            profileKeywordKillList.forEach(function(value) {
                let keyword = $.trim(value.toLowerCase());
                if (keyword !== "") {
                    lazyTroll.profileKeywordKillList.appendItem();
                }
            });
            userNameKeywordKillList.forEach(function(value) {
                let keyword = $.trim(value.toLowerCase());
                if (keyword !== "") {
                    lazyTroll.userNameKeywordKillList.appendItem();
                }
            });
            lazyTroll.blockDefaultProfileImage = items.blockDefaultProfileImage;
            lazyTroll.blockScreenNameIsNumeric = items.blockScreenNameIsNumeric;
            lazyTroll.blockProfileTextIsNull = items.blockProfileTextIsNull;

        });
    },

    processMutations: function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                lazyTroll.checkForTweets(node);
            });
        });
    },

    checkForTweets: function(node) {
        $(node)
            .find('div.tweet')
            .each(function (i, tweet) {
                lazyTroll.checkUser(tweet);
            });
    },

    processBlockQueue: function() {
        let callback = lazyTroll.blockQueue.pop();
        if (callback) callback();

        setTimeout(lazyTroll.processBlockQueue, 200);

    },

    start: function() {
        console.log('lazyTroll: start');
        lazyTroll.loadConfig();

        lazyTroll.checkForTweets(document);

        lazyTroll.observer = new MutationObserver(lazyTroll.processMutations)
            .observe(document.body, {
                subtree: true,
                childList: true,
            });

        setTimeout(lazyTroll.processBlockQueue, 200);
    },

    cleanup: function() {
        lazyTroll.observer.disconnect()
    }

};

$(document).ready(function () {
    lazyTroll.start();
});

$('body').bind('beforeunload',function(){
    lazyTroll.cleanup();
});
