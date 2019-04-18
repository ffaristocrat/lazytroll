# Lazy Troll Blocker

Twitter is a hell site replete with automated accounts, paid trolls, unpaid trolls, nazis,
sea lions and everything in between. Sure, you can readily identify the people tweeting in bad
faith but it's exhausting to manually block so many accounts.

Fortunately, a lot of these assholes are also extremely lazy and don't bother to do the bare
minimum to establish the even pretense of authenticity. Now you can focus your energy on
blocking the remainder who put at least a little effort behind their trolling.

Will authentic users get caught in the crossfire? Absolutely. Also, who cares? Come up
with a real screen name and profile if you want me to take you seriously. We're not animals.

This chrome extension can automatically block accounts with
* Default profile pictures
* Screen names ending with 8 digits
* No profile text
* Fewer than a certain number of followers
* Certain keywords in their profile
* Certain keywords in their user name

All of these can be configured to your taste. Only the first two are enabled by default.

This does *not* block accounts who
* You follow
* Simply tweet keywords

The extension scans the page for tweets, evaluates the username and profile picture.
If those are fine, it fetches their profile and looks for the keywords. If a block is warranted,
it triggers the click events for the block button and the block confirmation dialog. If a user
is cleared, it'll skip checking them going forward until the page is reloaded.

Here's a starter pack of keywords

Profile:

* \#MAGA
* MAGA!
* \#2A
* \#Trump2020
* \#buildthewall
* \#americafirst
* not a russian bot
* followed by
* \#LiberalismIsAMentalDisorder
* Constitutional Originalist
* Constitutional conservative
* proud conservative
* \#TrumpTrain
* \#DrainTheSwamp
* \#SecureOurBorders
* \#ProtectOurCitizens
* \#IProtectOurCommunity
* \#ConcealCarryPermit
* \#NRA Member
* trump supporter
* lifetime NRA
* Shadow banned
* Shadowbanned
* \#QAnon
* \#FollowTheWhiteRabbit
* \#QArmy
* \#pizzagate
* \#pedogate
* Proud Boy
* Pro-Free Speech
* Pro Free Speech
* gab.ai
* \#RedPill
* ΜΟΛΩΝ ΛΑΒΕ
* \#DemExit
* \#McCarthyism
* \#WalkAway

User Name:

* Deplorable
* ❌
