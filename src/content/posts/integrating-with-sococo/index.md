---
title: "Announcing the Sococo API"
date: "2014-10-16T14:23:00.000Z"
featured: false
draft: false
tags: ["chat", "api", "hubot", "sococo"]
---

**Note:** This is an old post from Sococo's blog. Keeping it around, because I
like the artwork and history :-)

![Beep boop](assets/oSLQzvt.png)

With the chat focused release, we added a long requested feature: the ability to
integrate with Sococo. The integration comes in the form of a very simple chat
API which will evolve over time, but will enable your team to experiment with
adding business processes into your everyday Sococo activities.

Today, the API allows:

- Authenticating into a room
- Sending room chats
- Receiving room chats

Combined with our new chat release which provides inline images, emoji,
pre-formatted text, unread and offline message support, this provides a
surprisingly powerful base for integrating third party tools into the product.
We also know not every use case will be covered off by this first release. Group
chat, for instance, which we will add support for in an upcoming release will
add significantly to the number of use cases addressed by the API.

In addition to these building blocks, we’ve open sourced a Hubot adapter for
Sococo, which brings the power of the Hubot community library of integrations to
Sococo. If you run a development team or manage a datacenter, you might check
out ChatOps, a talk on using Hubot for automation in that space.

If you’re struggling for some ideas and think your team can benefit from some
integration, next we’ll cover off some ideas that might help you get started.
The trick is to map key repetitive tasks into quick-to-issue commands, or turn
something that is asynchronous into something that can happen in real-time.

#### Development: Project Source Control & Bug Tracking

A common setup is to have everyone who’s on a project co-locate in a room. This
could be a scrum team if you’re into Agile. Or just a set of folks working on
loosely the same project.

Out of the box, Hubot plugins for issue trackers are sort of useful. To really
get at the core principles, we might need to write a little bit of custom glue
code.

Let’s identify some key areas:

**QA cycle time**

- Every day we move tickets from “Open” to “In Dev” to “QA” to “Done”
- The secret to a good burndown chart is real-time feedback!
- We can help: proactively notify the whole team about tickets changing status
- Provide a link to the ticket directly in chat and by convention, put a link to
  the build to test
- Have Hubot proactively poll your current sprint looking for tickets that are
  updated (or even blocked!) and put them into chat for the team on an interval

**What am I working on and has somebody mentioned me in a ticket?**

- Grabbing your own list of prioritized work for a sprint requires a bunch of
  steps: log in to VPN, enter your Jira credentials, bring up the appropriate
  sprint board, move tickets
- Replace that with a series of quick filters accessible from chat…
- “hubot jira sprint me” = all tickets in this sprint assigned to me, ordered by
  rank
- “hubot jira mentions” = all tickets that mention me in comments, ordered by
  date updated
- “hubot jira dev PS-1822” = start work on ticket PS-1822 and move it to “In
  Dev”

**I broke the build or “how do I get the latest build for…?”**

Like many companies, when we write code it has to work on 5 platforms
(literally) — Windows, Mac, Linux, iPhone, iPad. This means that occasionally
somebody who’s primarily working on Windows will break a Mac build and vice
versa.

We also have a build server that does continuous integration. When somebody
checks something in to source control, we can kick off builds for all platforms.
We happen to use TeamCity which has a pretty extensive REST API. This lets us
query running builds, builds with a particular status, link to artifacts for a
particular project or branch, and so on.

The natural fit is to push builds which fail directly into room chat so the
person can claim it to investigate and to let others know not to update their
code on that platform until issues are resolved.

The second natural fit is to allow project managers and QA folks to quickly post
links to the latest binaries available for a given project to facilitate baking
the latest features.

#### Customer Service: Monitoring Sign-ups or Requests for Help in Real-time

Like many products, people sign up for Sococo off the web. We like to reach out
to see if they have any questions about the product and to make our support
staff available to everyone in real-time. Being that these are human beings,
they are not checking their email for new sign-up notifications every minute.

Minutes matter in an internet business. People’s lives are busy and they don’t
have all day to devote to looking at new products and services. The good news:
pushing real-time notifications to your support staff in chat is trivial –
increasing the chance that you can reach out and delight your customer with
human touch (with just a little bit of robot assistance).

If you use Salesforce or SugarCRM or some similar product, you can also look at
integrating directly with those services. Push the link to the new account
record into the chat message that you send to your support reps. For us, we’ll
also integrate links to our internal analytics platform for an account.

#### DevOps: Integrating Monitoring Tools for Your Datacenter

Internally, we use a variety of tools to monitor the service.

These are things like… Graphite (Hubot script) – Graph performance data over
time

Nagios/ZenOSS/PagerDuty (Hubot script) – Monitoring and issue tracking

Logstash – Centralized logging infrastructure

You need a way to keep everyone on the same page when it comes to a time
sensitive performance or service-level problems. Being able to quickly ask Hubot
to provide a list of the services that have exceptions along with being able to
interrogate Graphite for a graph of the component in question are important
(e.g. hubot graphite medianode3.streamCount will post an image directly into
chat with data over time, for everyone in the room to see).

Further, being able to share that real-time with your colleagues via inline
images support in room chat is pretty key. You’re sharing data with them
passively just by being in the same room in Sococo. You can talk about the steps
that you’re going through live as you issue requests in chat, allowing everyone
present to see the same data. This also allows you divide and conquer for
multiple areas of investigation.

#### Conclusion

To reiterate, try to think of areas where there are repetitive or asynchronous
tasks that can be made into shared real-time experience. Automate everything
that is reasonable. You’ll definitely have to look beyond the “standard” scripts
to help your organization, but in the end the entire Sococo hubot adapter is
only 150 lines of code. That means the barrier to entry is lower than you might
think!

**Here’s are some handy links:**

- [Sococo API documentation](http://developer.sococo.com/)
- [Sococo hubot adapter](https://github.com/sococo/hubot-sococo)

Happy integration! Questions or comments? Post below or find me directly on
twitter @joshuamoyers.
