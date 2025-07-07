---
title: "Throughput, reconsidered"
date: "2025-07-06"
tags: ["posts"]
---

I want to talk about a genuinely surprising personal engineering breakthrough
I've experienced. Over the past 3 days, I challenged myself to experiment with a
true AI-native development workflow based on the advancements I've observed over
the last few months. I chose Cursor Ultra, Warp, superwhisper, Claude 4 Opus and
a few other capable models for different purposes, and focused on creating the
most comfortable and fluid experience possible.

I'll provide my background so you can decide if this is relevant to you, but
also to lend some credence to my claim. I've been an engineering leader and
staff engineer for a couple of decades. My day job is managing around 40 people
in a distributed environment as the CTO of a venture backed startup. I've
touched a lot of platforms and languages over the years, including native and
close to the metal commercial products. Plenty of failures and a few commercial
successes along the way. I am mostly quiet on social media.

Anyway, lets see some results.

## Output

- **6 pull requests**
  - Additions: 21,834 lines (5,103 + 1,655 + 11,233 + 2,314 + 840 + 689)
  - Deletions: 189,850 lines (1,016 + 12 + 4,709 + 0 + 184,017 + 96)
  - Files Modified: 1,272 files (65 + 14 + 70 + 29 + 1,079 + 15)
- **Duration: 2.5 days**

## Outcome

### 4 new features for Encamp

- A document upload and indexing pipeline using LLMs for structured metadata
  extraction with a vector database for semantic search
- A UX pass that improved our search and filtering experience for environmental
  documents, combined with a mobile responsiveness pass
- QR code generation and printing for any URL slug, pointed at our mobile
  experience for environmental data collection with edge caching
- An improved search experience for our chemical catalog, surfacing state of
  matter, density and improving the workflow for some of our subject matter
  experts

### A handful of command line tools that improve developer experience

- A tiny Figma MCP proxy to work around troubles I had with Cursor's built-in
  MCP support
- A tool for bootstrapping and working with Git worktrees for developing code in
  multiple branches with multiple local agents
- A tool for starting up multiple local clones of our Vite/Apollo-based web and
  API servers for testing

### Infrastructure improvements

- A massive refactoring and removal of dead code in the area of our monorepo
  that deals with operations migrations and scripts for manipulating data
- Throughout: well architected, linted, unit and integration tested,
  infrastructure included (we use terraform extensively on AWS), observability
  included (cloudwatch alarms etc)

## Model usage

Based on my detailed Cursor usage logs spanning June 29th - July 6th, 2025
(note: this dataset covers a longer period than just the focused 2.5-day sprint
described above):

- **Total requests**: 11,945 across the full week
- **Average daily requests**: ~1,700 requests per day
- **Peak activity**: Sustained periods of 30 - 50+ requests per hour during
  focused development sessions

![Requests Per Minute Over Time](images/requests_per_minute.png)

<figure style="margin: 0.5rem 0 2rem 0; text-align: center;">
  <figcaption style="font-size: 1.2rem; color: #666;">
    Figure 1: Temporal distribution of Cursor requests showing intense bursts during focused development sessions
  </figcaption>
</figure>

## Model types

The data reveals interesting patterns in model usage and the transition between
different tiers:

![Model Distribution](images/model_types.png)

<figure style="margin: 0.5rem 0 2rem 0; text-align: center;">
  <figcaption style="font-size: 1.2rem; color: #666;">
    Figure 2: Model usage distribution showing the transition from Opus to Sonnet as quota limits were reached
  </figcaption>
</figure>

- **claude-4-opus-thinking**: Primary model for complex reasoning tasks, used
  heavily during peak productivity periods
- **claude-4-sonnet-thinking**: Fallback model after hitting Opus quota limits,
  still highly capable
- **Usage patterns**: Clear transition from Ultra (included) quota to
  usage-based billing partway through
- "Max" mode enabled consistently throughout for maximum tool-use and
  re-prompting capabilities

**Actual usage breakdown by model:**

- **claude-4-sonnet**: 358M tokens (34.7%) - The workhorse model
- **claude-4-sonnet-thinking**: 351M tokens (33.9%) - Deep reasoning tasks
- **claude-4-opus-thinking**: 318M tokens (30.7%) - Premium model for complex
  work
- **o3**: 4.7M tokens (0.5%) - Occasional planning and architecture
- **default**: 2.4M tokens (0.2%) - Miscellaneous tasks

Interesting to see the fairly even split between Sonnet and Opus variants - I
definitely hit those quota limits and had to adapt my workflow. If I wasn't
purely testing, I definitely wouldn't have splurged as much on Opus. Sonnet
turns out to be highly capable. I think the term "escape hatch" is probably
correct - stuck in a debugging loop? Swap to Opus or o3.

## The new stack

**Cursor Ultra** - you probably know Cursor, but if not: a vscode based editor
that offers an agent first experience. Its "Max" reasoning mode allows for near
infinite re-prompting and tool-use. I suspect this can likely be replaced with
Anthropic's Claude Code product as a direct swap in. Codex CLI from OpenAI
roughly a few months behind from a usability perspective (as of now, June
29, 2025)

**ChatGPT Pro** - primarily, I use o4-mini-high and only fool around with other
models. It's great for brainstorming and having a second model's perspective. I
use it for data science-based exploration. I don't use Codex or Operator, I
don't like their paradigm for a variety of reasons (primarily that I don't want
to do work in a cloud instance or set up containers replicating my entire life).
I occasionally use Deep Research and o3-pro for where I want extensively sourced
materials.

**Warp** - a modern terminal that has built-in multi-model agent-based AI. Not
strictly necessary, since Cursor has a built-in terminal and terminal tool-use,
but I find having a few different shells in another window is preferable for
some tasks.

**superwhisper** - a voice dictation tool for macOS with templated prompting. It
transcribes speech extremely quickly and integrates with your clipboard. I use
it for prompting mostly. I don't find I like writing with it, other than to
capture ideas, mostly because when I'm dictating, my ideas come out in a strange
order and require a tremendous amount of restructering anyway.

## The method

My main goal here was to get to a place where I felt like I was in a flow state.
There is a feeling where you have a well tuned editor and terminal with your own
keybinds (vim or whatever your flavor), some ambient music and a vision for what
you need to build and you can just jam. I feel like I achieved that here.

### Multiple threads

The first thing I noticed when using Cursor with a model like claude-4-opus with
Max enabled is that it takes its sweet time. I'd estimate somewhere between 2
and 10 minutes for medium complexity tasks. The results are pretty phenomenal -
verified with unit and integration tests, usually at a minimum getting to a
working state where we can debug things to correctness without wading through a
sea of garbage.

I'd compare it to working with a relatively capable junior engineer whom you are
mentoring much more regularly than you would in the real world. Because this
paradigm is a little slower, it makes you immediately reach for multiple threads
of development. For some, this would be nails on chalkboard. For me, this is
actually a plus - maybe its just how my brain works. I just limit to 1 - 3
threads of thought at a time depending on complexity.

Small diversion into "auto-apply" with terminal commands. I mostly do NOT have
it turned on, because these models can occasionally go deeply off the rails and
do insane things, or sit spinning on a series of terminal commands that aren't
yielding fruit due to local setup or even something as simple as a "pager" (like
less/more, which is used by the AWS CLI) interfering with its intuition about
command output that it should be able to see. This means I was interacting with
each agent much more frequently than strictly necessary.

Threaded development paradigms come in different flavors in our stack:

- **Cursor "tabs"** - multiple agents in the same editor, limited to 3 at a time
  by Cursor 1.0 itself. The pros here are that you aren't managing multiple
  windows or directories, but the cons are pretty heavy: agents interact with
  each other poorly, undo each others work, got into deadlocks editing the same
  files. And when your ideas are too dissimilar, they need to be in a different
  branch for hygiene. I primarily use it to make small edits to a secondary set
  of files or work on a back-end task while something is working principally on
  front-end, but in the same concept, so therefore the same branch

- **Multiple cursor instances** - multiple agents, one per editor. No limits.
  The pros here are that you are completely free to make as many changes as you
  want and don't need to worry about having to wait for agents to fight over the
  same files. The cons are it requires a bit of special setup and you have the
  cognitive load of dealing with and identifying multiple windows operating on
  different branches, but which look similar.

## On remote agents

You might ask yourself - why not Codex, Devin.ai or Cursor Background Agents? No
issues with managing complexity of multiple windows and so on. My answer is
pretty simple and practical: with the amount of intervention I'm performing on a
regular basis to get really high quality results, there is no way with the
current generation of UX and models that this is possible in a fully remote
environment. I want to maximize my own output as a person who understands force
multiplication and has a vision for how something needs to be built, not have a
bot fix my low complexity low priority bugs. It's currently a fundamentally
different value proposition.

Secondarily, there's just a lot of set up to make a working development
environment. Despite best intentions, every codebase I've ever worked on has
required at least a day of environment setup. Local tools, state, sandbox
environment, quirks of tooling, versions, operating systems and so on.

I can see remote agents being the way in the future as you scale this process up
extensively, but its going to require us to have the next generation of tooling
in my opinion. With how fast things are moving, this might be a few months from
now though. Honestly, I hope as an industry we focus on the "native" experience
with keybinds and management systems optimized for the absolute power user.
We'll get disproportionate impact. I think that's why Claude Code is so
instantly popular - they're focusing on the hardcore engineer who loves their
environment and cares deeply about getting into the flow state.

## Git worktrees

This is a bit of a game changer. Just set up 3 directories, but reference one
git database in a main repo. More or less just a copy of your development
environment that three instances can interact with.

We don't absolutely need worktrees for this, but it saves a bit of time and
space.

The only snafu, as I mentioned with remote agents, is you likely have a bit of
setup that you're going to need to do per directory. So, one of the tools I
created inventoried all the local state in my development environment and copies
that state into your new worktree. Its specific to Encamp, but the ideas are
pretty simple: copy .env.local and any other local config files, copy your
terraform/terragrunt environment state, but leave behind things like packages
and build outputs. Its easier and less error prone just to type `yarn install`
and `turbo build` again (or whatever your flavor). If you've got a relatively
hygenic codebase, hopefully this is limited to 5 - 7 files and a few directories
worth of state.

This parallel development approach was crucial for maximizing the efficiency of
AI-assisted development, allowing multiple threads of work to proceed
simultaneously without conflicts.

It looks like this:

```
~/dev/
├── branch-1/    # Main worktree (jm/document-parse-metadata)
├── branch-2/    # Secondary worktree (jm/encamp-cli-worktree-sync)
├── branch-3/    # Tertiary worktree (jm/filter-improvements)

git worktree list
# Output:
# /Users/jmoyers/dev/branch-1    83fb585af3 [jm/document-parse-metadata]
# /Users/jmoyers/dev/branch-2    b4f9fa2aca [jm/encamp-cli-worktree-sync]
# /Users/jmoyers/dev/branch-3    bb8625f868 [jm/filter-improvements]
```

The next wrinkle was just getting my local dev API server and web server to run
side-by-side for each worktree. To achieve this, I just built a simple tool to
incrementally check for port availability and bind appropriately and use
environment variables to keep each component in sync.

Once the setup is done, open a Cursor instance per branch and let the good times
roll.

## Repeatable success

As you build up habits and realize the parts that the model is going to
consistently get wrong, you absolutely need to record your findings. I started
out with `README.md` files - I moved to Cursor Rules, which are effectively the
same thing, but with a front matter-style block to tell the agent when to attach
the rules to the context automatically. I've found that the rules are somewhat
inconsistently applied, but I'm confident that's going to get better.

As you learn the shortcomings, you are basically shoring these up with a context
aware system prompt. Start investing in this immediately and you'll only have to
occasionally nudge the model back to instructions pertinent to the style of
problem you're trying to solve. This doesn't work perfectly, but I suspect it
saves a huge amount of frustration factor over the thousands of hours you're
likely to be working with these tools.

## Integrating design: Figma and model context protocol

This technology is obviously brand new (June 4) in its official form. It works
using your local (nativeish) Figma instance, and is a beta feature you need to
enable. The basic premise is to select a frame in Figma, get a node ID, and then
having your agent request information about that frame. There are a few
variants, but the idea is to get a screenshot and some generic codegen for the
components referenced in the frame.

The agent can use this information to build UI without having to have the
extremely profound spatial reasoning required to properly interpret a screenshot
by itself, but also not rely on Figma's (perfectly workable, but generic) code
generation. Its like giving the model a screenshot, but also the general layout
of a design in a format more suited for the current generation of LLMs to make
working product from.

I'm not a big believer in handing over enormous tasks to these agents, so this
gives us an opportunity to create a smaller more achievable scope. It also means
you have an intermediary step between some generic codegen and integrating it
with your codebase.

The only catch: it didn't work out of the box. Cursor's MCP tool-use integration
hung for me and couldn't retrieve any information. Its a black box with no
obvious way to debug it. So I wrote a few curl commands to debug Figma's MCP
server (it uses SSE), and it turns out it works perfectly well — it looks like
Cursor's MCP tool-use that is broken.

So, I had the idea to create a tiny proxy that exposes the same tools, and have
Cursor call that through the terminal and boom. We're back in business. It does
two things only: downloads a screenshot of the frame and gets a snippet of
typescript and puts both of those things in a .gitignored directory to reference
during implementation. I wrote a small Cursor Rule to reference these, but to
match our surrounding React application and use our chosen UI toolkit (MUI in
this case), and it produces surprisingly excellent results. I nudged towards a
near pixel perfect implementation with around 15 minutes of fiddling the first
time through.

The integration works remarkably well for translating design intent into working
code while maintaining our application's architecture and design patterns.

## How can we make this better?

A few small things could make this even more pleasant.

- An "agent needs attention" notification and pipelining system so I can go
  directly to the window and pane where I need to review something. Cursor has a
  "bell" type notification, but its insufficient and inconsistently applied.
- Better visual differenation options for multiple cursor windows - named based
  on branch / sandbox / directory and color coded
- Cursor rules need clear patterns for whats applied when, and it needs to be
  more intelligent than file globs. "Agent decides" currently doesn't work well.
  `yarn` over `npm`, don't use interactive shell commands, beware that AWS CLI
  has a terminal pager by default, don't kill my dev server. I'm leaning towards
  one terse "always apply," but it needs to be more sophisticated than this.
- Clear visuals about how often you can use your smarter models before running
  into usage caps. I want to hold on to my precious Opus and O3 tokens.
- Select model per window, not universally for every window and tab.
- A usability bug - your chat input clears when a model finishes a task,
  potentially blowing away something you were about to submit
- Model needs to be able to use the debugger with breakpoints - this would be a
  huge win. I was debugging flaky integration tests by hand and it was extremely
  painful to have it use console.log
- Edit the todo list that the agent keeps on hand without asking the model to do
  it (you need the model to as well)
- Cursor agent needs to be able to re-use a terminal rather than endlessly
  spawning a dev server over and over after `pkill`ing the old one
- Slightly stupider local agent should be used for tasks like "should we apply a
  rule" without having to round trip for your main thinking model

Other things that helped that I built as I went:

- Unified logging, including API server, type checking and generation processes,
  browser logging (I built a console.log shim) - the model being aware of the
  logs made a feedback loop extremely fast
- Per project containerized test databases - working on multiple branches I
  needed to integration test multiple features with different schema
- Multiple AWS sandboxes - I found myself needing and wanting to deploy to a
  sandbox per branch

One thing above all else: keep us in the flow state. Optimize for keybinds and
power users. I don't want to operate an agent through Slack.

## Pitfalls

Mainly, code review is extremely important. And with this volume of output, its
extremely burdensome. Models (even the smart ones), on their own, produce
monolith untestable components, leave dead code paths, forget the PR context
between conversations, and inconsistently test or write placeholder tests. The
PRs get extremely large, extremely quickly. Its your principle job when piloting
this to be the downward pressure on size, complexity and hold a high quality
bar.

I found myself reviewing a particular large PR for hours - applying extreme
pressure to reduce footprint and complexity in the code. Do the normal stuff -
DRY, testing, explanation, documentation, code quality, consistent style and so
on. If you don't stick to your guns and just simply care more than other people,
you're going to produce slop at a rate that is utterly unsustainable. I actually
cannot imagine this tooling in the hands of a true junior not focused on
learning their craft. It'll be an absolute nightmare to review.

It will absolutely multiply the effectiveness of an already effective
practitioner. And its going to spiral the ineffective engineer into net negative
contribution so fast its going to make our collective heads pop off our
shoulders.

## Token usage and cost analysis

![Daily Token Usage](images/daily_tokens.png)

<figure style="margin: 0.5rem 0 2rem 0; text-align: center;">
  <figcaption style="font-size: 1.2rem; color: #666;">
    Figure 3: Daily token consumption showing variance between intensive development and more meeting heavy days
  </figcaption>
</figure>

## Usage patterns and cost observations

**Dashboard measurements** (what Cursor reports):

- **Large context windows**: Average 87k tokens/request (~130 pages of text)
- **High request frequency**: Up to 17 requests/minute during peak sessions
- **Substantial volume**: ~12,980 requests over the week-long period
- **Mixed billing**: Transition from "Ultra" included quota to usage-based
  pricing

**Reported costs**: ~$24k/year extrapolated from my usage patterns

### What this probably doesn't reflect

This dashboard data probably doesn't reflect the actual computational load on
providers due to optimizations we can't see:

- **Context caching**: Repeated code/chat context likely cached between requests
- **Request pipelining**: Multiple logged "requests" may share computational
  resources
- **Background optimization**: Auto-completion may use different, lighter models
- **Incremental processing**: Changes might only require partial re-computation

### Economics (with actual data)

Initially I thought this must be unsustainable from a cost perspective for
Cursor. Turns out I was right to be skeptical - but for completely different
reasons than I expected.

After digging deeper into my usage data, I discovered something fascinating
about how these interactions actually work under the hood. The numbers are
pretty wild:

**The real breakdown:**

- **Total tokens**: Over 1 billion tokens (1,034,736,186 to be exact)
- **Actual cost**: $468.87 over the period
- **True I/O tokens**: Only 7.3M tokens (0.7% of total usage)
- **Cache reads**: 965M tokens (93.3% of total usage)
- **Cache writes**: 61.6M tokens (6.0% of total usage)

So my speculation about context caching was spot on, but I massively
underestimated the extent. **99.3% of my token usage is cached content**. Cache
reads are happening 15.7x more frequently than writes, which makes sense - most
of my repository context, conversation history, and code snippets are being
reused across requests.

This explains why Cursor can offer "unlimited" usage at $200/month. The actual
computational cost per request is tiny once your codebase and conversation
context is cached. Most of what I thought were expensive 87k-token requests were
actually just 500-1000 tokens of new input/output, with the rest being
efficiently cached repository content.

The economics suddenly make perfect sense. Cursor isn't paying for 1B+ tokens of
inference - they're paying for 7M tokens of actual processing plus some caching
infrastructure costs. That $468 I spent probably cost them closer to $15 - $30
in actual compute and suddenly I'm a lot more sympathetic to some of the users
complaining about being Opus rate limited. I think we're definitely going to be
seeing downward pressure on price in this space, and that's a good thing. Claude
Code and other tools seem comparable, and this is an arms race to be sure.

### Conclusion

This is more than real. It's a huge throughput gain with zero sacrifices other
than becoming utterly and completely dependent on new technology. That is scary.
However, there's a ton of healthy competition in this space, and I'm not
personally going to let my brain atrophy and allow the robots to do all my
thinking for me. In the words of Alexandr Wang, you still need to "really,
really care" to produce something extremely high quality.

Long term, lets hope we're headed towards The Culture vs. the Butlerian Jihad.
Go read Ian M. Banks - parts of that future he describes are dark and dystopian,
but large parts of it are hopeful.

## TL;DR

- CTO with 20+ years experience ran a focused 2.5-day AI-assisted sprint
- Native AI dev stack: Cursor Ultra, Warp, superwhisper, Claude 4 Opus
- Shipped 6 PRs:
  - ~21K lines added, ~190K lines deleted
  - Touched 1,272 files
  - Delivered 4 production features (LLM metadata extraction/indexing/semantic
    search, mobile QR tools, UX/search upgrades, chemical catalog improvements)
- Wrote supporting CLI tools (e.g. Figma MCP proxy, multi-worktree bootstrapper)
- Maintained high quality: infra, tests, linting, observability all included
- Leveraged Git worktrees + multiple Cursor instances to parallelize agent
  threads
- Agents are like capable juniors: effective, especially with tight scope and
  context rules
- Massive throughput improvement, feels sustainable with native workflows
- Dives into methods, ergonomics, and why remote agent UX still isn't there yet
