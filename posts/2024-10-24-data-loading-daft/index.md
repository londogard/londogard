---
title: "Data Loading - Daft"
description: "The first of multiple blog posts about Data Loading in Deep Learning"
categories: [TIL]
date: "2024-10-24"
---

In Deep Learning you often want to optimize GPU usage or in other words not CPU bound. That is: _you want to always have data ready when the GPU has time to process more data_.

There's a lot of different tools to load data and I'll go through a few of them for one of the more complex use-cases: _Object Detection_. Why _Object Detection_?

1. It's common
2. It has variable, or _ragged_, dimensions
   1. i.e. one image has 2 bounding boxes of people and the second has 0.
3. The data (images) is too large to keep in-memory

All in all this makes Object Detection a task that requires some tuning of the Data Loading to make full use of your GPU's!

This blog will be brief and not as in-depth as I'd hoped. But there'll be more where I compare to other tools.

# Daft

Today I'll introduce one of the newer alternatives in the field, [daft](https://getdaft.io/).

Daft is what you can only call a merger between `polars`, `spark` and Deep Learning. 
If they had been more inspired by `polars` in the Developer Experience (DX) I'd have called it a "lovechild", but for now they don't have the nice-to-haves like `pl.with_column(new_col_name=pl.col("other_col")*2)` named syntax and other things like `pl.col("col").replace(dict_to_replace)` and a lot of other things.

What _daft_ does have is a _multi-modal_ namespace, unlike `polars` which solely focuses on traditional data-types. This is _really_ interesting albeit not that fleshed out yet. It's enjoyable and has potential to grow!

Further, to quote _daft_ themselves:

> _Daft provides a snappy and delightful local interactive experience, but also seamlessly scales to petabyte-scale distributed workloads._

The _petabyte-scale_ comes from the fact that you can run _daft_ on top of _Ray_ which is a distributed framework that tries to take on Spark. It's famously used at OpenAI while training their models.

# Coding with Daft

Coding with `daft` is an experience. I only ran locally but it held up really well to "native" PyTorch, even surpassing it in one case!

I'll share my experience and implementations below!

## Reading Data

Like most modern project _daft_ includes a smooth integration to _Apache Arrow_.

> Apache Arrow is "The universal columnar format and multi-language toolbox for fast data interchange and in-memory analytics"

The Arrow integration gives _daft_ multiple ways in to read a dataset, and the dataset doesn't even have to be in-memory because of the Arrow data structure which can easily be stream "memory-map-mode" (`mmap`).

To "read" a Arrow table you simply call `from_arrow`, as I do below reading a HuggingFace Datasets Arrow Table.

```python
ds_train = daft.from_arrow(ds["train"].data.table)
```

To "read" other formats from disk you simply use `read_(delta|csv|...)`, as below.

```python
df = daft.read_deltalake("some-table-uri") # read_(csv|parquet|json|...)
```

Finally it has very tight integration with Ray, which is very neat when you wish to scale to Big Data.

## Data Transforms - multi-modal and whatnot

To modify a DataFrame you work very similar to `polars`. There's `Expression`'s which is a way to have a lazy 
non-evaluated expression, like a SQL query before you run it. I've spoken about `Expression`'s before and I really love them, they make code decoupling a lot easier and can simplify a query to something beautiful.

See my example of extracting image from a struct that has a field with bytes.

```python
# expression: lazy non-executed method
extract_img_bytes = daft.col("image").struct.get("bytes").alias("image")

ds_train.select("label", extract_img_bytes)
```
> Select column `label` and `image`, where `image` extracts `image.bytes` into `image`.

From here I'd like to decode the image into something which we can work with, unlike bytes, and that's easy using 
the multi-modal namespace (`.image`).

```python
img_decode_resize = daft.col("image").image.decode(mode="RGB").image.resize(224, 224)

ds_train = ds_train.with_column("image", img_decode_resize)
```

> Transforms `image` by decoding it into `RGB` and then resizing to `224x224`.

Quite cool right? There's some great potential here!

How do we apply more complex operations? UDF's! It's just as easy as in `polars`, simply call `apply`.

```python
def rescale_transpose(x: np.array):
    return (x / 255.0).transpose(2, 0, 1)

ds_train.with_column(
    "image",
    daft.col("image").apply(
        rescale_transpose,
        return_dtype=daft.DataType.tensor(daft.DataType.float32()),
    ),
)
```

> Applying a custom transformation. Images are represented as `np.array` and you need to define `return_dtype`.

With all this available we're good to go for a Deep Learning training pipeline!

## Producing a PyTorch Dataset

The final part of our pipeline is to move the data into `torch.Tensor`. There's one big gotcha - don't apply `num_workers` as _daft_ already apply multi-thread/processing optimizations!

```python
ds_train = ds_train.to_torch_iter_dataset()

# NOTE: don't apply num_workers even though PyTorch warns!
dls_train = torch.utils.data.DataLoader(ds_train, batch_size=32)
```

And that's a wrap! We got all the steps to finalize the deal. How about a comparison?

# Mini Benchmark
Comparing speeds with "native" PyTorch DataLoaders is interesting and shows that Daft is on-par in speed when using their new _native execution engine_ (_swordfish_). When I increase image size, i.e. larger data to process, I see Daft even surpassing PyTorch DataLoaders (!).

**N.B.** I'm running the full training from a HuggingFace Dataset backed by Arrow. It's the same underlying data structure for all tests except "Folder File" one, but things might just be different if we start discussing file-loading (rather than from bytes) or even remote data.

## Numbers
| Tool                     | Num_worker | Pin_memory | Cache | Configuration | Time       |
| ------------------------ | ---------- | ---------- | ----- | ------------- | ---------- |
| **Torch Dataset/Loader** | None       | None       | -     | Default       | **3m20s**  |
|                          | None       | None       | -     | Default       | 3m26s      |
|                          | 4          | True       | -     | Default       | 4m9s       |
|                          | 2          | True       | -     | Default       | 3m44s      |
| **Daft**                 | -          | -          | -     | daft-default  | **14m55s** |
|                          | -          | -          | -     | daft-native   | **3m30s**  |

Running on full sized images we get a bit more interesting results:

| Tool                            | Num_worker | Pin_memory | Cache | Configuration | Time      |
| ------------------------------- | ---------- | ---------- | ----- | ------------- | --------- |
| **Full Size**                   | 4          | True       | -     | torch         | 4m19s     |
| **Full Size**                   | -          | -          | -     | daft          | **3m49s** |
| **Image Folder & Files (160p)** | -          | -          | -     | torch         | **3m31s** |
| **Image Folder & Files (160p)** | -          | -          | -     | daft          | **3m26s** |

To read a file locally using _daft_ you simply do the same as you'd do with remote.

```python
df.with_column("image", daft.col("path").url.download())
```

# Remote data

Working with remote data is a common and interesting use-case. I think based on this research that _daft_ has a good chance of performing really well, as the local files also did great.

# Final Thoughts

Even if _daft_ has a way to go for Deep Learning training it really holds great promise. If they make the export easier to PyTorch and perhaps add TensorFlow I believe it could grow into a valuable competitor to HuggingFace Datasets et. al.

As Ray is what drives OpenAI's training I believe Daft stands on some really good scalable underlying tech and can perhaps be what joins Data Engineering and Data Science together as one, for real - a big leap forward!

Thanks for this time,
Hampus


**Extra:** all code is available on the git-repo for this blog, see `code/data_loading`.