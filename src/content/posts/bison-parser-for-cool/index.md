---
title: "Stanford compilers: bison parser for Cool"
date: "2016-06-11T14:26:29.000Z"
featured: false
draft: false
tags:
  ["stanford", "compilers", "lexer", "parser", "education", "myparser", "bison"]
---

Completed assignment #2, which is a Bison Parser for cool. I posted this project
on github ([here](https://github.com/jmoyers/cool-parser)), which includes a
makefile for OSX.

Honestly, there weren't too many gotchas to this project. The most difficult
things to figure out were the required AST (abstract syntax tree) operations
that were expected given the library provided by the course. I got most of this
just by examining the
[cool-tree.aps](https://github.com/jmoyers/cool-parser/blob/master/course/cool-tree.aps)
file directly. In fact, this file acts as a decent outline for how to approach
each non-terminal expression you need to develop. Take special note of the
"lists" vs the "singular" case that is shown for classes in the skeleton file,
this pattern is used everywhere. Also take special note of `nil_{Class}` methods
for rules where an optional part is present. Lastly, `no_expr()` is a special
case for if/else where the else expression isn't present. Took me a while to
figure out, as there was no `nil_Expression` variant.

Oddities in the language:

- Take a special look at how the case expression actually works. Different from
  other languages.
- SELF_TYPE is a special COOL specific concept
- `expression`, `expression_block`, `expression_list` have some odd overlaps,
  and interact with `;` terminators in special ways. Semicolons aren't a
  universal terminator like in many languages.
- Static dispatch syntax is odd and based on `@` -- not actually sure about the
  semantics with this one, but it seems to be very similar to Javascript
  functions with alternate `.bind(obj)`ings.

**Shift/Reduce Conflicts**

You will inevitably run into shift/reduce conflicts in the parser. This means
that two grammar rules you've added overlap (usually one is shorter than the
other, so there is a choice as to whether the parser should go with the shorter
or longer match). Your parser will likely just work properly in most of these
cases, because bison defaults to shift -- however, you can get rid of them
[with appropriate precedence declarations](http://www.gnu.org/software/bison/manual/html_node/Non-Operators.html#Non-Operators).
These are also handy for making sure normals maths operator precedence is
honored. Math precedence issues result in a incorrected rooted tree -- pay
special attention when you're testing to make sure the right operator is at the
root of a compound arithmetic expression.

Its best to look at the shift/reduce issues **as soon as they come up** because
either Bison's output on the matter is extremely terse (just tells you the
number of conflicts) or EXTREMELY verbose, printing out the entire state machine
in all its glory. I found the easiest way for me to figure out what was
happening was to literally remove each rule and see if it was causing the
conflict. Very dumb, time consuming way to do it, and I wish I had noticed the
shift/reduce conflicts printing out in the compiler noise when I was developing
it. These tools are old.

**Build and Test**

I am finding the VM increasingly tiresome. I dislike the Linux distro they have
based it on, and really don't like having a janky version of vim without my
dotfiles. So I moved things to my OSX machine through manually rewriting the
Makefiles. Its crappy, but it
[works](https://github.com/jmoyers/cool-parser/blob/master/Makefile).

For testing, I modified `myparser` to do
[two new things](https://github.com/jmoyers/cool-parser/blob/master/myparser).

- Start the lexer parser chain with GDB attached. This isn't very tricky, but
  due to the use of pipes we have to create a temporary file.
- Run the same test with the reflexer and refparser. This is very useful for
  comparing your parse tree to the reference.

Unfortunately the source isn't publicly available for the refparser/reflexer
(for obvious no-cheaty-type reasons), but this means I could not do this once I
moved off the VM. So I periodically went back and checked if things were kosher.

**Final Thoughts**

If I had an infinite amount of time, I would definitely write unit tests for
every single grammar rule. As it stands now, this ad-hoc testing is only good
enough for learning purposes, and not for any real world application. I wish the
course provided a red/green unit test environment for developing this, or at
minimum a series of test files that you should increasingly be able to parse. As
it stands, you're left to your own devices with the language manual and the
example files directory (which isn't organized in any real systematic way with
regards to implementation).

**Main Parser**

<script src="https://gist.github.com/jmoyers/6a2c63a42726846a53a4a2ca3ec97b0e.js?file=cool.y"></script>
