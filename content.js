lazyTroll = {
    profileKeywordList: [],
    userNameKeywordList: [],
    blockDefaultProfileImage: true,
    blockScreenNameIsNumeric: true,
    blockProfileTextIsNull: false,
    minimumFollowers: 0,

    alreadyChecked: [],
    blockQueue: [],

    blockUser: function(node, userId, screenName, reason) {
        // Make sure this isn't someone who got blocked for something else
        let youBlock = $(node).attr('data-you-block');
        if (youBlock === 'true') return;

        // one last check to make sure we're not accidentally
        // triggering a block on the wrong tweet
        if((screenName !== $(node).attr('data-screen-name')) ||
            (userId !== $(node).attr('data-user-id'))) {
            return;
        }

        // Push a callback function onto the block queue
        lazyTroll.blockQueue.push(
            lazyTroll.clickBlockUserButton(node, userId, screenName, reason)
        );
    },

    clickBlockUserButton: function(node, userId, screenName, reason) {
        console.log('lazyTroll: blockUser ' + screenName + ' (' + userId + '): ' + reason);

        // Find the block button on the tweet and click it
        let blockButton = $(node)
            .find('li.block-link')
            .find('button.dropdown-link');

        if (!blockButton) {
            blockButton = $(node)
                .find("li.not-blocked");
        }
        blockButton.click();

        // Hide the modal popup and confirm the block
        $("body").removeClass("modal-enabled");
        $('div#block-dialog.block-dialog')
            .hide()
            .find('button.block-button')
            .click();

        // Destroy the tweet node in case it didn't get hidden
        node.remove();
    },

    checkProfile: function(node, userId, screenName) {
        let allClear = true;

        // Lightweight call for the profile text used for the hover
        let url = 'https://twitter.com/i/profiles/popup?user_id=' + userId;

        $.getJSON(url, function (data) {

            let followerCount = parseInt($(data['html'])
                .find('a[data-element-term="follower_stats"]')
                .find('span.ProfileCardStats-statValue')
                .attr('data-count'));

            if (followerCount && (followerCount < lazyTroll.minimumFollowers)) {
                lazyTroll.blockUser(node, userId, screenName, 'minimum-followers');
                return false;
            }

            let profileText = $(data['html']).find('p.bio').text().toLowerCase().trim();

            if (profileText) {
                if (lazyTroll.blockProfileTextIsNull && profileText === '""') {
                    lazyTroll.blockUser(node, userId, screenName, 'profile-text-is-null');
                    allClear = false;
                }
                else lazyTroll.profileKeywordList.forEach(function (keyword) {
                    if (profileText.indexOf(keyword) !== -1) {
                        lazyTroll.blockUser(node, userId, screenName, 'profileText "' + keyword + '"');
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

    checkUser: function(node) {
        let userId = $(node).attr('data-user-id');
        if (!userId) return;

        // Don't check profiles that have already been cleared
        if (lazyTroll.alreadyChecked.includes(userId)) return;

        // Don't check anyone you follow or have already blocked
        if ($(node).attr('data-you-follow') === 'true') return;
        if ($(node).attr('data-you-block') === 'true') return;

        let screenName = $(node).attr('data-screen-name');

        if (lazyTroll.blockScreenNameIsNumeric && $.isNumeric(screenName.slice(-8))) {
            lazyTroll.blockUser(node, userId, screenName, 'screen-name-is-numeric');
            return;
        }

        let profileImage = $(node).find('img.avatar').attr('src');
        if (lazyTroll.blockDefaultProfileImage && profileImage.indexOf('default_profile_images') !== -1) {
            lazyTroll.blockUser(node, userId, screenName, 'default-profile-image');
            return;
        }

        // User name has prohibited keywords/characters
        let userName = $(node).find('strong.fullname').text().toLowerCase().trim();
        let badUserName = false;
        lazyTroll.userNameKeywordList.forEach(function (keyword) {
            if (userName.indexOf(keyword) !== -1) {
                lazyTroll.blockUser(node, userId, screenName, 'userName "' + keyword + '"');
                badUserName = true;
            }
        });
        if (badUserName) return;

        // Profiles that pass the profile checks
        // won't be checked again
        if (lazyTroll.checkProfile(node, userId, screenName)) {
            lazyTroll.alreadyChecked.push(userId);
        }
    },

    processBlockQueue: function() {
        let callback = lazyTroll.blockQueue.pop();
        if (callback) callback();

        setTimeout(lazyTroll.processBlockQueue, 200);
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

    loadConfig: function() {
        chrome.storage.local.get({
            blockDefaultProfileImage: true,
            blockScreenNameIsNumeric: true,
            blockProfileTextIsNull: false,
            profileKeywordList: "",
            userNameKeywordList: "",
            minimumFollowers: 0
        }, function(items) {
            // Fairly straightforward true/false options
            lazyTroll.blockDefaultProfileImage = items.blockDefaultProfileImage;
            lazyTroll.blockScreenNameIsNumeric = items.blockScreenNameIsNumeric;
            lazyTroll.blockProfileTextIsNull = items.blockProfileTextIsNull;
            lazyTroll.minimumFollowers = items.minimumFollowers;

            // Keywords are forced to lower case and trimmed
            // Empty lines are ignored
            let profileKeywordKillList = items.profileKeywordList.split('\n');
            let userNameKeywordKillList = items.userNameKeywordList.split('\n');

            profileKeywordKillList.forEach(function(value) {
                let keyword = $.trim(value.toLowerCase());
                if (keyword !== "") {
                    lazyTroll.profileKeywordList.push(keyword);
                }
            });
            userNameKeywordKillList.forEach(function(value) {
                let keyword = $.trim(value.toLowerCase());
                if (keyword !== "") {
                    lazyTroll.userNameKeywordList.push(keyword);
                }
            });


        });
    },

    start: function() {
        console.log('lazyTroll: start');
        lazyTroll.loadConfig();

        // Do a first pass on the existing page
        lazyTroll.checkForTweets(document);

        // Setup an observer for
        lazyTroll.observer = new MutationObserver(lazyTroll.processMutations)
            .observe(document.body, {
                subtree: true,
                childList: true,
            });

        // Start checking the block queue
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
