---
title: "Pixi - Real World Usage"
description: "The last few weeks I've put Pixi to the test, utilizing it in real world usage"
categories: [python, dependencies, packaging]
date: "2024-12-17"
---

Managing dependencies and environments across multiple platforms can be a nightmare. That's why I was thrilled to discover [Pixi](pixi.sh/dev/).
I've previous talked about Pixi on LinkedIn/Twitter, but haven't used it in any "serious" project until recently and so far it has worked exceptional!

Imagine a tool that combines the speed and efficiency of [_uv_](https://github.com/astral-sh/uv) with the robust package management of [_mamba_](https://github.com/mamba-org/mamba). That's Pixi in a nutshell. Built from the expertise drawn from as the mamba creators and utilizing `uv` for PyPi dependenciess, Pixi offers a streamlined, powerful way to manage Python environments.
Compared to _mamba_, _pixi_ takes things one step further as their PyPi-dependencies are tested with conda on top of the additional tools brought by pixi, such as _tasks_.

Cherry on top? Pixi is lightning fast and enables multi-platform & multi-environment inside a single file where everything is synced together.  

> Multi-platform, multi-environment means that we can sync dependencies between osx-arm64, linux-64, CUDA, CPU, ... - a standout feature!

## Pixi Docker Builds

After solving your local environment in a easy yet producible manner the next step is to solve it for your cloud workloads - _containerization_.  

Containerization is an important part of a developers toolkit in the modern world. To run cloud workloads it's very common to deploy as a container, in Data Science this is for everything like Training, Inference and Data Pipelines.

With pixi it's quite straight-forward and they provide ready-to-use images through the [pixi-docker](https://github.com/prefix-dev/pixi-docker) registry. There's multiple base-images, including CUDA, to get started - it can't be any simpler!

### Pixi Sample Docker Builds

Simple starter:
```bash
docker pull ghcr.io/prefix-dev/pixi:latest
```
Find the different tags on [Pixi Docker tags page](https://github.com/prefix-dev/pixi-docker?tab=readme-ov-file#pulling-the-images).


Efficient Production build by using Docker Multi-Stage Build: [prefix-docker/shell-hook](https://github.com/prefix-dev/pixi-docker?tab=readme-ov-file#usage-with-shell-hook).

### Pixi Docker Build on AWS Sagemaker

Sagemaker can be quite challenging to work with. While deploying custom Docker builds is easiest using their own base image, this image is often bloated with unnecessary dependencies. Additionally, to run `@remote` jobs on AWS, you need to include a `conda` or `mamba` environment - something that `pixi` doesn't inherently use.

**So, how do we integrate Pixi with Sagemaker?**

Here's a workaround to make them play nicely together:

1.  **Include `micromamba`:** Add `micromamba` (available on `conda-forge`) as a dependency in your `pixi.toml`. This will allow us to create a conda-like environment within our Pixi setup. 
    *   In the future this could be done using a simple shell script, which is a planned improvement in my own projects.
2.  **Add `micromamba` to `$PATH`:** Ensure that the `micromamba` executable installed by Pixi is added to your system's `$PATH`. This will make it accessible to Sagemaker.
3.  **Set Environment Variables:** Configure necessary environment variables like `CONDA_PREFIX` to point to the appropriate location where `micromamba` will manage your environment.

With these steps, you're ready to run your Pixi-managed projects on Sagemaker!

In my experiments, this approach significantly reduced the size of my CUDA images from around 12 GB down to 4.5 GB - a massive improvement in terms of storage and deployment speed!

## Pixi Multi-Platform/Environment

One of Pixi's standout features is its seamless support for multi-platform and multi-environment projects. While I initially planned to delve deeper into this, prefix.dev recently published an excellent guide on the topic. I highly recommend checking out their documentation on [combining different OS's and environments (CPU, CUDA) with PyTorch](https://pixi.sh/dev/features/pytorch/#mixing-macos-and-cuda-with-pypi-dependencies) for a comprehensive overview.


### Some Personal Comments

Personally I find this part of pixi one of the biggest strengths, especially how easy it is to work with! To build a docker image you simply follow the basic example above, opting for `--feature=cuda`.  
The part of keeping lock-files on everything, while allowing certain OS:es missing out on dependencies makes it very practical in real-world scenarios!

## Pixi Build Slimmming

When containerizing your code, it's crucial to keep builds slim. Here are a few tricks to help you minimize your Pixi-based Docker images:

1.  **Leverage `.dockerignore`:** Create a `.dockerignore` file to exclude unnecessary files and directories (e.g., `.git`, `__pycache__`, tests) from your Docker build context.
2.  **Optimize Dependencies:**
    *   Carefully consider each dependency and remove any that are not strictly required for production.
    *   Utilize multiple environments within your `pixi.toml`, e.g. `prod` and `dev` environments. This allows you to exclude dev-specific dependencies (test, lint, ..) from your production container.
3.  **Employ Multi-Stage Docker Builds:** Multi-stage builds reduces the image size. Use a build stage to install dependencies and compile your application, and then copy only the necessary artifacts to a smaller, leaner final image. The `pixi-docker` project provides guidance on using [multi-stage builds with shell-hook](https://github.com/prefix-dev/pixi-docker?tab=readme-ov-file#usage-with-shell-hook).


# Pixi vs uv

While _uv_ has gained significant traction in the Python community, I believe _Pixi_ offers a more compelling solution for my specific needs, especially when it comes to complex, real-world projects.

Why?

1.  **`tasks` are awesome.** They might not be perfect but they're great to me!
2.  **Multi-platform and Multi-environment projects** (personal opinion) somehow ends up easier in Pixi
    *   I really tried to embrace the `uv` approach as I appreciate it as more lightweight. But Pixi is somehow "smoother".
3.  **Pixi has base-images with CUDA**
    *   Both tools are easy to build from a raw base-image too, so it's not a huge problem
4.  **Access to `conda` packages**
    *   Some hate it, but I like getting pre-built binaries.
    *   It's quite interesting to install shell tools via `conda` for container deployment.
5.  **Possible to work with other languages than Python**

### What is the one big `uv` pro?  
[UV's Inline Script Dependencies](https://docs.astral.sh/uv/guides/scripts/#declaring-script-dependencies)

I think this feature is really cool, ~~but as pixi utilize `uv` you can use it in `pixi` too! ;)~~ but it's quite easy to replicate in `pixi` as well (including with `uv`)! ;)

::: {.callout-tip}
#### How to run in 'inline script' in Pixi
Simply call `pixi exec uv run a.py`. See the [docs (cli/#exec)](https://pixi.sh/latest/reference/cli/#exec) where you're able to also run shell-scripts with a [shebang](https://pixi.sh/latest/advanced/shebang/). This will actually install `uv` in a temporary env, and then use that `uv`.

A bonus of `exec` is that if you instead use the "pixi-native" ~~`--scope`~~ `--spec` it supports conda too, e.g. `pixi exec -s polars -s altair python` to run a temporary python venv with `polars` & `altair`.

**Edit:** Added this callout 2025-03-07 and updated 2025-03-10 based on feedback from _markusschlenker_.  
**Edit 2:** I want to add that you can also easily add `uv` as a global tool (like installing it), through `pixi global install uv`.
:::

```python
# /// script
# dependencies = [
#   "requests<3",
#   "rich",
# ]
# ///

import requests
from rich.pretty import pprint

resp = requests.get("https://peps.python.org/api/peps.json")
data = resp.json()
pprint([(k, v["title"]) for k, v in data.items()][:10])
```

# Outro

If you're a Python developer struggling with dependency management, environment inconsistencies, or cumbersome container builds, I urge you to give Pixi a try. It's a powerful tool that has the potential to streamline your workflow and make you a happier developer. Pixi has certainly made a significant difference in mine!

Thanks for this time,
Hampus Londögård
