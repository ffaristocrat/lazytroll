lazyTrollOptions = {
    saveOptions: function () {
        chrome.storage.local.set({
            blockDefaultProfileImage: $('#blockDefaultProfileImage').is(':checked'),
            blockScreenNameIsNumeric: $('#blockScreenNameIsNumeric').is(':checked'),
            blockProfileTextIsNull: $('#blockProfileTextIsNull').is(':checked'),
            blockVerifiedBlue: $('#blockVerifiedBlue').is(':checked'),
            blockNFTProfile: $('#blockNFTProfile').is(':checked'),
            blockTheRealScreenName: $('#blockTheRealScreenName').is(':checked'),
            blockPromoters: $('#blockPromoters').is(':checked'),
            doNotBlockFollowers: $('#doNotBlockFollowers').is(':checked'),
            doNotBlockOrganizations: $('#doNotBlockOrganizations').is(':checked'),
            doNotBlockGovernment: $('#doNotBlockGovernment').is(':checked'),
            doNotBlockAffiliates: $('#doNotBlockAffiliates').is(':checked'),
            doNotBlockLegacy: $('#doNotBlockLegacy').is(':checked'),
            profileKeywordList: $('#profileKeywordList').val(),
            userNameKeywordList: $('#userNameKeywordList').val(),
            minimumFollowers: $('#minimumFollowers').val(),
        }, function () {
            console.log('lazyTrollOptions: saveOptions');
        });
    },

    loadOptions: function() {
        chrome.storage.local.get({
            blockDefaultProfileImage: true,
            blockScreenNameIsNumeric: true,
            blockProfileTextIsNull: false,
            blockVerifiedBlue: true,
            blockNFTProfile: true,
            blockTheRealScreenName: false,
            blockPromoters: false,
            doNotBlockFollowers: true,
            doNotBlockOrganizations: true,
            doNotBlockGovernment: true,
            doNotBlockAffiliates: true,
            doNotBlockLegacy: true,
            profileKeywordList: "",
            userNameKeywordList: "",
            minimumFollowers: 0,
        }, function (items) {
            console.log('lazyTrollOptions: loadOptions');
            $('#blockDefaultProfileImage').prop('checked', items.blockDefaultProfileImage);
            $('#blockScreenNameIsNumeric').prop('checked', items.blockScreenNameIsNumeric);
            $('#blockProfileTextIsNull').prop('checked', items.blockProfileTextIsNull);
            $('#blockVerifiedBlue').prop('checked', items.blockVerifiedBlue);
            $('#blockNFTProfile').prop('checked', items.blockNFTProfile);
            $('#blockTheRealScreenName').prop('checked', items.blockTheRealScreenName);
            $('#blockPromoters').prop('checked', items.blockPromoters);
            $('#doNotBlockFollowers').prop('checked', items.doNotBlockFollowers);
            $('#doNotBlockOrganizations').prop('checked', items.doNotBlockOrganizations);
            $('#doNotBlockGovernment').prop('checked', items.doNotBlockGovernment);
            $('#doNotBlockAffiliates').prop('checked', items.doNotBlockAffiliates);
            $('#doNotBlockLegacy').prop('checked', items.doNotBlockLegacy);
            $('#profileKeywordList').val(items.profileKeywordList);
            $('#userNameKeywordList').val(items.userNameKeywordList);
            $('#minimumFollowers').val(items.minimumFollowers);
        });
    }
};


$(document).ready(function () {
    lazyTrollOptions.loadOptions();
    $('button#save').click(function() {
        lazyTrollOptions.saveOptions();
        window.close()
    });
    $('button.cancel').click(function() {
        window.close()
    });
});
