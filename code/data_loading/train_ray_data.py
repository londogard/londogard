import io
import PIL
import PIL.Image
import numpy as np
import ray
from ray import train
from ray.data import read_parquet
import lightning as L
import torch
import utils
from torchvision import transforms

# Start Ray (skip if already started)
ray.init(ignore_reinit_error=True)
import ray.data
import datasets


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

    def augment_image(batch):
        batch["image"] = augmentation_transforms(batch["image"])

        return batch

    # Preprocess and augment train and validation sets
    ds_train = ds_train.map_batches(preprocess_image).map_batches(augment_image)
    # ds_train = ds_train.map(augment_image)
    ds_val = ds_val.map_batches(preprocess_image)

    d_train = ds_train.to_torch(
        label_column="label",
        batch_size=32,
        local_shuffle_buffer_size=512,
        prefetch_batches=5,
    )
    d_valid = ds_val.to_torch(label_column="label", batch_size=32, prefetch_batches=5)

    return d_train, d_valid


def train_model():
    dls_train, dls_valid = load_imagenette_datasets_ray()

    # Initialize trainer and model
    trainer = L.Trainer(max_epochs=5)
    model = utils.SimpleModel()

    # Train the model
    trainer.fit(model, dls_train, dls_valid)


if __name__ == "__main__":
    train_model()
