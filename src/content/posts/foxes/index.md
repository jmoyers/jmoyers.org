---
title: "Foxes and Hedgehogs"
date: "2025-08-09"
tags: ["posts", "ai", "software-development", "productivity"]
---

There are people in the industry and perhaps in your organization that have a lot of context. They have good judgment, they have reasonable design sense, they know a lot about your product, the market fit, the ideal customer profile. They understand the competitive landscape - who the different players are, what they're doing, where the opportunities lie. And on top of all that, they may also be high-end software developers.

Recently, I was watching an interview with Terence Tao [[1](https://lexfridman.com/terence-tao)], who's an Australian-American mathematician. He's a Fields Medal winner, and he's a professor of mathematics at UCLA. One of the things he was talking about is the concept of foxes and hedgehogs. Foxes are capable of looking at many topics and having a reasonably deep understanding, but they're certainly not masters at the edge of every field they touch. They are masters of connective tissue. They're masters of taking concepts from one area and applying them in a new field. And this connective tissue is really important for forward progress. A hedgehog is somebody who can go extremely deep within a field or two, and you're kind of trading off between specialization and the ability to generalize. 

We absolutely need both types of individuals, right? We need hedgehogs to push the boundaries of specific fields and advance our understanding of the world. But I also feel that a very skilled fox now has the ability - at least within the domain of building software - to take their relative mastery of many domains and apply it with a singular focus, pushing the product forward by leaps and bounds very quickly.

So what inhibits impact? The traditional way of writing software is extremely labor intensive. The number of lines of code on average has been going up substantially as the tools get better, as the industry gets more mature over time, but in general, we're talking between hundreds and on the outside, thousands of lines of code per week.

There are many arguments to keep this number relatively small. Everything from code quality and writing code that matters takes time to the fact that 70-75% of software development is maintenance cost over time. So writing crap code really quickly generates a disproportionate amount of negative inertia in your product and in your company over time.

Prior to the change that we've seen in the last two to three months with agentic tooling advancing, the best way to scale your impact on the organization was to go down one of a few fairly well-defined tracks. One thing you could do is become a staff engineer and focus on driving technical change and technical direction through an entire engineering organization as it scales up. This is an extremely valuable skill. You have disproportionate impact beyond yourself that affects the development of hundreds to thousands to tens of thousands of developers, depending on the scope of your contribution and the size of the company.

Another way is to focus on building teams and attracting the best talent and on systems design at the organizational level and on really good people management. This is another intensely multiplicative way to drive impact on your product and to build value in your business. Because as you build scalable structures and attract the best talent, you are in turn building better and better product that fits the market better. And as long as you are careful about your focus, you're going to be driving a tremendous amount of enterprise value over time. This is the traditional sort of VP Engineering, CTO style route.

However, companies take time to build. It takes time to grow revenue. In all but the most unicorn cases, let's say between 40 and 60% growth is deemed to be very high. And over time, over the course of years, you're building a very successful company that has $100M+ exit.

When you're doing this, you really have to be somewhat cautious of the cost constraints, right? So you're trying to keep your burn multiple low, so you can't just grow in an unbounded way unless you've created sort of like a hypergrowth frenzy style environment. And let's be honest, most startups are not that. They are solving a practical problem in a medium growth space and they can't just hire in an unlimited fashion.

So for this sort of messy middle style of organization where you're building sustainably, solving real problems in the real world, creating enterprise value, your team ends up being relatively constrained. Let's say between two and four teams of developers of between five and seven hands-on keyboard engineers. And that changes over time, but in a very incremental way, assuming you're not having some sort of B2C viral takeoff or you haven't cracked the code of hypergrowth.

What this means is the high context individual can only have impact insofar as they're allowed to grow within the cost constraints that they've established. So your total impact across your organization is limited by the total headcount and the problem you're trying to solve and the direction you're trying to go in.

What I think is emerging is potentially a third track. Somebody who's extremely high context, who maybe has the skills of a high-end IC, who hasn't left the technology behind, who can still code quite well, might even be a code machine archetype where they're able to put out a tremendous amount of code becomes uninhibited [[2](/posts/throughput-reconsidered/)] by how quickly they can type on the keyboard.

The last three months has produced a ton of advancement in agentic coding - Claude Code [[3](https://www.anthropic.com/claude-code)], Cursor [[4](https://cursor.com/)] and its 1.0 release [[5](https://devclass.com/2025/06/06/cursor-ai-editor-hits-1-0-milestone-including-bugbot-and-high-risk-background-agents/)], MCP servers and the MCP protocol [[6](https://modelcontextprotocol.io/)]. 

From a model perspective, the industry's been extremely focused on the software developer as an early adopter, and that's resulted in models that are extremely good at coding. I'm talking about Opus 4.1 [[7](https://www.anthropic.com/news/claude-opus-4-1)] on the high end, Sonnet 4 [[8](https://www.anthropic.com/claude/sonnet)] on the lower end as far as a workhorse model goes - a little bit more cost-effective to run. And now that GPT-5 has been released [[9](https://openai.com/index/introducing-gpt-5/)], we potentially have a new third option. 

The benchmarks really don't tell the entire story, but SWE-bench [[10](http://www.swebench.com)] is one example. The tool use benchmark TAU [[11](https://github.com/sierra-research/tau-bench)], computer use benchmarks [[12](https://github.com/xlang-ai/OSWorld)] for general testing, and long context window test benchmarks like RULER [[13](https://github.com/NVIDIA/RULER)] and InfiniteBench [[14](https://github.com/OpenBMB/InfiniteBench)] are extremely important as well. Sites like Artificial Analysis [[15](https://artificialanalysis.ai/)] aggregate all models across many benchmarks and show how the relative cost compares to their potential output.

You have to look at these benchmarks as a guidepost, but then it really does come down to actually experiencing them within the tools to understand if they're going to fit the needs of your particular programming style. Sometimes a model does extremely well on advanced reasoning benchmarks and then fails completely at some simple coding tasks. It's a little bit difficult to pinpoint exactly what's going on. It could be tool use. It could be software engineering use cases not being in the training set and the human reinforcement feedback part. 

I think the abilities that models develop along different vectors - as measured through various benchmarks - interact in non-linear ways that aren't always obvious. For example, if a model excels at coding but struggles with long context windows, it's going to have a very difficult time understanding a large codebase or a problem that's connected to many conceptual areas within your codebase. If it's bad at tool use, it's going to have a difficult time utilizing semantic search to make the intuitive leaps - or what we think of as intuitive leaps - that humans make to go find specific concepts within the codebase. This matters for making sure you're being DRY, not reinventing concepts that are already solved elsewhere, following standards in your own codebase, and so on. Hat tip to Anthropic's research around interpretability [[16](https://www.anthropic.com/news/golden-gate-claude)] - I think it's extremely important for the industry to understand why and how emergent behavior is happening.

Think of where we were a year ago compared to now. It's no longer single one-shot chat interface style editing, but rather very extended multi-shot, think-time compute-driven, rule-building, sub-agentic processes. The tooling in software development has gotten so much more advanced than almost any other field, and these tools are building up this massive ability to amplify your own impact.

These high-context individuals who may have previously gone down a fairly narrowing track to scale their effectiveness across an organization now have to measure their opportunity cost in a different way. They need to look at evolving new structures around themselves to uninhibit their throughput so the organization can take advantage of how much these individuals can produce in a short amount of time.

The practical problems really end up being several things. How quickly you can ideate is one such problem, upstream of software development. Another problem is how quickly you can actually do QA processes that make sure that the code that you're developing services all the edge cases. The user interface is hardened. Your back-end processes are hardened. You have good security controls in place, and you're trying to do the standard penetration test style stuff.

It's relatively easy to set up sub-agents for writing unit tests and integration tests, but it's relatively difficult even now to write extensive Playwright tests that verify UI functionality. The main problem is that the tool use benchmarks plus the computer use benchmarks show that even the best models that have the best spatial awareness struggle with operating a UI very well. What this means is that the loop for doing UI verification is pretty slow. And even now, I still have to hybridize it with a lot of manual processes, walking through Playwright tests by hand. In general, I feel that that loop for writing end-to-end integration tests and verifying functionality is something that agents really still struggle with. I want to be clear, this is a temporary problem, though.

Actually having an organization that can be the catcher's mitt for this volume of code - vetting it appropriately - is very difficult. We as an industry really can't let go of code review. It makes sense to use agentic tools to help, but not as the only vetting step. I say this a lot in my own organization: the first code review should be yourself, especially when using AI-driven tools. You should be doing a full PR review relatively unassisted, looking for inconsistencies, bugs, leftover code, dangling references, things that need to be DRYer. 

Even with the most frontier models and top-of-the-line coding tools, you're still going to have to rework somewhere between 50 and 70% of the code - conceptually, structurally, and so on. And even after doing this rework yourself as the first line of defense, your organization's going to have a very difficult time using traditional methods to handle the sheer volume you're producing.

I'm not exactly sure what the implications of all this are, just that we really need to pay attention to it. One conclusion I think that's pretty self-evident is that the ratios in the industry are going to change when it comes to the style of employee that makes up a good product pod over time. Previously, you might get away with a relatively small number of product managers and product designers or a combination thereof versus total developers. But I think at least in the face of the current tool maturity in software development versus those in design and product management, I think there's an argument to be made for more people examining what to build next, how to build it and how to build it well versus the total number of developers. Another option is that the employees that become the most valuable are hybrids - where you have a pretty darn good sense of where the product needs to go, how it needs to look and feel, and you're also capable of building the thing.

The danger is we get diluted in all professions and do things worse. The upshot is when you have over-specialization in an organization over time, there's a ton of "make work" that starts to happen, especially as the product matures. An example is you might see a very successful product like Netflix change very, very little over time. And yet we have tens of thousands of people working on problems that never see the light of day. We're A-B testing 0.5% changes, and maybe something like 2% of the changes over time get into the product. They're trying to preserve value rather than to innovate and push the frontier. In a startup, you're much more of a spear tip that's advancing the product by leaps and bounds every time you create something new. And they're two very, very different muscles. And I find that, especially in startups, this fox metaphor is super important because those people are going to have a ton of agency to create a lot of value much more quickly than before. 

There are multiple careful lines to be walked here. You need to produce a good amount of software surface area while maintaining high quality. You can't allow your organization to lose the spirit of making good, professional, delightful products that solve real problems.

Also it may not be clear, but Terence Tao considers himself a fox. In a way, this is pretty hilarious, since he's gone deeper than almost anyone else in the world in almost all fields of math, let alone the ones he specialized in. So, this is all by degrees in reality. I don't consider myself a vibe coder. I don't consider myself an executive that's removed from the actual process of making software. I consider myself somebody who, at a point in his career, went all the way down to the metal, including learning assembly language and how to unroll loops from compiled code and optimize for specific architectures, and then I've abstracted up and abstracted up and abstracted up over time and taken on management, gone back and forth between principal engineering and engineering management over the course of my career.

So I guess what I'm advocating for is to spend time being both archetypes - hedgehogs and foxes. Treat this as zooming in and zooming out. Being able to mode switch quickly makes you a better communicator, makes you a better thinker. It helps you connect dots in the sense that lateral thinking becomes more second nature to you over time. 

It's especially important early in your career to go as deep as you possibly can to attain mastery, even if it's not something you're professionally focused on, to get to the edge of that field. For one thing, this positively impacts your imposter syndrome. And for another, it gives you this credibility - not just in others judging you, but in you judging yourself - to know that you're not blowing smoke.

Another way to think about this is that you honestly spend 10 to 20 times longer, maybe even 100 times, getting something right and truly understanding it. You develop intuition through hands-on building and producing, gathering feedback, and then overcoming that difficult inertia to share something personal with the world. This is essentially Scale AI founder Alexandr Wang's [[17](https://alexw.substack.com/p/do-too-much)] philosophy - that the way to build products really well is to care more than others. He only hires people who care more than others. It's invisible work, but it's what separates great from good.

Something that I tell my direct reports a lot of the time is that it may seem like certain individuals in the space or in the industry or in the world in general seem to have instantaneous results that are extremely high quality. This is almost always complete nonsense. They're just spending 10 to 100 times more time behind the scenes - perfecting something, caring about something, thinking about something in the shower, wrestling with the ideas. And then actually making things. And what you're seeing is the five-minute demo, the 10-minute demo, the 10-minute talk that comes from those hundreds and thousands of hours.

We're in an exciting era. I'm feeling like I'm able to continuously evolve week over week, and it feels like a lot of powerful and engaging personal growth comes from that. I'm looking forward to the next little while.

---

## References

[1] [Terence Tao: Lex Fridman Podcast #472](https://lexfridman.com/terence-tao) - Discussion on foxes vs hedgehogs in mathematics and problem-solving

[2] [Throughput Reconsidered](/posts/throughput-reconsidered/) - Analysis of AI-assisted coding productivity and its implications

[3] [Claude Code](https://www.anthropic.com/claude-code) - Anthropic's official command-line interface for AI-assisted coding

[4] [Cursor](https://cursor.com/) - AI-powered code editor built on VS Code

[5] [Cursor 1.0 Release](https://devclass.com/2025/06/06/cursor-ai-editor-hits-1-0-milestone-including-bugbot-and-high-risk-background-agents/) - Milestone release including BugBot and background agents

[6] [Model Context Protocol](https://modelcontextprotocol.io/) - Open standard for connecting AI systems with data sources

[7] [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1) - Anthropic's state-of-the-art coding model with 74.5% on SWE-bench

[8] [Claude Sonnet 4](https://www.anthropic.com/claude/sonnet) - Anthropic's cost-effective workhorse model for daily coding tasks

[9] [Introducing GPT-5](https://openai.com/index/introducing-gpt-5/) - OpenAI's unified AI model combining reasoning and fast responses

[10] [SWE-bench](http://www.swebench.com) - Benchmark evaluating LLMs on real-world GitHub issues and code fixes

[11] [TAU-bench](https://github.com/sierra-research/tau-bench) - Tool-Agent-User benchmark for evaluating AI agents in realistic conversations

[12] [OSWorld](https://github.com/xlang-ai/OSWorld) - Computer use benchmark for evaluating AI agents controlling desktop applications

[13] [RULER](https://github.com/NVIDIA/RULER) - NVIDIA's benchmark for evaluating long-context modeling capabilities

[14] [InfiniteBench](https://github.com/OpenBMB/InfiniteBench) - Benchmark for evaluating LLMs on 100K+ token contexts

[15] [Artificial Analysis](https://artificialanalysis.ai/) - Comprehensive comparison of AI models across benchmarks and cost-effectiveness

[16] [Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude) - Anthropic's interpretability research on understanding and controlling AI features

[17] [Do Too Much](https://alexw.substack.com/p/do-too-much) - Alexandr Wang's philosophy on caring more to build great products
