---
title: "DeepSeek's smallpond - a distributed duckdb"
description: "Open Source software that'd cost millions if not billions of $! I share my quick thoughts on _smallpond_ that runs DuckDB distributed through Ray by DeepSeek (creators of R1 LLM)."
categories: [python, data, distributed]
date: "2025-03-07"
---

There has been a lot of buss around [DeepSeek](https://www.deepseek.com/) (R1) and their Open Source mission, and lately they released their full stack to train State-of-the-Art LLM's.  
One of the tools is a *Distributed Data Processing* framework named [*"smallpond"*](https://github.com/deepseek-ai/smallpond) built on top of [*DuckDB*](https://duckdb.org/) *&* [*Ray*](https://www.ray.io/).  
Mike made an excellent write-up on his [blog.](https://www.definite.app/blog/smallpond) 


**The summary?** It's a tool that you can't even [buy with millions $](https://x.com/suchenzang/status/1895437762427560236), insanely valuable Open Source code! Draw-back? A lot of setup, early days with few (if any) guides.  
**When should I use it?** When you start to have more than 10 TB of data to query, especially above 1 PB.


**My thoughts** are that

1. *smallpond* brings the "modern data stack" closer to end-user for truly Big Data, but not close enough. 
    * We see *Apache Arrow* and *Ray* (a lot more lean than say [Apache Airflow](https://airflow.apache.org/)) as key technologies, and the engines are interchangable between DuckDB and Polars.
2. There's other competition trying similar, e.g.  [Polars Cloud](https://pola.rs/posts/polars-cloud-what-we-are-building/)  (albeit potentially not Open Source it's an exciting future)!
3. There's other competition rather looking at vertical scaling, e.g. [Motherduck](https://motherduck.com/) .

At the end of the day Motherducks approach resonates a lot more to me, by storing data cleverly we can easily query huge amount of data efficiently on a single machine through metadata scanning, especially with vertical scaling. _It's also the simplest approach._

But some days you might be in need of that _brute-force_ because there isn't time, competence or your problem simply requires loading and working with *insane amounts of data*, i.e. LLM training.

All in all _smallpond_ and _3FS_ are great additions to the open source community and extends the "distributed truly big data processing" which is a valuable target. Though I can't help but think and hope that there'll be even simpler tools moving forward.