let lazyTroll = {
    profileKeywordList: [],
    userNameKeywordList: [],
    blockDefaultProfileImage: true,
    blockScreenNameEndsWith8Numbers: true,
    blockProfileTextIsNull: false,
    blockVerifiedBlue: true,
    blockNFTProfile: false,
    blockTheRealScreenName: false,
    blockPromoters: false,
    doNotBlockFollowers: true,
    doNotBlockOrganizations: true,
    doNotBlockGovernment: true,
    doNotBlockAffiliates: true,
    doNotBlockLegacy: true,
    minimumFollowers: 0,

    alreadyChecked: [],
    blocked: [],
    blockQueue: [],
    whiteList: ["diebotdie", "beyounce"],
    verifiedWhiteList: [],

    blockTimeout: 500,
    theRealRegex: /^(Real|The)[A-Z]*/,

    blockUser: function(tweet, userId, screenName, reason) {
        // Make sure this isn't someone who got blocked for something else
        let youBlock = false; // $(tweet).attr("data-you-block") === "true";

        // Skip users we've already queued blocks for
        if (youBlock || lazyTroll.blocked.includes(screenName)) return;

        // One last check to make sure we're not accidentally
        // triggering a block on the wrong tweet
        let tweetScreenName = $(tweet)
            .find("div[data-testid='User-Name']")
            .find("a[role='link'][href^='/']")
            .attr("href");
        if(tweetScreenName && (screenName.toLowerCase() !== tweetScreenName.slice(1).toLowerCase())) {
            console.log("Mismatch between " + screenName + " vs " + tweetScreenName);
            return;
        }

        // Push a callback function onto the block queue
        lazyTroll.blockQueue.push(
            function () {lazyTroll.clickBlockUserButton(tweet, userId, screenName, reason)}
        );

        // Start processing the queue if it *was* empty
        if (lazyTroll.blockQueue.length === 1) {
            setTimeout(lazyTroll.processBlockQueue, lazyTroll.blockTimeout);
        }

        lazyTroll.blocked.push(screenName);
    },

    clickBlockUserButton: function(tweet, userId, screenName, reason) {
        console.log("lazyTroll: blockUser " + screenName + " : " + reason);

        try {
            // Click the caret to pop up the menu
            $(tweet)
                .find("div[data-testid='caret']")
                .click();

            // Find menu that pops up independent of the tweet and click it
            $("body")
                .find("div[role='menu']")
                .find("div[role='menuitem'][data-testid='block']")
                .click();

            // Hide the modal popup and confirm the block
            $("div[role='alertdialog']")
                .hide()
                .find("div[data-testid='confirmationSheetConfirm']")
                .click();
        }
        catch {
            console.log("lazyTroll: Click block button failed");
        }
        finally {
            // Destroy the tweet node in case it didn't get hidden
            tweet.remove();
        }
    },

    checkProfile: function(tweet, userId, screenName) {
        let allClear = true;

        // Lightweight call for the profile text used for the hover
        let url = 'https://twitter.com/i/profiles/popup?user_id=' + userId;

        $.get(url, function (data) {
            let followerCount = parseInt($(data).find("a[href$='/followers/']").attr("title").replace(",", ""));

            if (followerCount && (followerCount < lazyTroll.minimumFollowers)) {
                lazyTroll.blockUser(tweet, userId, screenName, "minimum-followers");
                return false;
            }

            let profileText = $(data)
                .find("div[dir='auto'][data-testid='UserDescription']")
                .description
                .toLowerCase()
                .trim();

            if (profileText) {
                if (lazyTroll.blockProfileTextIsNull && profileText === "''") {
                    lazyTroll.blockUser(tweet, userId, screenName, "profile-text-is-null");
                    allClear = false;
                }
                else lazyTroll.profileKeywordList.forEach(function (keyword) {
                    if (profileText.indexOf(keyword) !== -1) {
                        lazyTroll.blockUser(tweet, userId, screenName, 'profileText "' + keyword + '"');
                        allClear = false;
                    }
                });
            }
            else if (lazyTroll.blockProfileTextIsNull) {
                lazyTroll.blockUser(tweet, userId, screenName, "profile-text-is-null");
                allClear = false;
            }
        });

        return allClear;
    },

    checkUser: function(tweet) {
        // extract the node containing the user name, screen name and any marks
        let nameNode = $(tweet).find("div[data-testid='User-Name']").first();

        // screen name is the handle in the @ and URL
        let screenName = $(nameNode).find("a[role='link'][href^='/']").attr("href").slice(1);
        if (!screenName) return;

        // Don"t check profiles that have already been cleared or marked for blocking
        if (
            lazyTroll.alreadyChecked.includes(screenName) ||
            lazyTroll.blocked.includes(screenName) ||
            lazyTroll.whiteList.includes(screenName.toLowerCase())
        ) return;

        // User name is the display name
        let userName = $(nameNode).find("a[role='link'][href^='/']").text().trim();

        let avatar = $(tweet)
            .find("div[data-testid='Tweet-User-Avatar']")
            .first();
        let defaultProfileImage = avatar
            .find("img[dragging='true'][src*='default_profile']")
            .length > 0;
        let NFTProfile = avatar
            .find("img[dragging='true'][alt='Hexagon profile picture']")
            .length > 0;
        let promoter = $(tweet)
            .find("div[data-testid='promotedIndicator']")
            .length > 0;
        let youFollow = false; // $(tweet).attr("data-you-follow") === "true";
        let youBlock = false; // $(tweet).attr("data-you-block") === "true";
        let followsYou = false; // $(tweet).attr("data-follows-you") === "true";

        let verifiedIcon = $(nameNode).find("svg[data-testid='icon-verified']")
        // Twitter Blue subscribers & organizations are the only ones with checkmarks now
        let verifiedBlue = verifiedIcon.length > 0;
        // organization logos have color gradients
        let organization = verifiedIcon.first().find("linearGradient").length > 0;
        // government logos have a grey color fill
        let government = verifiedIcon.first().find("path[fill='#829aab']").length > 0;
        // affiliate logos are any images after the verified icon
        let affiliate = verifiedBlue && (verifiedIcon.parent().first().children().length >= 2);

        let legacy = lazyTroll.verifiedWhiteList.includes(screenName);
        let screenNameEndsWith8Numbers = $.isNumeric(screenName.slice(-8));
        let theRealScreenName = lazyTroll.theRealRegex.test(screenName);

        let userId = 0;

        console.log("lazyTroll: checkUser " + screenName +
            ", verifiedBlue: " + verifiedBlue +
            ", legacy: " + legacy +
            ", organization: " + organization +
            ", government: " + government +
            ", affiliate: " + affiliate +
            ", NFTProfile: " + NFTProfile +
            ", screenNameEndsWith8Numbers: " + screenNameEndsWith8Numbers +
            ", theRealScreenName: " + theRealScreenName +
            ", promoter: " + promoter +
            // " youFollow: " + youFollow +
            // " youBlock: " + youBlock +
            // " followsYou: " + followsYou +
            ", defaultProfileImage: " + defaultProfileImage
        );

        // Block users posting promoted tweets
        if (lazyTroll.blockPromoters && promoter) {
            lazyTroll.blockUser(tweet, userId, screenName, "promoted-tweet");
            return;
        }

        if (
            youBlock
            || youFollow
            || (lazyTroll.doNotBlockFollowers && followsYou)
            || (lazyTroll.doNotBlockOrganizations && organization)
            || (lazyTroll.doNotBlockGovernment && government)
            || (lazyTroll.doNotBlockAffiliates && affiliate)
            || (lazyTroll.doNotBlockLegacy && legacy)
        ) {
            lazyTroll.alreadyChecked.push(screenName);
            return;
        }

        // Block if profile picture is an NFT
        if (lazyTroll.blockNFTProfile && NFTProfile) {
            lazyTroll.blockUser(tweet, userId, screenName, "profile-image-is-nft");
            return;
        }
        // Block if Twitter Blue subscriber
        if (lazyTroll.blockVerifiedBlue && verifiedBlue) {
            lazyTroll.blockUser(tweet, userId, screenName, "twitter-blue-subscriber");
            return;
        }
        // Block if last 8 characters of screen name are numeric
        if (lazyTroll.blockScreenNameEndsWith8Numbers && screenNameEndsWith8Numbers) {
            lazyTroll.blockUser(tweet, userId, screenName, "screen-name-ends-with-8-numbers");
            return;
        }
        // Block eggs
        if (lazyTroll.blockDefaultProfileImage && defaultProfileImage) {
            lazyTroll.blockUser(tweet, userId, screenName, "default-profile-image");
            return;
        }
        // Block screen names starting with The or Real
        if (lazyTroll.blockTheRealScreenName && theRealScreenName) {
            lazyTroll.blockUser(tweet, userId, screenName, "screen-name-starts-with-the-or-real");
            return;
        }

        // Username has prohibited keywords
        let badUserNameKeyword = '';
        lazyTroll.userNameKeywordList.forEach(function (keyword) {
            if (userName.indexOf(keyword) !== -1) {
                badUserNameKeyword = keyword;
            }
        });
        if (badUserNameKeyword !== '') {
            lazyTroll.blockUser(tweet, userId, screenName, "userName '" + badUserNameKeyword + "'")
            return;
        }

        lazyTroll.alreadyChecked.push(screenName);
        // Profiles that pass the profile checks
        // won't be checked again
        // if (lazyTroll.checkProfile(tweet, userId, screenName)) {
        //     lazyTroll.alreadyChecked.push(screenName);
        // }
    },

    processBlockQueue: function() {
        // Space out block actions or else some won't get triggered
        let callback = lazyTroll.blockQueue.shift();
        if (callback) callback();

        if (lazyTroll.blockQueue.length > 0) {
            window.setTimeout(lazyTroll.processBlockQueue, lazyTroll.blockTimeout);
        }
    },

    processMutations: function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                lazyTroll.checkForTweets(node);
            });
        });
    },

    checkForTweets: function(node) {
        if (!node) return;
        $(node)
            .find("article[data-testid='tweet']")
            .each(function (i, tweet) {
                lazyTroll.checkUser(tweet);
            });
    },

    loadConfig: function() {
        chrome.storage.local.get({
            blockDefaultProfileImage: true,
            blockScreenNameEndsWith8Numbers: true,
            blockProfileTextIsNull: false,
            blockVerifiedBlue: true,
            blockNFTProfile: true,
            blockTheRealScreenName: false,
            blockPromoters: false,
            doNotBlockFollowers: true,
            doNotBlockAffiliates: true,
            doNotBlockOrganizations: true,
            doNotBlockGovernment: true,
            doNotBlockLegacy: true,
            profileKeywordList: "",
            userNameKeywordList: "",
            minimumFollowers: 0
        }, function(items) {
            // Fairly straightforward true/false options
            lazyTroll.blockDefaultProfileImage = items.blockDefaultProfileImage;
            lazyTroll.blockScreenNameEndsWith8Numbers = items.blockScreenNameEndsWith8Numbers;
            lazyTroll.blockProfileTextIsNull = items.blockProfileTextIsNull;
            lazyTroll.blockVerifiedBlue = items.blockVerifiedBlue;
            lazyTroll.blockNFTProfile = items.blockNFTProfile;
            lazyTroll.blockTheRealScreenName = items.blockTheRealScreenName;
            lazyTroll.blockPromoters = items.blockPromoters;
            lazyTroll.doNotBlockFollowers = items.doNotBlockFollowers;
            lazyTroll.doNotBlockAffiliates = items.doNotBlockAffiliates;
            lazyTroll.doNotBlockOrganizations = items.doNotBlockOrganizations;
            lazyTroll.doNotBlockGovernment = items.doNotBlockGovernment;
            lazyTroll.doNotBlockLegacy = items.doNotBlockLegacy;

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

    loadWhiteList: function () {
        let url = chrome.runtime.getURL("whitelist.csv");
        console.log(url);
        $.ajax({
          method: "GET",
          url: url,
          dataType: "text",
            async: false
        }).done(function (data) {
             lazyTroll.verifiedWhiteList = data.split(/\r\n|\n/);
        });
    },

    start: function() {
        console.log("lazyTroll: start");
        lazyTroll.loadConfig();

        if (!lazyTroll.verifiedWhiteList) lazyTroll.loadWhiteList();

        // Do a first pass on the existing page
        lazyTroll.checkForTweets(document);

        // Setup an observer for
        lazyTroll.observer = new MutationObserver(lazyTroll.processMutations);

        lazyTroll.observer.observe(document.body, {
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

$("body").bind("beforeunload",function(){
    lazyTroll.cleanup();
});
