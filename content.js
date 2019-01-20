$.lazyTroll = {

    alreadyChecked: [],
    alreadyBlocked: [],
    profileKeywordKillList: [
        '#MAGA',
        '#2A',
        '#Trump2020',
        '#buildthewall',
        '#americafirst',
        'not a russian bot',
        'followed by ',
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

        'Shadow banned',
        'Shadowbanned',

        '#QAnon',
        '#FollowTheWhiteRabbit',
        '#QArmy',
        '#pizzagate',
        '#pedogate',

        'Proud Boy',
        'Pro-Free Speech',
        'gab.ai',
        '#RedPill',
        'ΜΟΛΩΝ ΛΑΒΕ',

        '#DemExit',
        '#McCarthyism',
        '#Tulsi2020',
        '#WalkAway',
    ],

    userNameKillList: [
        'Deplorable',
        '❌'
    ],

    checkUser: function(node) {
        let user_id = $(node).attr('data-user-id');
        if (!user_id) return true;
        if ($.lazyTroll.alreadyChecked.includes(user_id)) return true;
        if ($(node).attr('data-you-follow') === 'true') return true;
        if ($(node).attr('data-you-block') === 'true') return true;

        let username = $(node).attr('data-screen-name');

        // console.log('$.lazyTroll: applyThermotakensity' + " : " + username + " (" + user_id + ")");

        if ($.isNumeric(username.slice(-8))) {
            return $.lazyTroll.blockUser(node, user_id, username, 'username-is-numeric');
        }

        let profileImage = $(node).find('img.avatar').attr('src');
        if (profileImage.indexOf('default_profile_images') !== -1) {
            return $.lazyTroll.blockUser(node, user_id, username, 'default-profile-image');
        }

        return $.lazyTroll.checkProfile(node, user_id, username);
    },

    blockUser: function(node, user_id, username, reason) {
        // Make sure this isn't someone who got block for something else
        let youBlock = $(node).attr('data-you-block');
        if (youBlock === 'true') return true;

        if ($.lazyTroll.alreadyBlocked.includes(user_id)) return true;

        // one last check to make sure we're not accidentally
        // triggering a block on the wrong tweet
        if((username !== $(node).attr('data-screen-name')) ||
            (user_id !== $(node).attr('data-user-id'))) {
            return true;
        }

        console.log('blockUser ' + username + ': ' + reason);

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
        $.lazyTroll.alreadyBlocked.push(user_id);

        return false;
    },

    checkProfile: function(node, user_id, username) {
        // get the profile and then check it when the response comes back
        let url = 'https://twitter.com/i/profiles/popup?user_id=' + user_id;
        let allClear = true;
        // console.log('$.lazyTroll: checkProfile' + " : " + username + " (" + user_id + ")");

        $.getJSON(url, function (data) {
            let profileText = $(data['html']).find('p.bio').text().toLowerCase().trim();

            if (profileText) {
                if (profileText === '""') {
                }
                else $.lazyTroll.profileKeywordKillList.forEach(function (killText) {
                    if (profileText.indexOf(killText) !== -1) {
                        $.lazyTroll.blockUser(node, user_id, username, 'profileText "' + killText + '"');
                        allClear = false;
                    }
                });
            }
            // else {
            //     $.lazyTroll.blockUser(node, user_id, username, 'profileText is null');
            //     allClear = false;
            // }
        });

        if (allClear) {
            $.lazyTroll.alreadyChecked.push(user_id);
            return true;
        }
        else {
            return false;
        }
    },

    loadConfig: function() {
        console.log('$.lazyTroll: loadConfig');
        $.each($.lazyTroll.profileKeywordKillList, function(index, value) {
            $.lazyTroll.profileKeywordKillList[index] = $.trim(value.toLowerCase());
        });
        $.each($.lazyTroll.userNameKillList, function(index, value) {
            $.lazyTroll.userNameKillList[index] = $.trim(value.toLowerCase());
        });
    },

    processMutations: function(mutations) {
        // console.log('$.lazyTroll: processMutations');
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                $(node)
                    .find('div.tweet')
                    .each(function (i, tweet) {
                        $.lazyTroll.checkUser(tweet);
                    });
            });
        });
    },

    start: function() {
        console.log('$.lazyTroll: start');
        $.lazyTroll.loadConfig();

        $(document)
            .find('div.tweet')
            .each(function(i, node) {
                $.lazyTroll.checkUser(node);
            });

        $.lazyTroll.observer = new MutationObserver($.lazyTroll.processMutations)
            .observe(document.body, {
                subtree: true,
                childList: true,
            });
    },

    cleanup: function() {
        $.lazyTroll.observer.disconnect()
    }

};


$(document).ready(function () {
    $.lazyTroll.start();
});

$('body').bind('beforeunload',function(){
    $.lazyTroll.cleanup();
});
