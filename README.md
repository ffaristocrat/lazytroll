# Lazy Troll
Chrome extension to automatically block lazy Twitter trolls.

This blocks accounts with
* No profile pic
* 8 digits at the end of their username
* Any key words (case insensitive) on profileKeywordKillList in their 
*profile* 

This does *not* block accounts who
* Simply tweet keywords on profileKeywordKillList
* You follow
* You already blocked.

You'll want to review profileKeywordKillList in content.js and edit to your
tastes before installing and running.

How to install
* Clone repo
* Bring up the Extensions page in Chrome
* Switch Developer Mode on
* Load unpacked extension
* Select the lazytroll directory

The extension works by evaluating their username and profile pic. If those
are fine, it fetches their profile info and looks for the keywords.

Once a user has been identified one way or the other, it'll skip them going
forward.

It triggers the block user events on the page rather than sending a 
POST request which would require a lot of work to get the authentication
set up. As such, it may identify a troll but the actual block may not
fire. This happens sometimes when a whole bunch of trolls get identified
in a thread.

Feel free to fork and/or submit pull requests to improve performance!
