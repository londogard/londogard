---
title: "TIL: Building Docker Images with Conda and Custom Users (and devcontainers!)"
description: ""
categories: [TIL]
date: "2024-02-18"
---

When building Docker containers there's a few things to clarify:

1. You're building something layer by layer
2. Things you do in Docker is not kept in `docker run` unless you specify it through special commands.
    - That is, it isn't a stateful operation to run `RUN conda activate highlights`.
3. Docker can be run as multiple users, but is built by default as `root`
4. The original container X, `FROM X`, can have an environment with magic enabled

I found a few problems based on all this when trying to deploy my Solara application using Docker.

1. `conda` path is not enabled by default, even if I modified `.bashrc`.
2. User permissions where not available, i.e. I wasn't allowed to create folders.
3. `devcontainer` as base image added a "default user" called `vscode`.

Let's go through each one step-by-step!

## Problem 1. Enabling `conda` in `docker run ..`

When running `docker run` no shell is applied by default. Additionally Docker defaults to `/bin/sh` because `bash` is not available in all images. This means that `.bashrc` modifications and similar **not applied** when starting your container!

There's a few ways to make the `conda env` available by default in your shell, I opted for what I found simplest - modifying `$PATH`.

See the following edit in `Dockerfile`

```bash
ENV PATH /opt/conda/envs/<ENV_NAME>/bin/:$PATH
```

Through this when my `CMD` I can call `solara run` (`solara` is a python library available in my env).

## Problem 2. Enabling permission to do OS changes, e.g. `os.mkdir`

As mentioned Docker is built using `root` user. From my understanding it is later run as any user depending on how you can `docker run`, this can deactivate capabilities to modify os. One such capability that I use is to run `mkdir` and creating files.

The simplest solution I found was to:

1. Create a new user
    - For HuggingFace spaces it's ID should be set as `-u 1000`
2. Allow new user to control the folder where you app resides `COPY --chown=user`
3. Default to running as `user` (`USER user`)

In a Dockerfile it ends up as follows.

```Dockerfile
RUN useradd -m -u 1000 user
USER user

COPY --chown=user . /app
...
```

Voila! That should make it work!

...unless you have a weird base-image that modifies the OS, i.e. `devcontainer` as base-image. More about this in the section below! 👇

## Problem 3. vscode user

I mentioned that my base-image, `FROM mcr.microsoft.com/vscode/devcontainers/miniconda:latest`, there already is a user on `id=1000`. This user is apparently called `vscode`!

> I found this by running `docker run -it <img_name> /bin/bash` and grokking around in the terminal.

This was a huge blocker for me and took a long while to understand. To enable my deployment I instead of creating a custom user hijacked the existing user `vscode`. See the final `Dockerfile`.

```Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/miniconda:latest

USER vscode

COPY --chown=vscode . /app
WORKDIR /app

RUN conda env create -f env.yml
RUN conda clean -a -y
RUN conda init

EXPOSE 8765

ENV PATH /opt/conda/envs/highlights/bin/:$PATH

CMD ["solara", "run", "sol_app.py", "--host=0.0.0.0"]
```

And that makes everything work! 
