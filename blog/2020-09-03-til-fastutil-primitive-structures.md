---

description: "Discusses what autoboxing is, why it might hit your performance (and memory). Finally some alternatives are also provided. Learn how to use effective data collections today!"
tags: [jvm, TIL]
title: "TIL: fastutil - fast & compact type-speciic collections for JVM (no autobox!)"

authors: hlondogard
---
# fastutil - how to optimize your collections by primitives
> fastutil extends the Java™ Collections Framework by providing type-specific maps, sets, lists and queues with a small memory footprint and fast access and insertion
<!--truncate-->

[Homepage](http://fastutil.di.unimi.it/) of fastutil

### What
So what does the quote above actually mean?  
First we need to dive into, what is a Java Collection, and why are they \"bad\" for performance and memory requirements?

Java Collections (`Collection<E>`) only works with objects, meaning that if we have a `List<E>` which we populate with `int` it'll actually \"autobox\" the `int` into a `Integer`, i.e. the class, rather than the primitive type.  
What does this mean for you as a user?

- It's done through \"autoboxing\" which means automatic casting to the `Integer`-type, so nothing required for you
- It allocates more memory than the primitive `int`.

So how do you create an effective `List` that contains primitives, such as `int, boolean` and `float`? You can't.  
What you can do is to create an array, `int[]`, which will contain the actual primitives, no autoboxing applied.

But what if you want to have the methods from `List`, such as `find` and \"auto-resizing\"?
Then you'll have to research and find a library, `fastutil` to the rescue!

### How
`fastutil` implements their own versions of `List`, `HashMap` and so on which actually use the raw primitives, thereby increasing throughput while lowering memory used (as we're not allocating as many objects anymore, when using primitives).

_These types of libraries are only required once you hit an enormous amount of data or very strict requirement._

#### Installation

Using gradle

`implementation: 'it.unimi.dsi:fastutil:8.4.1'` (latest version as of Aug 2020, [mvnrepository](https://mvnrepository.com/artifact/it.unimi.dsi/fastutil))

#### Usage

_DoubleToDoubleMap_

```kotlin
val d2dMap: Double2DoubleMap = Double2DoubleOpenHashMap().apply {
    put(2.0, 5.5)
    put(3.0, 6.6)
}
assertEquals(5.5, d2dMap.get(2.0))
```

This map is not only less memory-hungry (because using `double` rather than `Double`) but is also faster with insertions & get, than the Java Collections counterpart.

### Why

**Less space used & faster** - it is as simple as that!

- No \"AutoBoxing\"
- No Object allocations for primitives

_Side-note_
Something I noticed while working on my Language Model in Kotlin, with some strict requirements and a lot of data, was that even when using `fastutil` I wasn't gaining that much as I was  mainly using `views` of my Lists, further optimizing memory. Views are what the name implies, a view of the List. It never creates a copy but just the indices and make use of the original structure. 
Using immutable data this is very effective, but if you'd been using mutable data it could prove dangerous as someone can change the structure and data of your view (even if your view is immutable the underlying List might not be).

### Alternatives

[Goldman Sachs Collection - now Eclipse Collections](https://www.eclipse.org/collections/) - Probably the best alternative, in my opinion.
[HPPC - Carrot Search Labs](http://labs.carrotsearch.com/hppc.html)
[Trove4j](https://bitbucket.org/trove4j/trove/src/master/) - Not as active as other alternatives, but who cares when it's performant and \"done\"?

Find a 2015 benchmark of the libraries [here](http://java-performance.info/hashmap-overview-jdk-fastutil-goldman-sachs-hppc-koloboke-trove-january-2015/)
At least both `fastutil`& `Eclipse Collections` are updated for Java 8 streams!


-Hampus Londögård