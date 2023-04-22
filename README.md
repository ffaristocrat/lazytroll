# Lazy Troll Blocker

Twitter is a blighted hellscape replete with automated accounts, paid trolls, unpaid trolls,
MRAs, foreign propagandists, domestic propagandists, flat earthers, sea lions,
feline royalists, 9/11 truthers, anime nazis and everything in between.
Sure, you can readily identify the trash people tweeting in bad faith but who wants to strain their
wrist blocking dozens of NEETs three clicks at a time?

Fortunately, being an asshole often goes hand in hand with being extremely lazy and not bothering to do
the bare minimum to establish the even pretense of authenticity. Now you can focus your energy
on blocking the remainder who put at least a little effort so they could call you a dumb
[insert slur here].

There are no fancy machine learning algorithms at work. No neural networks were forced to read the
chans all day so they could learn to hate humanity and/or correctly identify disinformation
accounts. This isn't a hammer in search of a nail; it's a shovel bludgeoning every shady social
media account it sees, burying the screen name in the back yard and not bothering to ask
questions later. Block them all and let @jack sort it out.

Will authentic users get caught in the crossfire? Absolutely. Also, who cares? Come up
with a real screen name and profile *before* you start posting if you want me to take
you seriously. We're not animals.

This extension can automatically block accounts with
* Default profile pictures
* Screen names ending with 8 digits
* No profile text
* Fewer than a certain number of followers
* Certain keywords in their profile
* Certain keywords in their user name

Unless they are
* followers
* verified users

All of these can be configured to your taste. The first two block rules and both exceptions are enabled by default.

It *never* blocks accounts that are 
* Ones you follow
* Simply tweeing keywords
* Beyoncé

The extension scans the page for tweets, evaluates the username and profile picture.
If those are fine, it fetches their profile and looks for the keywords.

If a block is warranted, it triggers (and hides) the click events for the block button
and the block confirmation dialog. Then, just to be sure, it destroys the node from orbit.
All you'll see is Twitter's ephemeral notification that you blocked an account. Blocks
are logged in the console along with the reason.

If a user is clean, it'll skip checking them going forward until the page is reloaded.

Here's a starter pack of keywords

Profile:
* \#MAGA
* \#2A
* \#Trump2020
* \#buildthewall
* \#americafirst
* not a russian bot
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
