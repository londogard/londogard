---
title: "TIL: s5cmd"
description: "**TL;DR** s5cmd provided us a 30x speedup compared to a custom Python threading loop when downloading S3 objects. It's easy to use and fits right in your workflow today!"
categories: [aws, s3, til]
date: "2025-08-29"
---

**TL;DR** s5cmd provided us a 30x speedup compared to a custom Python threading loop when downloading S3 objects. It's easy to use and fits right in your workflow today!

---

When working with code, or anything really, you always apply trade-offs. One example is _simplicity_ versus _runtime efficiency_, often talked about in _CPU-cycles_ versus _brain-cycles_, where the latter usually wins. But sometimes the trade-off is hard, s5cmd is such a case - it's a single new dependencies with massive gains.

_[S5cmd](https://github.com/peak/s5cmd) is a very fast S3 and local filesystem execution tool_. For those that care it's written in Go, which is a fast language, by Google, that builds small simple binaries.

I can't share specific numbers from work, but the speedup is _approximately 30x compared to a (simple) custom threading pool in Python_, that's huge! Joshua Robinson found the same numbers in his [blog](https://joshua-robinson.medium.com/s5cmd-for-high-performance-object-storage-7071352cc09d) when comparing with s3cmd / aws-cli. 

In our case the single dependency addition was worth it because the efficiency and cost-reduction overweighs the cons, especially as the dependency itself is very lean.

I hope someone who's in need of a faster S3 download/upload tool reads this and manages to speed their tooling up! 😊

Thanks for this time,
Hampus Londögård