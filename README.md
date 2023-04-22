# Lazy Troll Blocker

Twitter is a blighted hellscape replete with automated accounts, paid trolls, unpaid trolls,
MRAs, Elon Musk fans, foreign propagandists, domestic propagandists, flat earthers, sea lions,
feline royalists, 9/11 truthers, conservative christians, anime nazis, everything in between and
all combinations thereof. Sure, you can readily identify the trash people tweeting in bad faith but who wants
to strain their wrist blocking dozens of NEETs three clicks at a time?

Fortunately, being an asshole often goes hand in hand with being extremely lazy and not bothering to do
the bare minimum to establish the even pretense of being a decent human being. Now you can focus your energy
on blocking the remainder who put a tad bit of effort so they could call you a dumb
[insert slur here].

There are no fancy machine learning algorithms at work. No neural networks were forced to read the
chans all day so they could learn to hate humanity and/or correctly identify disinformation
accounts. This isn't a hammer in search of a nail; it's a shovel bludgeoning every shitty social
media account it sees, burying the screen name in the back yard and not bothering to ask
questions later. Block them all and let Musk cry about it.

Will perfectly fine users get caught in the crossfire? Absolutely. Also, who cares? Come up
with a real screen name and profile and ditch the blue check *before* you start posting if you want me to take
you seriously. We're not animals.

This extension can automatically block accounts with
* Twitter Blue subscriber checkmarks
* NFT profile pictures
* Default profile pictures
* Screen names ending with 8 digits
* No profile text
* Fewer than a certain number of followers
* Certain keywords in their profile
* Certain keywords in their user name

Unless they are
* your followers
* organization affiliates

All of these can be configured to your taste. The first four block rules and both exceptions are enabled by default.

It *never* blocks accounts that are 
* followed by you
* simply tweeting any keywords
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
* $TSLA
* \#Bitcoin
* gamer
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
* .eth
