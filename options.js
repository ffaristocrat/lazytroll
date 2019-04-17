lazyTrollOptions = {
    saveOptions: function () {
        console.log('lazyTrollOptions: saveOptions');
        chrome.storage.local.set({
            blockDefaultProfileImage: $('#blockDefaultProfileImage').is(':checked'),
            blockScreenNameIsNumeric: $('#blockScreenNameIsNumeric').is(':checked'),
            blockProfileTextIsNull: $('#blockProfileTextIsNull').is(':checked'),
            profileKeywordKillList: $('#profileKeywordKillList').val(),
            userNameCharacterKillList: $('#userNameCharacterKillList').val(),
        }, function () {
            console.log('lazyTrollOptions: saveOptions call back');

            // Update status to let user know options were saved.
            let status = $('#status');
            status.innerText = 'Options saved.';
            setTimeout(function () {
                status.innerText = '';
            }, 750);
        });
    },

    loadOptions: function() {
        console.log('lazyTrollOptions: loadOptions');
        chrome.storage.local.get({
            blockDefaultProfileImage: true,
            blockScreenNameIsNumeric: true,
            blockProfileTextIsNull: false,
            profileKeywordKillList: "",
            userNameCharacterKillList: "",
        }, function (items) {
            console.log('lazyTrollOptions: loadOptions call back');
            $('#blockDefaultProfileImage').prop('checked', items.blockDefaultProfileImage);
            $('#blockScreenNameIsNumeric').prop('checked', items.blockScreenNameIsNumeric);
            $('#blockProfileTextIsNull').prop('checked', items.blockProfileTextIsNull);
            $('#profileKeywordKillList').val(items.profileKeywordKillList);
            $('#userNameCharacterKillList').val(items.userNameCharacterKillList);
        });
    }
};


$(document).ready(function () {
    lazyTrollOptions.loadOptions();
    $('button#save').click(function() {
        lazyTrollOptions.saveOptions();
    });
});
