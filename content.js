lazyTroll = {
    alreadyChecked: [],
    alreadyBlocked: [],
    profileKeywordKillListDefaults: [
        '#MAGA',
        '#2A',
        '#Trump2020',
        '#buildthewall',
        '#americafirst',
        'not a russian bot',
        'followed by',
        '#LiberalismIsAMentalDisorder',
        'Constitutional Originalist',
        'Constitutional conservative',
        'proud conservative',
        '#TrumpTrain',
        '#DrainTheSwamp',
        '#SecureOurBorders',
        '#ProtectOurCitizens',
        '#IProtectOurCommunity',
        '#ConcealCarryPermit',
        '#NRA Member',
        'trump supporter',
        'lifetime NRA',

        'Shadow banned',
        'Shadowbanned',

        '#QAnon',
        '#FollowTheWhiteRabbit',
        '#QArmy',
        '#pizzagate',
        '#pedogate',

        'Proud Boy',
        'Pro-Free Speech',
        'Pro Free Speech',
        'gab.ai',
        '#RedPill',
        'ΜΟΛΩΝ ΛΑΒΕ',

        '#DemExit',
        '#McCarthyism',
        '#Tulsi2020',
        '#WalkAway',

        '#Bernie2020',
        'Sanders 2020 supporter',
        'Sanders supporter',
    ],

    userNameKeywordKillListDefaults: [
        'Deplorable',
        '❌'
    ],

    profileKeywordKillList: [],
    userNameKeywordKillList: [],
    blockDefaultProfileImage: true,
    blockScreenNameIsNumeric: true,
    blockProfileTextIsNull: false,

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

        return lazyTroll.checkProfile(node, userId, screenName);
    },

    blockUser: function(node, userId, screenName, reason) {
        // Make sure this isn't someone who got blocked for something else
        let youBlock = $(node).attr('data-you-block');
        if (youBlock === 'true') return true;

        if (lazyTroll.alreadyBlocked.includes(userId)) return true;

        // one last check to make sure we're not accidentally
        // triggering a block on the wrong tweet
        if((screenName !== $(node).attr('data-screen-name')) ||
            (userId !== $(node).attr('data-user-id'))) {
            return true;
        }

        console.log('blockUser ' + screenName + ': ' + reason);

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

        chrome.runtime.sendMessage({
            type: "lazyTroll.blockUser",
            session: window.location.search.substr(1),
            screen_name: screenName,
        });

        lazyTroll.alreadyBlocked.push(userId);

        return false;
    },

    checkProfile: function(node, userId, screenName) {
        // get the profile and then check it when the response comes back
        let url = 'https://twitter.com/i/profiles/popup?user_id=' + userId;
        let allClear = true;
        // console.log('lazyTroll: checkProfile' + " : " + screenName + " (" + userId + ")");

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

        if (allClear) {
            lazyTroll.alreadyChecked.push(userId);
            return true;
        }
        else {
            return false;
        }
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

    start: function() {
        console.log('lazyTroll: start');
        lazyTroll.loadConfig();

        lazyTroll.checkForTweets(document);

        lazyTroll.observer = new MutationObserver(lazyTroll.processMutations)
            .observe(document.body, {
                subtree: true,
                childList: true,
            });
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
