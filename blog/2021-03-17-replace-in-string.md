---
description: "A simple quick comparison on which method to use and in what case when replacing characters or strings in strings."
tags: [jvm]
title: "When to use what - RegExp, String Replace & Character Replace (JVM/Kotlin)"

authors: hlondogard
---

# When to use what - RegExp, String Replace & Character Replace
Sometimes it's hard to know what to use, and why to use it even. 
<!--truncate-->

### What
In most, or dare I say all, popular programming languages there exists a multitude of string replacements methods, most common is to have one String-based and one RegExp-based. In some languages such as Java there's also a special method to replace Characters in a String.

### Why
Performance sometimes matter, sometimes it doesn't. But if it does it's really good knowing which method to use as the speed-up can be substantial!

#### The use-case
Replace "a", "b" & "c" to "d". It's simple, but good.
As for data I'm using a few of shakespeares works which in total is 4.5 million characters, I've also added variants of these as shown in the table.

|Type|Length (characters)|Iterations|Average (msg)|Normalized to RegExp|
|---|---|---|---|---|
|RegExp|1k|1 million|0.0049ms|1x|
|Char|1k|1 million|0.0027ms|0.55x|
|String|1k|1 million|0.0087ms|1.63x|
|---|---|---|---|---|
|RegExp|4.5 million|1k|29.67ms|1x|
|Char|4.5 million|1k|11.84|0.39x|
|String|4.5 million|1k|57.20|1.92x|
|---|---|---|---|---|
|RegExp|45 million|10|361.8ms|1x|
|Char|45 million|10|117.0ms|0.32x|
|String|45 million|10|588.1ms|1.54x|

As shown the Character-based replace is _much_ faster! It's only getting faster in comparison to the RegExp the bigger the file is.

I think a interesting test would be to do character swaps, using these methods and see if it's retained.

#### When to use what?
I'd say that I see a few clear results.

1. Use _Character Based Replace_ if you only need to replace characters. It's **much** faster!
2. Use _String Based Replace_ if you only swap one string to another (it's faster than RegExp), doing multiple swaps grows fast in time consumed. 
3. Use _RegExp Based Replace_ if you want to swap multiple strings
4. Use _RegExp Based Replace_ if you wanna do anything complex really! It's pretty performant if you remember to compile the pattern :)

### Extra
Some extra comments that are good to know in cases as these

#### RegExp
I've said this before but...
Please remember to compile your patterns once, and not in each loop. Compiling patterns is incredibly expensive!
Running `(1..1_000_000).forEach { str.find(regexStr) }` is a multitude slower than 
```kotlin
// pseudo-code
val regexCompiled = regexStr.toRegex()
(1..1_000_000).forEach { regexCompiled.find(str) }
```
because in the first example pattern is compiled each time...

#### Python specific
Note that in Python as an example there exists C-implementations for some methods, it's **very** important to actually use these if you care about performance.
As an example `str.find(keyword)` is a multitude slower than `keyword in str`, because the `in` keyword is actually a C-implementation when `str.find` is a python one.

## Appendix A. The Code
[GitHub gist](https://gist.github.com/Lundez/ee6484422cc2fe5545fffa7eaa2635cc)
```kotlin
import java.io.File
import kotlin.system.measureTimeMillis

object RegexTester {
    val text = File("/home/londet/git/text-gen-kt/files/shakespeare.txt").readText()
    val textSmall = text.take(1000)
    val textLarge = text.repeat(10)

    val regex = "[abc]".toRegex()
    val charReplace = listOf('a', 'b', 'c')
    val stringReplace = listOf("a", "b", "c")

    @JvmStatic
    fun main(args: Array<String>) {
        println("Warming up JVM by running 10,000 iterations of each replacer on normal size.")
        (1..10_000)
            .forEach { regex.replace(text, "d") }
        (1..10_000)
            .forEach { charReplace.fold(text) { acc, ch -> acc.replace(ch, 'd') } }
        (1..10_000)
            .forEach { stringReplace.fold(text) { acc, ch -> acc.replace(ch, "d") } }
        println("Warmup done!")


        val regexSmall = measureTimeMillis { (1..1_000_000).forEach { regex.replace(textSmall, "d") } } / 1_000_000.0
        val regexNormal = measureTimeMillis { (1..1_000).forEach { regex.replace(text, "d") } } / 1000.0
        val regexLarge = measureTimeMillis { (1..10).forEach { regex.replace(textLarge, "d") } } / 10.0
        // val regexLargeCompile = measureTimeMillis { (1..10).forEach { textLarge.replace("[abc]", "d") } } / 10.0
        println("Regex Small (1000 characters, 1,000,000 avg): $regexSmall")
        println("Regex Normal (4.5 million characters, 1000 avg): $regexNormal")
        println("Regex Large (45 million characters, 10 avg): $regexLarge")


        val charSmall = measureTimeMillis { (1..1_000_000).forEach { charReplace.fold(textSmall) { acc, ch -> acc.replace(ch, 'd') } } } / 1_000_000.0
        val charNormal = measureTimeMillis { (1..1_000).forEach { charReplace.fold(text) { acc, ch -> acc.replace(ch, 'd') } } } / 1000.0
        val charLarge = measureTimeMillis { (1..10).forEach { charReplace.fold(textLarge) { acc, ch -> acc.replace(ch, 'd') } } } / 10.0
        println("CharReplace Small (1000 characters, 1,000,000 avg): $charSmall")
        println("CharReplace Normal (4.5 million characters, 1000 avg): $charNormal")
        println("CharReplace Large (45 million characters, 10 avg): $charLarge")

        val stringSmall = measureTimeMillis { (1..1_000_000).forEach { stringReplace.fold(textSmall) { acc, ch -> acc.replace(ch, "d") } } } / 1_000_000.0
        val stringNormal = measureTimeMillis { (1..1_000).forEach { stringReplace.fold(text) { acc, ch -> acc.replace(ch, "d") } } } / 1000.0
        val stringLarge = measureTimeMillis { (1..10).forEach { stringReplace.fold(textLarge) { acc, ch -> acc.replace(ch, "d") } } } / 10.0
        println("StringReplace Small (1000 characters, 1,000,000 avg): $stringSmall")
        println("StringReplace Normal (4.5 million characters, 1000 avg): $stringNormal")
        println("StringReplace Large (45 million characters, 10 avg): $stringLarge")
        
        /**
        Regex Small (1000 characters, 1,000,00 avg): 0.004949
        Regex Normal (4.5 million characters, 1000 avg): 29.671
        Regex Large (45 million characters, 10 avg): 361.8
        CharReplace Small (1000 characters, 1,000,00 avg): 0.002752
        CharReplace Normal (4.5 million characters, 1000 avg): 11.835
        CharReplace Large (45 million characters, 10 avg): 117.0
        StringReplace Small (1000 characters, 1,000,00 avg): 0.008692
        StringReplace Normal (4.5 million characters, 1000 avg): 57.204
        StringReplace Large (45 million characters, 10 avg): 588.1
        */
    }
}
```
