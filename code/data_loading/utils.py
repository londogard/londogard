from datasets import load_dataset
import datasets
import numpy as np
import torchvision.transforms as T
from torch import nn
import lightning as L
from torch import optim, nn, utils, Tensor


def setup_datasets():
    ds: datasets.DatasetDict = load_dataset("frgfm/imagenette", "full_size")
    ds.save_to_disk("imagenette_full_size")


PREPROCESS_TRANSFORMS = T.Compose([T.Resize((224, 224)), T.ToTensor()])

AUGMENTATIONS = T.Compose(
    [
        T.RandomHorizontalFlip(p=0.1),
        T.RandomVerticalFlip(p=0.1),
        T.RandomErasing(p=0.1),
        # T.AutoAugment(),
    ]
)


class SimpleModel(L.LightningModule):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=(3, 3)),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=(2, 2)),
            nn.Conv2d(32, 64, kernel_size=(3, 3)),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=(2, 2)),
            nn.Flatten(),
            nn.Dropout(0.5),
            nn.Linear(64 * 54 * 54, 9),
            nn.Softmax(),
        )

    def training_step(self, batch, batch_idx):
        if isinstance(batch, dict):
            x, y = batch["image"], batch["label"]
        else:
            x, y = batch
            x = x.squeeze(1)
            y = y.squeeze(1)
        y_hat = self.model(x.float())
        loss = nn.functional.cross_entropy(y_hat, y)

        self.log("train_loss", loss)
        return loss

    def validation_step(self, batch, batch_idx):
        if isinstance(batch, dict):
            x, y = batch["image"], batch["label"]
        else:
            x, y = batch
            x = x.squeeze(1)
            y = y.squeeze(1)

        y_hat = self.model(x.float())
        loss = nn.functional.cross_entropy(y_hat, y)

        self.log("val_loss", loss)
        return loss

    def configure_optimizers(self):
        optimizer = optim.Adam(self.parameters(), lr=1e-3)
        return optimizer


setup_datasets()
