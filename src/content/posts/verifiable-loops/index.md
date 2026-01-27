---
title: "Verifiable Loops"
date: "2026-01-26"
tags: ["posts", "ai", "software-development", "productivity"]
---

On January 7, Terence Tao
[posted](https://mathstodon.xyz/@tao/115855840223258103) about an Erdős problem
being solved "more or less autonomously by AI." The key was Lean - a formal
proof language that can mechanically verify mathematical arguments.

Tao observed:

> "The combination of reasonably competent AI text generation and modification
> capabilities, paired with the ability of formal proof assistants to verify the
> informal arguments thus generated, allows for a much more dynamic and
> high-multiplicity conception of what a writeup of an argument is."

This pattern keeps showing up. In AI research, we see labs investing heavily in
proprietary evals. In a
[recent conversation with Demis Hassabis](https://www.youtube.com/watch?v=02YLwsCKUww),
Dario Amodei talks about this loop:

> "The mechanism whereby I imagined it would happen is that we would make models
> that were good at coding and good at AI research and we would use that to
> produce the next generation of model."

I have been experimenting with a similar pattern at a smaller scale to good
effect: build domain-specific harnesses for sufficiently complex problems, and
the agent can iterate with concrete feedback.

## January in Numbers

Following up on [Throughput Reconsidered](/posts/throughput-reconsidered/),
here's what 25 days of this looks like:

```
| Metric                        | Value      |
|-------------------------------|------------|
| Cursor Events                 | 6,707      |
| Cache Read Tokens             | 2.72B      |
| Input Tokens (w/ cache write) | 110.8M     |
| Output Tokens                 | 14.6M      |
| Cache Hit Rate                | 96.1%      |
| Pull Requests                 | 23         |
| Lines Added                   | 159,179    |
| Lines Deleted                 | 4,353      |
| Files Changed                 | 708        |
| Test Files                    | 104        |
| Test Suites                   | 620        |
| Individual Tests              | 1,744      |
| Test Lines Added              | 37,061     |
```

91% merged (21 of 23 PRs).

## Traditional Testing

Traditional verification methods fall short for certain problem classes:

- **Unit tests** verify isolated behavior but miss emergent issues
- **Integration tests** are slow and often require human judgment on
  "acceptable"
- **Manual testing** doesn't scale, is inconsistent, and is hard to reproduce

The gap is complex runtime behavior that emerges from composition:

- An expensive component with hundreds of children re-renders 4-5 times when
  clicking a filter
- A GraphQL query fires 3 times with identical variables
- Referential stability breaks when changes propagate through consumers
- Total interaction takes 2.5 seconds when it should take 300ms

These aren't bugs that unit tests catch. They're emergent behaviors that require
understanding causality chains across the system.

## A Good Harness

The conceptual pattern:

1. **Instrumentation** - Capture structured events during execution
2. **Reproducibility** - Events can be replayed or analyzed post-hoc
3. **Machine-readable output** - Format that agents can parse and reason about
4. **Causal attribution** - Not just "what" but "why" (which prop change
   triggered the re-render)

The idea is to give the agent the same observability a human expert would use,
but in a format it can process - and generate on its own during its loop.

Frontend interaction tracking and distributed tracing are the same concept at
different scales:

```
| Frontend (React)    | Distributed Systems (OTel) |
|---------------------|----------------------------|
| Interaction         | Trace                      |
| Render cycle        | Span                       |
| Component tree      | Service graph              |
| Prop changes        | Context propagation        |
| Network requests    | Network requests           |
| Cascading effects   | Cascading effects          |
```

The traditional approach builds dashboards for human analysis - Chrome DevTools,
React Profiler, observability platforms like Sentry. They're optimized for
humans. Diagnosis happens in human brain.

The agent-first approach uses the same underlying data but with a different
interface: a machine-readable format that's queryable and summarizable. It's a
local harness that agents can invoke during development, with baselines tracked
over time and relative improvement as the goal.

OTel/tracing was built for humans debugging production. Agent harnesses are
built for AI debugging development. Same trace data model, different consumption
pattern.

## Concrete Example

One such harness I've been using is Bolt - a small library I built that captures
structured events during React/Apollo execution and exposes them via MCP (Model
Context Protocol) so Cursor can query them directly.

**Instrumentation side** (`bolt-metrics`):

- `startInteraction("action.name")` - marks the beginning of a user action
- `useRenderTracker` hook - logs each component render with timing, props that
  changed, and causality (why it re-rendered)
- Apollo link integration - automatically tracks query starts, resolves, and
  duplicate detection
- Context change tracking - logs when React context values update

Events stream to a JSONL file as wide events - each line is a self-contained
JSON object with timestamps, component names, prop diffs, query variables, etc.

**Agent side** (`bolt-mcp`):

- `trace.get_interaction(last=true)` - returns a waterfall of the most recent
  interaction
- `react.get_top_rerenders(limit=10)` - render counts grouped by component
- `react.get_commit_tree(interaction_id=...)` - which props triggered each
  re-render
- `net.explain_query(query_name="...")` - diagnosis of why a query fired
  multiple times

Example waterfall output:

```
Interaction #23: omnisearch.clear (2514ms TTI)

  Time (ms) | Event
  ----------+-------------------------------------------------------------
       +0ms | ACTION: omnisearch.clear()
       +3ms | RENDER: <OverviewProvider> (x3)
       +3ms | CONTEXT: filterKeys, stableFilter, queryVariables updated
       +3ms | QUERY_START: WasteSubmissionsOverview
     +349ms | RENDER: HydratedOmnisearchDataGrid (257ms)
     +729ms | RENDER: Filters + Charts + Grid again (~112-125ms each)
    +1668ms | QUERY_RESOLVE: WasteSubmissionsOverview (1665ms)
    +2044ms | RENDER: HydratedOmnisearchDataGrid (252ms)
```

Example render counts:

```
  Component                      | Renders | Total(ms)
  -------------------------------+---------+----------
  SubmissionStatusContent        | 4       | 806ms
  SubmissionGeneratorStatusContent| 4       | 746ms
  HydratedOmnisearchDataGrid     | 4       | 675ms
  OmnisearchDataGrid             | 3       | 468ms
```

The workflow: clear the events file, perform the interaction in the browser,
then ask Cursor to analyze. The MCP tools return structured data the agent can
reason about - "this component rendered 4 times because the `loading` prop kept
changing" or "this query fired twice with the same variables because the
reference wasn't stable."

The agent proposes fixes (add `React.memo`, stabilize a callback with
`useCallback`, memoize query variables) and verifies them by running the same
interaction again and comparing.

Future improvements: JSONL should move into DuckDB for arbitrary SQL queries
over the event stream. OTel integration and a visual dashboard would let humans
inspect alongside agents without having to ask for output.

## The Loop in Practice

```
Developer identifies problem class (e.g., slow interactions)
    ↓
Build verifiable harness (capture events, define success)
    ↓
Agent attempts fix with harness feedback
    ↓
Harness provides machine-readable diagnosis
    ↓
Agent iterates based on concrete data
    ↓
Problem resolved with measurable verification
    ↓
Harness can be reused for regression detection
    ↓
Developer tackles next, more complex problem
```

Better harnesses let you tackle harder problems. Harder problems require better
harnesses. It starts to compound quickly, especially as it combines with your
intuition about working with models.

## Review

At 159K lines added in a month, human review of every LOC is difficult to do
unassisted.

Tests help - 1,744 tests across 620 suites is a mitigating factor. But tests
verify intended behavior. They don't catch the emergent issues that harnesses
are designed for.

Harnesses add another layer: they verify outcomes dynamically and with more
nuance than binary pass/fail. They're especially helpful when using an agent as
a sparring partner to subdivide complex problem spaces. Cursor's debug mode is a
good example - you can iterate with the agent on a specific issue, with the
harness providing concrete feedback on whether each attempt actually improved
things.

Another technique: have agents draw component/sequence/architecture diagrams.
Have them spell out state machines and link them to desired behaviors described
in terse language. Good architecture leads to better intuition about how things
work and how we can verify they work. Code smell comes out immediately when you
look at a diagram side by side with a large PR. If the diagram looks wrong, the
code is probably wrong. After all, if you can't
[prepare a freshman lecture](https://kottke.org/17/06/if-you-cant-explain-something-in-simple-terms-you-dont-understand-it)
on the topic, you probably don't understand it.

This isn't solved. We need to actively work on this as a community.

## Practitioners vs. Influencers

The discourse around AI coding is polluted by two failure modes:

1. **Influencer nonsense** - Theo, ThePrimeagen, and others who take dramatic
   stances that flip based on engagement. "AI coding is dead" one month, "I
   stopped writing code" the next. The whiplash makes it hard to know what
   actually works.

2. **Marketing hype** - There's a rash of "beginner experts" deploying nowhere.
   You see the flame outs - people having their production databases dropped by
   agents - but you don't see people slowly dying under the weight of their own
   products. Even the AI labs have consistency issues with their deployed
   applications. Some of it is speed of development - if you're releasing 4-5
   major features every couple weeks like Cursor, you're going to break a few
   eggs. But parts of Anthropic's API console have been broken for weeks to
   months.

Armin Ronacher has been documenting his actual experience building production
systems with AI:

- "I still treat every line as my responsibility, judged as if I wrote it
  myself. AI doesn't change that."
  ([90%](https://lucumr.pocoo.org/2025/9/29/90-percent/))
- "I cannot stress enough how bad the code from these agents can be if you're
  not careful."
- "Most of my attempts didn't last, and I thought it might be interesting to
  share what didn't work."
  ([Agentic Coding Things That Didn't Work](https://lucumr.pocoo.org/2025/7/30/things-that-didnt-work/))
- "There is a big hidden risk with automation through LLMs: it encourages mental
  disengagement."

His "90%" post describes 40,000 lines of production Go/Pulumi/SDK code, mostly
AI-generated, but with constant emphasis on his responsibility for every line.
His "Things That Didn't Work" post catalogs failed automation attempts with the
same rigor you'd apply to a post-mortem.

From his posts:

- Talks about what didn't work
- Measures success by production operability
- Acknowledges the rough edges: limited context windows, context degradation,
  "poisoned" conversations
- Acknowledges failed and rotted tool experiments

His
[recent podcast appearance](https://x.com/mitsuhiko/status/2014343603905085915)
is worth the hour.

## High Skill Ceilings

Building a verifiable harness requires knowing what outputs matter. This means
first-principles understanding of the problem domain, intuition for what "good"
looks like before you can define success criteria, judgment to recognize when
the agent is going off the rails vs. making progress. Note, there is tremendous
overlap with the skills that make you a good engineering leader.

From [Foxes and Hedgehogs](/posts/foxes/):

> "You honestly spend 10 to 20 times longer, maybe even 100 times, getting
> something right and truly understanding it. You develop intuition through
> hands-on building and producing, gathering feedback..."

Experts have done that work. They've built the mental models. When they define a
harness that says "TTI < 500ms, single query wave, no spurious re-renders" -
they know why those thresholds matter, what violations indicate, and what to do
about them.

The harness encodes judgment, but someone had to have the judgment first. The
sheer fact that the API is shaped in a specific way influences outcomes. Agents
tend to optimize for what they're told to measure, and not much else.

Like any craft, there's deep intuition to develop. We're not limited by how fast
we can type anymore - we're limited by how clearly we can think about
architecture and how we can create situations where the outcome is guaranteed.
Problems go away when systems are designed correctly. They get easier to solve
as soon as you measure the correct thing. Micro-optimizations in the wrong area
don't make your product any faster, and the same is true for the agentic coding
loop. You learn about the bottlenecks by advancing your craft.

On the other side, I've experienced plenty of harness experiments that fail. The
process rots because it's more trouble than it's worth, or the tool use doesn't
actually make a material difference. But this is trial and error, and we're
building competency through hard use.

## When Not To Do This

Most problems don't require a verifiable harness. A naked Claude Code instance
will get you further, faster for many simple cases - which happen to be most
things in programming.

The harness approach makes sense when:

- You're building something fundamental and easy to get wrong (performance
  infrastructure, state management patterns)
- Success is measured by metrics that are hard to verify manually (render
  counts, query timing, interaction latency)
- The behavior is hard to quantify and easy for an agent to misunderstand
- You'll encounter the same problem class repeatedly and want to encode the
  solution criteria

If the agent can verify success by running the code and checking the output, you
don't need additional infrastructure. The overhead of building harnesses isn't
free - it's only worth it when the problem class justifies the investment.

## Closing

Sound software design and architecture removes problems. Once you have that firm
base to stand on - and can verify something experientially and interactively -
domain-specific tools close another gap.

---

## TL;DR

- Terence Tao's recent work shows the pattern: AI generates, formal language
  (Lean) verifies, errors are caught automatically
- Verifiable harnesses let agents iterate on complex problems (React
  performance, distributed systems) with concrete feedback
- January: 23 PRs, 159K lines added, 1,744 tests, 91% merged
- The review problem is real at this volume - managing it through risk
  stratification, test coverage, LLM-assisted review, and verifiable outputs
- Practitioners like Armin Ronacher vs. influencers with dramatic
  stance-flipping - the difference is in what they share about failures
- Experts succeed because building harnesses requires first-principles
  understanding of what to measure
- The skill ceiling is high; these tools amplify existing skill, they don't
  replace it

---

## References

[1]
[Terence Tao on Erdős problem #728](https://mathstodon.xyz/@tao/115855840223258103) -
AI-solved proof formalized in Lean

[2]
[Dario Amodei & Demis Hassabis: The Day After AGI](https://www.youtube.com/watch?v=02YLwsCKUww) -
Discussion on AI self-improvement loops

[3] [Throughput Reconsidered](/posts/throughput-reconsidered/) - Previous post
on AI-assisted coding methodology

[4] [Foxes and Hedgehogs](/posts/foxes/) - On specialists vs. generalists and
the importance of deep understanding

[5] [90%](https://lucumr.pocoo.org/2025/9/29/90-percent/) - Armin Ronacher on
40K lines of AI-generated production code

[6]
[Agentic Coding Things That Didn't Work](https://lucumr.pocoo.org/2025/7/30/things-that-didnt-work/) -
Armin Ronacher on failed automation attempts

[7]
[If you can't explain something in simple terms](https://kottke.org/17/06/if-you-cant-explain-something-in-simple-terms-you-dont-understand-it) -
Feynman's freshman lecture test
