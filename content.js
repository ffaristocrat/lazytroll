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

        '#QAnon',
        '#FollowTheWhiteRabbit',
        '#QArmy',
        '#pizzagate',
        '#pedogate',

        'Proud Boy',
        'Pro-Free Speech',
        'gab.ai',
        '#RedPill',

        '#DemExit',
        '#McCarthyism',
        '#Tulsi2020',
        '#WalkAway',
    ],

    checkUser: function(node) {
        let username = $(node).attr('data-screen-name');
        let user_id = $(node).attr('data-user-id');

        if (!user_id) return true;
        if ($.lazyTroll.alreadyChecked.includes(user_id)) return true;
        if ($(node).attr('data-you-follow') === 'true') return true;
        if ($(node).attr('data-you-block') === 'true') return true;

        if ($.isNumeric(username.slice(-8))) {
            $.lazyTroll.blockUser(node, user_id, username, 'username-is-numeric');
            return true;
        }

        let profileImage = $(node).find('img.avatar').attr('src');
        if (profileImage === 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png') {
            $.lazyTroll.blockUser(node, user_id, username, 'default-profile-image');
            return true;
        }

        $.lazyTroll.checkProfile(node, user_id, username);

        return true;
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

    },

    checkProfile: function(node, user_id, username) {
        // get the profile and then check it when the response comes back
        let url = 'https://twitter.com/i/profiles/popup?user_id=' + user_id;
        let allClear = true;

        $.getJSON(url, function (data) {

            let profileText = $(data['html']).find('p.bio').text().toLowerCase();

            if (profileText) {
                profileText = profileText.toLowerCase();
                $.lazyTroll.profileKeywordKillList.forEach(function (killText) {
                    if (profileText.indexOf(killText) !== -1) {
                        $.lazyTroll.blockUser(node, user_id, username, 'profileText ' + killText);
                        allClear = false;
                        return false;
                    }
                })
            }
        });

        if (allClear) $.lazyTroll.alreadyChecked.push(user_id);
    },

    loadConfig: function() {
        $.each($.lazyTroll.profileKeywordKillList, function( index, value ) {
            $.lazyTroll.profileKeywordKillList[index] = $.trim(value.toLowerCase());
        });
    },

    start: function() {
        $.lazyTroll.loadConfig();

        function processTweets(mutations) {
            mutations.forEach(function(mutation) {
                $(mutation)
                    .find('div.tweet')
                    .each(function(i, node) {
                        $.lazyTroll.checkUser(node);
                    });
            });
        }

        processTweets();
        new MutationObserver(processTweets)
            .observe(document.body, {
                subtree: true,
                childList: true,
            });
    }
};

$(document).ready(function () {
    $.lazyTroll.start();
});
