lazyTrollOptions = {
    saveOptions: function () {
        chrome.storage.local.set({
            blockDefaultProfileImage: $('#blockDefaultProfileImage').is(':checked'),
            blockScreenNameIsNumeric: $('#blockScreenNameIsNumeric').is(':checked'),
            blockProfileTextIsNull: $('#blockProfileTextIsNull').is(':checked'),
            profileKeywordList: $('#profileKeywordList').val(),
            userNameKeywordList: $('#userNameKeywordList').val(),
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
        }, function (items) {
            console.log('lazyTrollOptions: loadOptions');
            $('#blockDefaultProfileImage').prop('checked', items.blockDefaultProfileImage);
            $('#blockScreenNameIsNumeric').prop('checked', items.blockScreenNameIsNumeric);
            $('#blockProfileTextIsNull').prop('checked', items.blockProfileTextIsNull);
            $('#profileKeywordList').val(items.profileKeywordList);
            $('#userNameKeywordList').val(items.userNameKeywordList);
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
