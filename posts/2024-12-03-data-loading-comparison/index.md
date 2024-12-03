---
title: "Data Loading - Comparing Common Tooling"
description: "Minibenchmark and Developer Experience (DX) between the choices"
categories: [data, loading]
date: "2024-12-03"
---

This blog was supposed to be more in-depth but my enthusiasm was drastically cut and I felt like splitting it up into multiple smaller one, whereas [daft one](/posts/2024-10-24-data-loading-daft/) is already uploaded.

> I started writing a "recipe-book" for `daft` where I realized it wasn't as smoothly integrated as a lot of other tools. I believe that the `DataFrame` format is both a winning and loosing concept, it's very helpful but when you need to use two columns the way `Ray`, `HuggingFace Datasets` and others map data using `dict` is a winning concept for both _element by element_ and _batch_ mapping. With a `dict` way to map `DataFrame` I think that `daft` might end up the perfect tool.

Anyhow, today I'll compare the developer experience and performance of different tools for data loading.

1. [HuggingFace Datasets](https://huggingface.co/docs/datasets/index)
2. [Ray Data](https://docs.ray.io/en/latest/data/data.html)
3. [Daft](https://getdaft.io/)
4. ["PyTorch Native" (Dataset & DataLoader)](https://pytorch.org/)

All of the chosen tools are quite awesome, but HuggingFace and Ray can export to TensorFlow additionally. Although Ray currently cannot handle `RaggedTensor` which is required for models with variable output - a letdown!

## Quick Introduction

**Hugging Face Datasets** offers easy access to a vast library of datasets, with efficient memory handling through streaming and memory-mapping. Its API simplifies data loading and transformation for direct use with PyTorch and TensorFlow.

**Ray Data** enables scalable, distributed data processing across multiple nodes, ideal for large datasets. It integrates with Ray’s ML tools for parallel training and distributed transformations. It's the tool for Large Language Model training, even embraced by OpenAI in their ChatGPT [source](https://thenewstack.io/how-ray-a-distributed-ai-framework-helps-power-chatgpt/).

**Daft** is a high-performance data processing library with lazy evaluation, optimized for structured data formats like Parquet and Arrow. It’s a strong choice for single-node and multi-node data preparation with PyTorch compatibility. It utilizes Ray to achieve multi-node behavior.

**PyTorch’s Dataset and DataLoader** offer a simple and flexible way to load data with minimal memory overhead, ideal for in-memory and custom datasets. It’s lightweight but lacks distributed and lazy loading features.


| Feature                  | Hugging Face Datasets | Ray Data | Daft | PyTorch Dataset + DataLoader |
| ------------------------ | --------------------- | -------- | ---- | ---------------------------- |
| Parallel Processing      | +                     | +++      | ++   | +                            |
| Distributed Processing   | 0                     | +++      | +++  | 0                            |
| Caching & Memory Mapping | +++                   | +        | +    | 0                            |
| Lazy Loading             | +++                   | ++       | +++  | +++ (depends)                |
| Simple to Use            | +++                   | +        | ++   | +++                          |
| Built-in Dataset Access  | +++                   | 0        | 0    | +++                          |
| Custom Transformations   | ++                    | +++      | +++  | +++                          |
| ML Framework Support     | +++                   | +++      | ++   | ++                           |

: Table Summarization

## Mini Benchmark
| Tool                     | Num_worker | Pin_memory | Cache | Configuration                | Time       |
| ------------------------ | ---------- | ---------- | ----- | ---------------------------- | ---------- |
| **HF Element**           | None       | None       | False | .map                         | 6m48s      |
|                          | None       | None       | True  | .with_transform              | **3m23s**  |
|                          | 4          | None       | False | .map                         | 9m16s      |
|                          | 2          | None       | False | .map, persistent_worker=True | 8m50s      |
|                          | 2          | True       | True  | .map                         | 4m7s       |
|                          | None       | None       | False | .map, num_proc=2             | 6m17s      |
|                          | None       | None       | True  | .map, num_proc=2             | 4m4s       |
| **HF Batched**           | None       | None       | False | .map                         | 7m14s      |
|                          | None       | None       | False | .map, num_proc=4             | 4m57s      |
|                          | None       | None       | False | .map, num_proc=4, size=64    | 5m25s      |
|                          | None       | None       | True  | .map                         | **3m22s**  |
|                          | 4          | True       | False | .map                         | 4m         |
|                          | 4          | True       | False | .map                         | 5m34s      |
|                          | 2          | True       | False | .map                         | 5m3s       |
| **Torch Dataset/Loader** | None       | None       | -     | Default                      | 3m20s      |
|                          | None       | None       | -     | Default                      | 3m26s      |
|                          | 4          | True       | -     | Default                      | 4m9s       |
|                          | 2          | True       | -     | Default                      | 3m44s      |
| **Daft**                 | -          | -          | -     | daft-default                 | **14m55s** |
|                          | -          | -          | -     | daft-native                  | **3m30s**  |
| **Ray**                  | -          | -          | -     | Default                      | 7m41s      |

Running on full sized images we get a bit more interesting results:

| Tool                 | Num_worker | Pin_memory | Cache | Configuration  | Time                 |
| -------------------- | ---------- | ---------- | ----- | -------------- | -------------------- |
| **Additional Tests** | -          | -          | -     | torch          | 4m19s                |
|                      | -          | -          | -     | hf_with_transf | 4m40s                |
|                      | -          | -          | -     | hf_map         | 8m14s, cached: 7m21s |
|                      | -          | -          | -     | daft           | **3m49s**            |

## Developer Experience (DX)

::: {.panel-tabset}
## HuggingFace Datasets
```python
def test_elem_by_elem(num_workers: int | None, pin_memory: bool | None, cache: bool):
    if not cache:
        datasets.disable_caching()

    def _preprocess(data: dict):
        imgs = [utils.PREPROCESS_TRANSFORMS(x.convert("RGB")) for x in data["image"]]
        data["image"] = imgs
        return data

    ds = datasets.load_from_disk("./imagenette_full_size")

    def _augment(data: dict):
        tensor = _preprocess(data["image"])
        data["image"] = utils.AUGMENTATIONS(tensor)
        return data

    ds_train = ds["train"].with_transform(_augment)
    ds_valid = ds["validation"].with_transform(_preprocess)

    kwargs = dict(
        num_workers=num_workers or 0,
        persistent_workers=bool(num_workers),
        pin_memory=pin_memory,
        batch_size=32,
    )
    dls_train = torch.utils.data.DataLoader(ds_train, **kwargs)
    dls_valid = torch.utils.data.DataLoader(ds_valid, **kwargs)
    
```

## PyTorch "native"
```python
class ImagenetteDataset(Dataset):
    def __init__(self, hf_dataset, preprocess=None, augment=None):
        self.hf_dataset = hf_dataset
        self.preprocess = preprocess
        self.augment = augment

    def __len__(self):
        return len(self.hf_dataset)

    def __getitem__(self, idx):
        data = self.hf_dataset[idx]

        image = data["image"].convert("RGB")

        # Apply preprocessing and augmentation if specified
        if self.preprocess:
            image: torch.Tensor = self.preprocess(image)
        if self.augment:
            image = self.augment(image)

        return {
            "image": image,
            "label": data["label"],
        }
train_dataset = ImagenetteDataset(
    ds["train"], preprocess=utils.PREPROCESS_TRANSFORMS
)
print(len(train_dataset))
valid_dataset = ImagenetteDataset(
    ds["validation"], preprocess=utils.PREPROCESS_TRANSFORMS
)

# Create DataLoader instances
kwargs = dict(
    num_workers=num_workers or 0,
    persistent_workers=bool(num_workers),
    pin_memory=pin_memory,
    batch_size=32,
)
dls_train = DataLoader(train_dataset, shuffle=True, **kwargs)
dls_valid = DataLoader(valid_dataset, **kwargs)
```


## Daft
```python
def load_imagenette_datasets_daft(dataset_path="./imagenette_full_size"):
    ds = datasets.load_from_disk(dataset_path)
    extract_img_bytes = daft.col("image").struct.get("bytes").alias("image")
    ds_train = daft.from_arrow(ds["train"].data.table).select(
        "label", extract_img_bytes
    )

    ds_valid = daft.from_arrow(ds["validation"].data.table).select(
        "label", extract_img_bytes
    )

    img_decode_resize = (
        daft.col("image").image.decode(mode="RGB").image.resize(224, 224)
    )

    ds_train = ds_train.with_column("image", img_decode_resize)
    ds_valid = ds_valid.with_column("image", img_decode_resize)

    def to_f32_tensor(ds: daft.DataFrame):
        return ds.with_column(
            "image",
            daft.col("image").apply(
                lambda x: (x / 255.0).transpose(2, 0, 1),
                return_dtype=daft.DataType.tensor(daft.DataType.float32()),
            ),
        )

    ds_train = to_f32_tensor(ds_train)
    ds_valid = to_f32_tensor(ds_valid)

    ds_train = ds_train.to_torch_iter_dataset()
    ds_valid = ds_valid.to_torch_iter_dataset()

    dls_train = torch.utils.data.DataLoader(ds_train, batch_size=32)
    dls_valid = torch.utils.data.DataLoader(ds_valid, batch_size=32)
    return dls_train, dls_valid
```


## Ray
```python
def load_imagenette_datasets_ray(dataset_path="./imagenette_full_size"):
    # Load the Arrow dataset with Ray
    ds = datasets.load_from_disk(dataset_path)

    def extract_img_to_pil(data):
        image = data["image"]["bytes"]
        data["image"] = PIL.Image.open(io.BytesIO(image)).convert("RGB")
        return data

    ds_train = ray.data.from_huggingface(ds["train"]).map(extract_img_to_pil)
    ds_val = ray.data.from_huggingface(ds["validation"]).map(extract_img_to_pil)

    preprocess_transforms = transforms.Compose(
        [
            utils.PREPROCESS_TRANSFORMS,
        ]
    )
    augmentation_transforms = utils.AUGMENTATIONS

    # Apply transformations in Ray
    def preprocess_image(batch):
        batch["image"] = [preprocess_transforms(x) for x in batch["image"]]

        return batch

    def augment_image(elem):
        elem["image"] = augmentation_transforms(elem["image"])

        return batch

    ds_train = ds_train.map_batches(preprocess_image).map(augment_image)

    ds_val = ds_val.map_batches(preprocess_image)

    d_train = ds_train.to_torch(
        label_column="label",
        batch_size=32,
        local_shuffle_buffer_size=512,
        prefetch_batches=5,
    )
    d_valid = ds_val.to_torch(label_column="label", batch_size=32, prefetch_batches=5)

    return d_train, d_valid
```

:::


I think most of the frameworks ends up at a similar place in the experience. 

**Quick DX Ranking**


1. PyTorch & HuggingFace Datasets
2. Daft
3. Ray (albeit I believe it to be the most scalable solution as you can truly tinker in detail)

I enjoyed _Daft_ a lot with its multi-modal syntax, inspired by polars with namespaces (e.g. `.image.decode()`), which can be phenomenal. Working with DataFrame's is a cool addition, where you can drop into python simply by using `apply`.   
Working with _Daft_ more and more I noticed that the DataFrame syntax sometimes becomes a big blocker and the simplicity of HF Datasets and Ray using `dict`'s in `.map` statements results in easier code and smoother integration with existing libraries.  
Additionally HF Datasets / PyTorch DataLoaders feels more pythonic, where the latter is real simple. I can't put my finger on it but they just seem easier to debug and understand.

It'll sure be interesting to follow the progress being made, and I'm happy the dust isn't settled yet!


# Appendix

## Appendix A. _Additional Benchmarks_
