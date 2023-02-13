---
title: "Polars - A Refreshingly Great DataFrame Library"
description: "Polars is a DataFrame library written from ground-up to not only have a sensible API but also very efficient operations using multiple cores and clever optimizations such as predicate pushdown & much more!"
categories: [data-engineering, pipeline, data]
date: "2022-11-30"
no_comments: false
---
While working at AFRY we've noted that in performance intensive application that isn't really *Big Data* ends up being slow when using [`pandas`](https://pandas.pydata.org/).

Coming from languages such as *Scala, Kotlin *& *golang* we knew there had to be more to it. There was a lot of performance to be squeezed! 🏎️

<!--truncate-->

Cherry on the top? The `pandas` API is a constant source of confusion and thereby not very satisfying. I end up having to read/search the documentation more times than I care to admit. All in all a cleaner and more efficient tool was needed to handle our data & model training pipelines.

One day I stumbled upon [`polars`](https://github.com/pola-rs/polars) \- an *blazing fast* DataFrame-library written in Rust. Plenty of buzzwords, documentation and user-guide later I was ready to trial it in a personal project. 🤠

It was a smooth addition because of the `pandas` integration, `pl.from_pandas` & `df.to_pandas()`, which in turn made it a gradual adoption. The trial was an instant success, moving `DataFrame`'s to and from `polars` was diminished by the fact that `polars` sped up my pipeline so much. And the code was clean, the API more natural, only downgrade was a bit less reading options - otherwise *only upgrades*! 🤯

I was ready to trial it work, and boy was I in for a wonderful journey!

After gradually adopting it in one of our client project we saw huge speedups (some parts being >3 magnitudes (!) faster) and our code became a lot simpler. Additionally something I didn't expect: we decoupled our code in a more efficient way producing leaner code that's more testable! 🦸‍♂️

Then... what the actual fudge is `polars`?

# Polars

Polars is a DataFrame library written purely in Rust, i.e. no runtime overhead, and uses [`Arrow`](https://arrow.apache.org/) as its foundation. The Python/JS bindings are simply a thin wrapper to be able to be able to use functionality in the core library. Very similar to `pandas` with a few major differences.

**Why is it fast?**

`polars` achieves its speed by utilizing available cores **and** being smart. It goes to great lengths to:

- Reduce redundant copies
- Traverse memory cache efficiently
- Minimize contention in parallelism

`polars` has a **lazy API** with reminisence of SQL and Spark, this lazy API is automatically applied for certain operations such as `groupBy`. Using the lazy API `polars` enables **query optimizations** which improves performance and memory pressure. `polars` tracks your query in a *logical plan* which is optimized.

Here's a list from [pola-rs.github.io](https://pola-rs.github.io/polars-book/user-guide/) on how it achieves its performance:

- [Copy-on-write](https://en.wikipedia.org/wiki/Copy-on-write) (COW) semantics
  - "Free" clones
  - Cheap appends
- Appending without clones
- Column oriented data storage
  - No block manager (i.e. predictable performance)
- Missing values indicated with bitmask
  - NaN are different from missing
  - Bitmask optimizations
- Efficient algorithms
- Very fast IO
  - Its csv and parquet readers are among the fastest in existence
- [Query optimizations](https://pola-rs.github.io/polars-book/user-guide/optimizations/lazy/intro.html)
  - Predicate pushdown
    - Filtering at scan level
  - Projection pushdown
    - Projection at scan level
  - Aggregate pushdown
    - Aggregations at scan level
  - Simplify expressions
  - Parallel execution of physical plan
  - Cardinality based groupby dispatch
    - Different groupby strategies based on data cardinality
- SIMD vectorization
- [`NumPy` universal functions](https://numpy.org/doc/stable/reference/ufuncs.html)

> **Side-note**: one ugly hack I remember doing in `pandas` was to slice columns used in a `groupBy` aggregation before applying `groupBy` to make it faster. In `polars` this operation is lazy and automatically does this optimization in its query optimizer! Boy is it beautiful to see! 😍

**Why does it make sense?**

I'm not sure this title makes sense, but `polars` sure do! 🤓

Did you ever ask yourself why `numpy` and `pandas` requires an indexing array to filter a list? E.g. `x[x > 10]` to return the list with all values >10.

I did, and the answer is *vectorization* which makes code incredibly fast. But we should be able to achieve this in a simpler and more efficient way right? Because it's ugly and stupid... so let's achieve it more efficiently!

`polars` uses semantic more familiar to other languages, with it's `.filter(pl.col(x) > 10)`.

> **Side-note**: `pl.col(x) > 10` is a `pl.Expr` which is **not** executed until queried via `DataFrame` or `Series`!

This way it's incredibly easy to combine filters and even more importantly, decouple code.

```python
def filter_age(age: int) -> pl.Expr:
  return pl.col("age") > age
  
 df.filter(filter_age(13))
```

To me this `<u>`is really cool!`</u>` 🤓

## In Production

We use `polars` extensively in production and after evaluating we found:

1. Pipelines to be 2x-20x faster, averaging about 7x
2. Simpler pipelines
3. Easier testing of pipelines

Which is some pretty fantastic gains!

## Future

I see a bright future with `polars` as it enables workloads which previously required to run in the cloud to be able to run locally, because the efficiency is so high.

## Bonus

`polars` is more than a "simpler API" and "faster `pandas`" with its additional functionality.
Ever heard of `over`? Not? Let me tell you a cool story!

### `pl.Over`

`pl.col(age).mean().over(gender)` is like `pd.groupBy(gender).transform({age: "mean"})` but way more expressive and powerful!

It can be used to build columns, filter DataFrame and anything really. We can combine multiple of them in the same select:

```python
df.select([
  pl.col(age).mean().over(gender),
  pl.col(height).mean().over(gender),
  pl.col([age, height]).over([gender, species])
])
```

The first and second row of the select uses the same grouper, query optimizer yay!

The third line does it over multiple columns, combining all this into one single select is some pretty powerful stuff! 🦸‍♂️

### `pl.Fold`

Yet another incredibly powerful piece of operation is the `fold` which most *Scala-* or *FP-*programmers will know and love. `fold` is a more powerful `reduce` as it allows us to define what type we'd like to accumulate.

The simplest example is using `fold` as a `reduce` to calculate the sum, e.g.

```python
out = df.select(
    pl.fold(acc=pl.lit(0), f=lambda acc, x: acc + x, exprs=pl.col("*")).alias("sum"),
)
```

Which is an obvious overkill solution, but allowing to aggregate expressions with conditionals is an inredibly powerful concept which can yield the best types of expressions.

```python
out = df.filter(
    pl.fold(
        acc=pl.lit(True),
        f=lambda acc, x: acc & x,
        exprs=pl.all() > 1,
    )
)
```

In this expression we filter that every coluumn is larger than 1.

That's it for this small article.
\~Hampus Londögård
