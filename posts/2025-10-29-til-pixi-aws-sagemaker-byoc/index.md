---
title: "AWS Sagemaker Bring-Your-Own-Container (BYOC) with Pixi"
description: "A brief description on how to use your pixi environment inside a custom docker container on AWS Sagemaker (i.e. BYOC)"
categories: [python, aws, sagemaker]
date: "2025-10-29"
---

To run your own container in AWS Sagemaker (Training Job) it's required to have `mamba`. So how would you use `pixi` instead?

It's quite straight-forward, **first add `micromamba` as part of your dependencies in `pixi.toml`**. Then you update your docker to something like this:

```docker
FROM --platform=linux/amd64 ghcr.io/pixi

COPY pixi.toml pixi.lock ./

ENV PIP_DEFAULT_TIMEOUT=360
ENV UV_HTTP_TIMEOUT=360
RUN pixi install --frozen # use .lock-file

# === IMPORTANT PART ===
# Link micromamba as mamba, to support AWS sagemaker
# Replace <default> with the environment name you use

# 1. link environments `micromamba` to `mamba`
RUN ln -s /.pixi/envs/default/bin/micromamba /.pixi/envs/default/bin/mamba
# 2. Add pixi to PATH
ENV PATH="/.pixi/envs/default/bin:${PATH}"
# 3. Add MAMBA_ROOT_PREFIX
ENV MAMBA_ROOT_PREFIX=/.pixi

# This isn't used by AWS but nice-to-have for local testing
# RUN pixi shell-hook -e default > /shell-hook.sh
# RUN echo 'exec "$@"' >> /shell-hook.sh
# ENTRYPOINT ["/bin/bash", "/shell-hook.sh"]
```

This'll create a Docker image that's usable inside AWS Sagemaker and let you keep using `pixi` throughout your whole dev-cycle, remote and local!

Perhaps there's a easier way, if you know one please share in comments below! 👇

That's it for now,  
~Hampus Londögård

