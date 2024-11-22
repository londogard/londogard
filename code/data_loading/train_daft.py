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

daft.set_execution_config(enable_native_executor=True, default_morsel_size=256)


def load_imagenette_datasets_daft(dataset_path="./imagenette_full_size"):
    ds = datasets.load_dataset(dataset_path)
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


def load_imagenette_raw_daft():
    df_train = daft.from_glob_path("imagenette2-160/train/**/*.JPEG")
    df_val = daft.from_glob_path("imagenette2-160/val/**/*.JPEG")
    train_cols = {
        "image": daft.col("path").url.download(),
        "label": daft.col("path").str.extract(".*train/(n\d+)/.*", 1),
    }
    df_train = df_train.with_columns(train_cols)
    df_val = df_val.with_columns(train_cols)

    uniq_labels = df_train.select("label").distinct().to_pandas()
    label_to_number = {v: k for k, v in enumerate(uniq_labels["label"])}

    def to_num(x) -> int:
        return int(label_to_number[x])

    tn = daft.col("label").apply(to_num, return_dtype=daft.DataType.int64())
    df_val = df_val.with_column("label", tn)
    df_train = df_train.with_column("label", tn)

    img_decode_resize = (
        daft.col("image").image.decode(mode="RGB").image.resize(224, 224)
    )

    ds_train = df_train.with_column("image", img_decode_resize)

    ds_valid = df_val.with_column("image", img_decode_resize)

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

    ds_train = ds_train.select("image", "label").to_torch_iter_dataset()
    ds_valid = ds_valid.select("image", "label").to_torch_iter_dataset()
    
    dls_train = torch.utils.data.DataLoader(ds_train, batch_size=32)
    dls_valid = torch.utils.data.DataLoader(ds_valid, batch_size=32)
    return dls_train, dls_valid


def train_model():
    dls_train, dls_valid = load_imagenette_datasets_daft()
    # dls_train, dls_valid = load_imagenette_raw_daft()
    # Initialize trainer and model
    trainer = L.Trainer(max_epochs=5)
    model = utils.SimpleModel()

    # Train the model
    trainer.fit(model, dls_train, dls_valid)


if __name__ == "__main__":
    train_model()
