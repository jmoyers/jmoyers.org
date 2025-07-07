---
title: "Stanford compilers: gdb with myparser"
date: "2016-06-08T05:25:49.000Z"
featured: false
draft: false
tags:
  [
    "stanford",
    "compilers",
    "lexer",
    "parser",
    "myparser",
    "bison",
    "abstract syntax tree",
  ]
---

Still working on the actual parser, but I did run into a situation where I
actually needed to debug the parser in gdb. Not immediately obvious how to get
this working, so I modified the myparser shell script with my findings.

{{< gist jmoyers 63c1c804a9db16ffe0e52bc66eda9aa7 "myparser.sh" >}}
