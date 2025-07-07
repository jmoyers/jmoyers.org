---
title: "Stanford compilers"
date: "2016-06-05T07:03:09.000Z"
featured: false
draft: false
tags:
  [
    "stanford",
    "compilers",
    "into-the-hardware",
    "lexer",
    "parser",
    "git book",
    "lecture notes",
  ]
---

Welp, still on the journey down to the hardware. Now that I've got the
[nand2tetris](http://jmoyers.org/built-a-computer/) class on building a computer
from nand gates out of the way, its time to dive into compilers.

**Update** 2019: Looks like this coursera link is dead, I'm sure the course can
be found though!

I've decided to take
[Stanford's Coursera offering](https://www.coursera.org/course/compilers),
though I've got a few reservations about it.

- First, it focuses quite a lot on formal definitions of languages and grammars.
  This means its using set notation and big unwieldy greek characters.
- Second, its using flex and bison to generate a lexer and a parser in c (and
  they have java versions). I would much rather generate one by hand to learn
  the algorithms involed (maybe on a smaller subset of the language, transition
  into generators).
- Third, the course material is offered in a VM, with no other way to get at the
  course material. There are interdependent makefiles, and seemingly no way to
  compile the tools from source. Man, I hate doing work in a shell thats not
  mine on a shitty Ubuntu desktop.

However, it seems to be the best course on the material out there, so I'm going
to slog through.
