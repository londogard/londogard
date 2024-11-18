import daft.context
import daft.runners
import daft.runners.runner
import datasets
import torch
import daft
import utils  # Assuming this contains your PREPROCESS_TRANSFORMS and AUGMENTATIONS
import polars as pl
import lightning as L

# Start Daft (if not already initialized)


def load_imagenette_datasets_polars(dataset_path="./imagenette_full_size"):
    ds = datasets.load_from_disk(dataset_path)
    print(pl.from_arrow(ds["train"].data.table).estimated_size("mb"))
    exit()
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

    ds_valid = transform(ds_valid)
    ds_train = to_f32_tensor(ds_train)
    ds_valid = to_f32_tensor(ds_valid)

    ds_train = ds_train.to_torch_iter_dataset()
    ds_valid = ds_valid.to_torch_iter_dataset()

    dls_train = torch.utils.data.DataLoader(ds_train, batch_size=32)
    dls_valid = torch.utils.data.DataLoader(ds_valid, batch_size=32)
    return dls_train, dls_valid


def train_model():
    dls_train, dls_valid = load_imagenette_datasets_polars()

    # Initialize trainer and model
    trainer = L.Trainer(max_epochs=5)
    model = utils.SimpleModel()

    # Train the model
    trainer.fit(model, dls_train)


if __name__ == "__main__":
    train_model()
