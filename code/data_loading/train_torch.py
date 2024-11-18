from pathlib import Path
import re
import torch
from torch.utils.data import Dataset, DataLoader
from datasets import load_from_disk
import utils  # assuming this contains your PREPROCESS_TRANSFORMS and AUGMENTATIONS
import lightning as L
from PIL import Image

path_regex = re.compile(r".*/(train|val)/(n\d+)/.*")


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


class ImagenetteRawDataset(Dataset):
    def __init__(self, paths, label_to_num, preprocess=None, augment=None):
        self.paths = paths
        self.preprocess = preprocess
        self.augment = augment
        self.label_to_num = label_to_num

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, idx):
        data = Image.open(self.paths[idx])
        image = data.convert("RGB")

        label = re.match(path_regex, str(self.paths[idx]))[2]

        # Apply preprocessing and augmentation if specified
        if self.preprocess:
            image: torch.Tensor = self.preprocess(image)
        if self.augment:
            image = self.augment(image)

        return {
            "image": image,
            "label": self.label_to_num[label],
        }


def load_imagenette_files(
    num_workers: int | None,
    pin_memory: bool | None,
    dataset_path="./imagenette2-160",
):
    train_paths = (Path(dataset_path) / "train").rglob("*.JPEG")
    val_paths = (Path(dataset_path) / "val").rglob("*.JPEG")
    # Create PyTorch-compatible datasets
    labels = (Path(dataset_path) / "train").glob("*")
    label_to_num = {v.name: k for k, v in enumerate(labels)}

    train_dataset = ImagenetteRawDataset(
        list(train_paths), label_to_num, preprocess=utils.PREPROCESS_TRANSFORMS
    )
    print(len(train_dataset))
    valid_dataset = ImagenetteRawDataset(
        list(val_paths), label_to_num, preprocess=utils.PREPROCESS_TRANSFORMS
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

    return dls_train, dls_valid


def load_imagenette_datasets(
    num_workers: int | None,
    pin_memory: bool | None,
    dataset_path="./imagenette_full_size",
):
    ds = load_from_disk(dataset_path)

    # Create PyTorch-compatible datasets
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

    return dls_train, dls_valid


def train_model(num_workers: int | None, pin_memory: bool | None):
    dls_train, dls_valid = load_imagenette_files(
        num_workers=num_workers, pin_memory=pin_memory
    )

    # Initialize trainer and model
    trainer = L.Trainer(max_epochs=5)
    model = utils.SimpleModel()

    # Train the model
    trainer.fit(model, dls_train, dls_valid)


if __name__ == "__main__":
    train_model(None, None)
