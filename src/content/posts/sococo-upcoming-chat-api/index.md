---
title: "(Sococo Archive) Upcoming Chat API"
date: "2014-04-04T14:17:00.000Z"
featured: false
draft: false
tags: ["chat", "sococo"]
---

**Note**: This is an old post from Sococo's blog. Keeping it around for history.

<div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; margin: 2rem 0; color: white; font-family: monospace;">
  🤖 beep boop 🤖<br>
  <small style="opacity: 0.8;">original image placeholder</small>
</div>

If you’re the type of person that’s been looking to get Sococo more integrated
into your team’s workflow, our next few releases should have some gems that will
help you get moving in the right direction.

We’re planning on opening up our chat platform and expanding its capabilities
dramatically to improve the look and feel, organization, and also allow you to
push third party information directly into your virtual office. I’d like to talk
a little bit about the vision for this project, and also solicit feedback from
the community.

You should know that we’re targeting Hubot as our first integration. This means
that we’ll be writing an adapter and hosting it on Github. This should allow you
to have some of the more complex and far reaching integrations available to you
right out of the gates, thanks to Hubot’s extensive community library. We like
this approach, because it puts power in your hands immediately.

We’re trying to keep the API surface small and as simple as possible to start,
with the intent that we can get something out there quickly and iterate fast
with feedback from the community. One of the measures of simplicity is how
complicated the Hubot adapter ends up being. After surveying the marketplace, we
found Campfire’s adapter is a cool 239 lines of Coffeescript. They have a
relatively small streaming API (discussed here) which provides a list of chats
for a given room over time. We are currently internally debating a small
endpoint for doing something very similar vs. providing a full on Bayeux
endpoint with read/write and multiple data types (e.g. presence, profiles, chat
messages, and so on).

Basically, it’s a tradeoff between providing something very simple to consume
vs. providing something that has the full capabilities of Sococo’s own web
client with built-in connection features. Regardless, we intend to provide
everyone with a nice little javascript library for consuming it! I am very
interested in hearing feedback on this point.

Our chat UI is going to get a much needed architectural and visual refresh. This
will come in stages. For the first stage, we’ll push for simplifying managing
multiple simultaneous conversations. We’re going with a tabbed approach, where
all person-to-person conversations will be available from a single window (the
Conversation window).

We’re also going to spruce up the chat log in both the person-to-person and room
chat. In other words, we’ll be generally making it really nice to look at.
Another technical point is that we’ll be using a WebView to support chat on
Windows and Mac. Later on, rich media embeds will be much easier to support, and
our intent is to also support a subset of html for sweet, sweet formatting
options (for your integrations and more!).

Last but not least, we’re going to support preformatted text so that you can
copy around say, a piece of code, and have it maintain whitespace and use a
monospaced font. Simple, but oh so satisfying.

Hopefully this has been a useful preview of some upcoming functionality. I’m
looking forward to hearing from you. Post your comment or suggestions below or
find me directly on twitter at @joshuamoyers.
