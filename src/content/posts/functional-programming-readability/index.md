---
title: "Functional Programming Readability"
date: "2016-05-27T06:47:38.000Z"
featured: false
draft: false
tags: ["c++", "code-style", "readability", "functional", "rust", "c"]
---

I was recently reading an article on
["The Path to Rust,"](https://thesquareplanet.com/blog/the-path-to-rust/) which
is a topic I've been interested for some time, based on the promises of the
language. Namely a language with explicit memory management without a garbage
collector that claims to be thread and memory safe. Hardcore enough to have an
inline assembly (gcc syntax, which is gross) and with a focus on performance.

I really like C and C++ and have spent a fair amount of time actually learning
x86-64 assembly. This is from a guy who spent most of his early career building
websites with PHP, Python, Node.js and the like. I've been on a personal quest
to get closer and closer to the hardware. So, Rust appeals to me as a language
that doesn't completely obfuscate the underlying platform.

The only thing that turned me off (in this article) was this nasty looking
functional transform chain, which was (sort of) touted as idiomatic Rust.

<script src="https://gist.github.com/jmoyers/e5524bf396975c65896a4998084e0554.js?file=rust_functional.rs"></script>

I am deeply familiar with fluent style APIs with long lists of transforms.
Javascript, and more particularly, the Node.js community uses them like crazy.
On the other hand, once the novelty wears off, I think this type of program is
much less readable than some of the alternatives one can dream up. The author
shows one such alternative in the next paragraph, which to me at least, seems a
lot more approachable and beautiful. This should have come first imo.

<script src="https://gist.github.com/jmoyers/b212710b776a050a1c8030bf3d23c387.js?file=rust_reg.rs"></script>

Anywho, good article overall and I'm looking forward to trying out Rust more
thoroughly!
