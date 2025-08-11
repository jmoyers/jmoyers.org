---
title: 'Fork() Is Weird'
date: '2016-05-27T14:08:49.000Z'
featured: false
draft: false
tags: ['fork', 'unix', 'CreateProcess', 'copy on write', 'exec']
---

Update 2019: Coursera killed every course permalink. ???

I was working through [lecture 59 of the UW hardware software interface
course](https://class.coursera.org/hwswinterface-002/lecture/59) and got
interested in the origin of the fork-exec model for process management.

In case you didn't know,
[`fork`](<https://en.wikipedia.org/wiki/Fork_(system_call)>) is a way of
creating a process in Unix-like systems. I have known this for a long time. I
never really thought about how it works, though.

It turns out, what it does is create a 'copy' (optimized to copy-on-write later
on) of the existing program and returns the new process id for the child. It's
sister function [`exec`](<https://en.wikipedia.org/wiki/Exec_(system_call)>)
allows you to overwrite the process with a new one (to replace the program and
its data with a new program and data).

This was historically the only way to create a new process on Unix-like systems.
What a weird thing to wrap your head around if you're unfamiliar with the
philosophy or the history. It seems to make sense that you would want to be
allowed to create an empty process and load it whatever program you'd like to
run without making a copy of potentially large program and program state to do
so. In fact, this is what Windows does with
[`CreateProcess`](<https://msdn.microsoft.com/en-us/library/windows/desktop/ms682425(v=vs.85).aspx>)
and why I think people get pretty confused if they are approaching Unix-like
systems from the outside.

Some posts on the subject emphasize that this is Unix philosophy -- build one
function that does something well for many use cases and re-use it. Because the
forked processes inherit the entire state of the previous process (open file
descriptors, data, etc), it is seen as very efficient for certain cases. Take
Google Chrome created processes for each of the tabs it renders. These are
essentially copies of all the same code and data structures associated with
housing a web page and rendering it, but isolated from each other so as to be
tolerant of crashes and hangs in individual tabs. For this use case, it makes a
ton of sense to make a copy of an existing process, because there's a lot you're
going to re-use there.

As for efficiency, it turns out the 'copy' that is made is essentially a pointer
initially, and then if any writes are done, a copy is actually performed (a
copy-on-write optimization). This means that if you're immediately calling
`exec`, the cost is extremely low to fork a process. Its not like you're
physically making a copy in memory every time this is done. Apparently it wasn't
always like this though and forking from an extremely large process was
problematic.

Some posts emphasize that its simply an artifact of history. One Stack Overflow
post quoting some web page said that originally fork was 27 lines of assembly
code, and a combined fork-exec (essentially CreateProcess) would have been much
more complicated due to how things were architected.

Anyway, just kind of odd to think about. I assume the truth is somewhere in the
middle -- it was convenient to implement at the time and then was seen as a boon
for a ton of use cases.

References:

1.  [Purpose of
    fork](http://stackoverflow.com/questions/985051/what-is-the-purpose-of-fork)
2.  [History of
    fork](http://stackoverflow.com/questions/8292217/why-fork-works-the-way-it-does)
3.  [Vaguely addresses the 'why' of
    fork](http://unix.stackexchange.com/questions/136637/why-do-we-need-to-fork-to-create-new-processes)
