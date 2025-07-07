---
title: 'A look at memcpy assembly'
date: '2016-05-27T05:16:59.000Z'
featured: false
draft: false
tags:
  [
    'learning',
    'open security traning',
    'x86-64',
    'asm',
    'memcpy',
    'university of washington',
    'x86',
  ]
---

I've been learning x86(-64) assembly on both Mac and Windows.

I've been using the resources at [Open Security
Training](http://OpenSecurityTraining.info) as well as as the [University of
Washington Hardware/Software
Interface](http://coursera.org/course/hwswinterface) course.

My intent is to read two different selections on Windows and Mac OS internals as
well in a quest to get closer to the hardware.

One of the exercises was to disassemble memcpy and take a look at what its doing
down a particular branch. Found it interesting, so gist is below.

{{< gist jmoyers b76cc8e9dbf122b60cab515025d7bb76 "memcpy.asm" >}}

1.  If the size of the struct is under 32 bytes, it will do 4 byte copies using
    mov (source -> edx -> destination), then 1 byte copies (source -> al ->
    destination) if its not 4 byte aligned

2.  If the size >= 32 && size < 128 it does some fancy stuff with 64 bit
    registers (doesn't matter that project is x86 or that sse is explicitly
    turned off, i think because its linking to runtime libraries)

3.  If you mess with sizes above 128, it will use rep movs... some of the time
