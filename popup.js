lazyTrollOptions = {
    saveOptions: function () {
        chrome.storage.local.set({
            blockDefaultProfileImage: $('#blockDefaultProfileImage').is(':checked'),
            blockScreenNameIsNumeric: $('#blockScreenNameIsNumeric').is(':checked'),
            blockProfileTextIsNull: $('#blockProfileTextIsNull').is(':checked'),
            doNotBlockFollowers: $('#doNotBlockFollowers').is(':checked'),
            doNotBlockVerified: $('#doNotBlockVerified').is(':checked'),
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
            profileKeywordList: "",
            userNameKeywordList: "",
            minimumFollowers: 0,
        }, function (items) {
            console.log('lazyTrollOptions: loadOptions');
            $('#blockDefaultProfileImage').prop('checked', items.blockDefaultProfileImage);
            $('#blockScreenNameIsNumeric').prop('checked', items.blockScreenNameIsNumeric);
            $('#blockProfileTextIsNull').prop('checked', items.blockProfileTextIsNull);
            $('#doNotBlockFollowers').prop('checked', items.doNotBlockFollowers);
            $('#doNotBlockVerified').prop('checked', items.doNotBlockVerified);
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
