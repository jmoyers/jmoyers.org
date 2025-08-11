---
title: "The Elements of Computing Systems"
date: "2016-05-29T09:23:44.000Z"
featured: false
draft: false
tags:
  [
    "hardware software interface",
    "nand2tetris",
    "boolean algebra",
    "nand",
    "kernel",
  ]
---

- Coursera:
  [https://www.coursera.org/learn/build-a-computer](https://www.coursera.org/learn/build-a-computer)
- Original Site:
  [The Elements of Computing Systems](http://www.nand2tetris.org/)

This course is run by some guys from the Hebrew University of Jerusalem. Its
about building a computer from nand gates in a hardware simulator, building an
assembler, programming language and a kernel from first principles.

So far its been very interesting and informative - I've made it through to the
third project in about 2 days or so of work. I posted this in their forums as a
suggestions, but the only thing that caused a bit of churn for me was trying to
remember much about boolean algebra -- this is the first principle behind taking
a nand gate and progressively building up to an arithmetic logic unit in a CPU.
They spend a bit more time of the tools they use (hardware description language,
hardware simulator) than they do on deriving the implementation of the chips
from the nand gate itself. This didn't stop me from completing the assignments,
since after twisting and turning a bit its not much more than algebra and a few
key "ah ha" moments. But, it does potentially stop someone who isn't familiar
with computer science from picking things up, which I think should remain a
goal.

One of the surprises, thinking about this, is how effective this teaching method
could be for someone who wants to learn from the hardware up. This is not
typically the way computer science is taught. All intros that I am aware of, as
well as into later stages of learning are more about languages, data structures,
algorithms and specifics of technologies (web apps, browsers, html, etc). I
really do wish we took a more holistic approach to this learning process.

This is especially prevalent among self-learners, which are more and more common
these days in the industry. We tend to ignore the inner workings of the machine
in favor of building something tangible (which is not necessarily a bad thing),
but then later in your career you may find yourself wanting of knowledge and not
necessarily sure about the swiftest path to attaining it. Anyway, this is
basically the journey I am on (getting closer to the hardware), though I have
spent a ton more time around c, c++, and assembler than your average web app
nerd. So far, this class is a nice stepping stone on the path.

One thing that was disappointing, but not totally unexpected, is that they don't
focus so much on the actual hardware implementation of the abstract chips they
are building. It would be really nice to have an appendix or optional path that
focuses on an overview of the most current forms of these technologies and how
they have optimized things over time. They only spend a few moments on these
questions (basically a random question from the 'audience' at the end of each
section). You have to simplify and focus on the end goal if you're to complete
something like this in a matter of weeks. However, its a little frustrating not
knowing just how different their 'ram chip' is from real world DDR3 RAM that
you'd stick in your machine today.

Overall, really good things to say about this course so far, and I'm looking
forward to finishing it.
