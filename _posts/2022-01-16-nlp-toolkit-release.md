---
toc: true
layout: post
description: "nlp (londogard-nlp-toolkit) has had it's 1.1.0 release recently with a lot of new functionality and multiple improvements to efficiency, dive in to understand more!"
categories: [nlp, jvm, kotlin]
title: "Release nlp (londogard-nlp-toolkit) 1.1.0"
comments: true
author: Hampus Londögård
---

# Release nlp 1.1.0

The 1.1.0 release of nlp ([londogard-nlp-toolkit](https://github.com/londogard/londogard-nlp-toolkit)) by londogard is here!
  

I’m writing this small blog-post mainly to showcase some of the new things possible now that we’re moving into classifer-space!  

Most of the examples are taken from `/src/test`.

# Vectorizers

First out we have vectorizers that takes words and output vectors of numbers. Three different vectorizers was added, namely:

1.  **Bag of Words**, also called Count Vectorizer in `sklearn`.

    *   This vectorizer takes words and assign a unique number to each, which is then filled in the final vector

3.  **TF-IDF**
    *   This vectorizer assigns values to word based on their _term frequency & inverse-document frequency._ Which is a **incredible strong baseline.** ([Wikipedia.org](https://en.wikipedia.org/wiki/Tf%E2%80%93idf))

5.  **BM-25**
    *   This vectorizer is a improvement on top of TF-IDF used by Elastic Search among others. The difference is that BM-25 also base the magnitude on the sentences length, in TF-IDF sometimes long sentences tend to get very high magnitude. ([Wikipedia](https://en.wikipedia.org/wiki/Okapi_BM25))

And yes, it’s possible to vectorize **with ngrams**! 🥳  
And yes (x2), it’s using **Sparse Matrices** to keep performance at top!🤩

### Usage of Vectorizers

```kotlin
val simpleTok = SimpleTokenizer()  
val simpleTexts = listOf("hello world!", "this is a few sentences")  
    .map(simpleTok::split)  
val tfidf = TfIdfVectorizer<Float>() // replace by CountVectorizer or Bm25Vectorizer  
  
val lhs = tfidf.fitTransform(simpleTexts)  
println("Vectorized: $lhs")
```
  

## Classifiers

Yes, we now have classifiers meaning we can classify sentences, documents and much more using our vectorized data!

*   Logistic Regression using Stochastic Gradient Descent as optimizer
*   Naïve Bayes classifier
*   Hidden Markov Model to classify sequences with a sequence output, e.g. _Part of Speech_ (PoS) or _Named Entitiy Recognition_ (NER).

### Usage of Classifiers

```kotlin

val tfidf = TfIdfVectorizer<Float>()  
val naiveBayes = NaiveBayes() // replace by LogisticRegression if needed  
  
val out = tfidf.fitTransform(simpleTexts)  
naiveBayes.fit(out, y)  
  
naiveBayes.predict(out) shouldBeEqualTo y
```

and for sequences:

```kotlin

val (tokensText, tagsText) = text  
    .split('\\n')  
    .map {  
        val (a, b) = it.split('\\t')  
        a to b  
    }.unzip()  
val tokenMap = (tokensText).toSet().withIndex().associate { elem -> elem.value to elem.index }  
val tagMap = (tagsText + "BOS").toSet().withIndex().associate { elem -> elem.value to elem.index }  
val reversetagMap = tagMap.asIterable().associate { (key, value) -> value to key }  
val hmm = HiddenMarkovModel(  
    tagMap.asIterable().associate { (key, value) -> value to key },  
    tokenMap.asIterable().associate { (key, value) -> value to key },  
    BegginingOfSentence = tokenMap.getOrDefault("BOS", 0)  
    )  
  
val x = listOf(mk.ndarray(tokensText.mapNotNull(tokenMap::get).toIntArray()))  
val y = listOf(mk.ndarray(tagsText.mapNotNull(tagMap::get).toIntArray()))  
  
  
hmm.fit(x, y)  
// predict.map { t -> t.data.map { reversetagMap\[it\] } } to get the real labels!  
hmm.predict(x) shouldBeEqualTo y
```


## Unsupervised Keyword Extraction

This is something that makes me very happy to include, automatic keyword extraction! This tool is very fast and efficient at doing what it’s doing and is based on a Co-Occurrence Statistical Information algorithm proposed by Y. Matsuo & M. Ishizuka in the following [paper](https://www.researchgate.net/publication/2572200_Keyword_Extraction_from_a_Single_Document_using_Word_Co-occurrence_Statistical_Information).


### Usage of Keyword Extraction

```kotlin
val keywords = CooccurrenceKeywords.keywords("Londogard NLP toolkit is works on multiple languages.\\nAn amazing piece of NLP tech.\\nThis is how to fetch keywords! ")  
  
keywords shouldBeEqualTo listOf(listOf("nlp") to 2)
```
  

## Embedding Improvements

`LightWordEmbeddings`  have had their cache updated into a optimal cache by `caffeine` , which instead of being randomly deleted from cache takes the least used and remove. This should improve performance!

  
---


That’s it, I’m hoping to release a spaCy-like API during 2022, including Neural Networks. Here’s to the future! 🍾