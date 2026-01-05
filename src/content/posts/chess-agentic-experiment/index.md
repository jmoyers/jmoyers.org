---
title: "Can Agents Help Analyze Chess Openings?"
date: "2026-01-05"
tags: ["posts", "ai", "agents", "chess", "software-development"]
---

<video controls preload="metadata" style="width: 100%; max-width: 100%; border-radius: 8px; margin-bottom: 2rem;">
  <source src="demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

I built a research project this weekend at the intersection of chess and frontier models. Not to play chess - agents and LLMs are getting eerily competent at that - but to explore whether they can help you understand openings, themes, attacking plans, and positional concepts through an interactive coaching interface.

The core idea: build an agent harness with access to all the tools a chess player uses when studying. Stockfish [[2](https://stockfishchess.org/)] for deep analysis. The Masters database (2.7M over-the-board games). Lichess API [[3](https://lichess.org/api)] (80M online games). A local explorer with indexed games for instant queries.

## Why Build This?

The goal isn't to replace master instruction - that would be foolish. Titled players provide structured teaching content, and supporting their work is valuable for the chess community. Chess requires tremendous focus, and these masters have put their lives into analyzing this game.

However, a grandmaster's brain works very differently from your average chess.com player. Lots of steps get skipped. Assumed knowledge pervades the instruction. When I'm looking at a position, I probably need twenty or twenty-five more questions than a titled player to understand what I'm seeing.

I'm somebody who's not very good at chess, but I'm fascinated by the strategy. I love understanding why an idea succeeds, not just memorizing a move order within a specific variation. So there's interesting self-inquiry here: can an agent with proper tooling fill the gap between high-level teaching content and a learner who needs more context?

## The State of LLM Chess

A year ago, most LLMs struggled to achieve positive Elo ratings. Many couldn't reliably outperform a random move generator, frequently producing illegal moves or failing to follow game instructions.

Maxim Saplin's LLM Chess project [[1](https://maxim-saplin.github.io/llm_chess/)] has been rigorously tracking this progression, benchmarking models against both a random player and the Komodo Dragon chess engine to produce Elo-anchored ratings. The results show a clear inflection point:

> | # | Player | Elo |
> |---|--------|-----|
> | 1 | Magnus Carlsen | 2941.0 |
> | 2 | Class C player | 1500.0 |
> | 3 | gemini-3-pro-preview | 1033.7 |
> | 4 | gpt-5.1-medium | 947.5 |
> | 5 | gpt-5-low | 858.2 |
> | 6 | gpt-5.2-low | 782.5 |
> | 7 | o3-medium | 777.6 |
> | ... | ... | ... |
> | 11 | **Average chess.com player** | **618.7** |
> | ... | ... | ... |
> | 15 | claude-opus-4.5 (thinking) | 446.1 |

The top reasoning models have now surpassed the average chess.com player. Gemini 3 Pro sits at 1033 Elo - comfortably above the 618 Elo average. Meanwhile, many 2024-era models still show negative Elo, unable to reliably beat random play.

This matters because tool access changes everything. The agent doesn't need to calculate lines - it can query Stockfish. What it needs is the ability to explain with access to statistics and examples. And that's a fundamentally different skill than raw chess ability.

## The Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (React + Vite)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Board Component     │  Interactive chessboard with drag-drop, annotations  │
│  AgentDrawer         │  AI chat with streaming, tool indicators, Q&A        │
│  Side Panels         │  OpeningSelector, MoveTree, AnalysisPanel            │
│  Zustand Stores      │  Connection, Board, Conversation, Explorer, Analysis │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                           Socket.IO (WebSocket)
                                      │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVER (Node.js + Express)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ChessManager        │  chess.js wrapper for move validation, FEN/PGN       │
│  AgentHarness        │  Agentic loop: planning → tool calls → streaming     │
│  AI Providers        │  Anthropic, OpenAI, Google with extended thinking    │
│  Tools (25+)         │  Board, visual, database, engine, teaching           │
│  Database Layer      │  Lichess API, local LMDB explorer, opening library   │
│  Stockfish Engine    │  UCI protocol, streaming multi-PV analysis           │
└─────────────────────────────────────────────────────────────────────────────┘
```

The server has no traditional REST transport - it's all Socket.IO for real-time state synchronization. The agent manipulates the board, draws arrows, highlights squares. This shared canvas collaboration is essential for the teaching paradigm to work.

## What the Agent Has Access To

⪼ **Stockfish integration** with streaming multi-PV analysis. When the agent queries engine evaluation, it gets depth 20+ analysis with the top five variations. You can watch the numbers update in real-time as Stockfish deepens its search.

⪼ **Masters database** - all over-the-board games since we started recording them. 2.7 million games of grandmaster-level play.

⪼ **Lichess API** - 80 million online games with aggregate statistics. Win rates, draw rates, most common continuations at every position.

⪼ **Local explorer** - I downloaded all PGN files from December 2025 and rebuilt the cumulative statistics index locally. This makes queries instantaneous and lets me research without hammering external APIs.

⪼ **25+ agent tools** - board manipulation, visual annotations (arrows, highlighting), database queries, teaching aids. The agent can set up positions, demonstrate variations, and annotate as it explains.

## Testing on the Jobava London

I picked an opening I know reasonably well: the Rapport-Jobava London. It's a solid system with some interesting beginner traps and clear attacking plans. Perfect for testing whether an agent can explain concepts coherently.

The classic trap involves a knight fork threat on b5. If Black ignores it and plays passively, White gets Nxb5 threatening Nxa7+ forking king and rook. The bishop on f4 protects against Qxb5. Anyone above low ELO spots this quickly, but it's a great test case.

I asked the agent to explain the system, and it correctly identified:
- The e4 pawn break as a key plan
- The knight outpost squares in the center
- The early Nb5 attacking ideas

But it struggled with some nuances. When I asked it to show what happens when Black falls for the trap, Gemini 3 Pro didn't demonstrate it as cleanly as I'd hoped. It highlighted the right squares but missed the chance to walk through the full tactical sequence.

Interestingly, Claude Opus 4.5 - which has a lower chess Elo - proved to be a slightly better teacher in the opening phase. It's much better at using tools correctly and explains concepts more clearly. However, towards the middle game, without additional prompt or context tuning, Opus started losing the thread - proceeding into what it called "typical lines" without first evaluating Stockfish or checking move popularity in the databases. There's a fascinating disconnect between raw playing strength and teaching ability, and clearly more work to be done on sustained coherence.

## Observations

**Real-time shared state is essential for agentic UIs.** The agent needs to manipulate a shared canvas with the user. This requires WebSocket-based real-time synchronization. If you're building agent-first applications, invest in this infrastructure early. There was a conference in San Francisco recently focused on "syncing engines" - I think this is foundational technology for the next generation of applications.

**Tool use matters more than raw capability.** Opus 4.5 teaches better than Gemini 3 Pro despite weaker chess understanding. The ability to orchestrate tools effectively, explain while demonstrating, and structure a teaching session - these are distinct skills from game-playing strength.

**Extended thinking + tool calls get expensive fast.** I budget 32K tokens for the planning phase, then execute with a lower token budget. Even so, costs can spiral if you go maximum think time, maximum tokens. The agentic loop runs up to 20 iterations, and each iteration burns through the budget.

**Notation in long conversations is hard to read.** Chess notation embedded in paragraphs of text is cognitively taxing. A voice interface would help tremendously - though it would need snappy, non-procedural responses. Not the goofy style of the chess.com coach.

## What Would Make This Better

A few things would push this from "interesting research" to "actually useful":

- **Tactical analysis preprocessing** - a one-pass computation identifying which pieces are vulnerable, which are over/under-defended, where weaknesses exist on the board. Give this to the agent as context before it explains.

- **Pawn structure analysis** - identify interesting pawn breaks, weak squares created by pawn structure, and thematic plans that arise from the structure.

- **Voice interface with fast responses** - dictating questions and hearing explanations would be much more natural than typing chess notation.

- **Inline notation rendering** - imagine hovering over "Nxb5" and seeing the move animated on a mini-board.

## The Broader Takeaway

This project reinforced something I've been thinking about: if you're building agent-first applications where an AI manipulates a shared workspace with a human, you need real-time transport and shared state. Maybe conflict resolution if you're dealing with multiple parties.

The agent working on a shared canvas with you - that's the paradigm. And the tools and infrastructure we build to enable that paradigm will define the next generation of AI applications.

This was about eight hours of work. I used Playwright for end-to-end tests with low-cost model alternatives, set up mocks to avoid hammering Lichess APIs during testing, and verified functionality by hand as I went. My primary coding model was Opus 4.5, started from an architecture diagram, and let the agent get surprisingly far before I had to intervene on abstractions.

[View the source on GitHub](https://github.com/jmoyers/chess-agentic-experiment)

---

## References

[1] [LLM Chess Leaderboard](https://maxim-saplin.github.io/llm_chess/) - Maxim Saplin's ELO benchmarking for evaluating LLM chess capabilities

[2] [Stockfish](https://stockfishchess.org/) - Open-source chess engine, GPLv3 licensed

[3] [Lichess API](https://lichess.org/api) - REST API for querying opening statistics from Masters and Lichess databases

