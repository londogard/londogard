import datasets
import utils
import torch.utils.data
import numpy as np
import lightning as L


def test_single_map(num_workers: int | None, pin_memory: bool | None, cache: bool):
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
    trainer = L.Trainer(max_epochs=5)
    model = utils.SimpleModel()

    trainer.fit(model, dls_train, dls_valid)


def test_batch_map(num_workers: int | None, pin_memory: bool | None, cache: bool):
    if not cache:
        datasets.disable_caching()

    ds = datasets.load_from_disk("./imagenette_full_size")

    def _preprocess(data: dict):
        data["image"] = [x.convert("RGB") for x in data["image"]]
        data["image"] = [utils.PREPROCESS_TRANSFORMS(x) for x in data["image"]]

        return data

    ds = ds.map(_preprocess, batched=True, num_proc=4)

    def _augment(data: dict):
        data["image"] = [utils.AUGMENTATIONS(x) for x in data["image"]]
        return data

    ds_train = ds["train"].with_transform(_augment).with_format("torch")
    ds_valid = ds["validation"].with_format("torch")
    kwargs = dict(
        num_workers=num_workers or 0,
        persistent_workers=bool(num_workers),
        pin_memory=pin_memory,
        batch_size=32,
    )
    dls_train = torch.utils.data.DataLoader(ds_train, **kwargs)
    dls_valid = torch.utils.data.DataLoader(ds_valid, **kwargs)
    trainer = L.Trainer(max_epochs=5)
    model = utils.SimpleModel()

    trainer.fit(model, dls_train, dls_valid)


if __name__ == "__main__":
    test_single_map(None, None, cache=True)
