---
title: 'Building a computer from nand gates 🔨'
date: '2016-06-04T09:24:03.000Z'
featured: false
draft: false
tags: ['nand2tetris', 'rust', 'handmade', 'assembly language', 'assembler']
---

- Course: [http://nand2tetris.org/](http://nand2tetris.org/)
- My Computer (hdl):
  [https://github.com/jmoyers/nand2tetris](https://github.com/jmoyers/nand2tetris)
- My Hack Assembler (rust):
  [https://github.com/jmoyers/hack_assembler](https://github.com/jmoyers/hack_assembler)

So I was able to build a baby computer in a hardware simulator. I learned quite
a bit about how CPU's are designed and how they interact with machine code and
assembly language. Finished this 6 week course in 5 days due to binge (🌙).

I was able to write an assembler in about 500 lines of code including some
static lookup tables. This assembler targets the "hack" computer, which is the
name the course gives the architecture. This means that it was significantly
simpler than your typical CPU, but it was also pretty glorious to learn on.

In this process, I also learned the basics of the
[Rust](https://www.rust-lang.org/) programming language for my assembler. This
is not part of the course and just a result of self-study, but I'm having fun
with it so far. This deserves a post of its own.

The course culminated with using your had written assembler to produce machine
code for a program that runs pong on the newly minted device. Hilariously, the
assembly from the un-optimized pong game was something like 28k lines of code
([asm](https://github.com/jmoyers/hack_assembler/blob/master/tests/Pong.asm)),
which boils down to about 27k individual instructions
([hack](https://github.com/jmoyers/hack_assembler/blob/master/tests/Pong.hack)).

As you can see, the assembly instructions in this particular language are
essentially 1-to-1, sans labels, so it was fairly easy to parse and then
generate the machine instructions. Another hilarious quirk is that the hardware
simulator accepts ascii machine code files (so you see ascii 0's and 1's in the
output files) presumably for debug-ability. In reality it made the assembler a
tad more complex due to dealing with moving to and from string representations
and such.

Overall, it felt pretty cool and enormous and I wish I had done something like
this much sooner. Going on to Stanford's
[Compilers](https://class.coursera.org/compilers-004) course.
