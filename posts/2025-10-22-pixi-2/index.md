---
title: "Pixi - A year later"
description: ""
categories: [python]
date: "2025-10-22"
---

I've been using `pixi` professionally in my team for a year now, and it has been a pleasure from the start.  

**N.B.** We've also been utilizing `uv` inside the `pixi` environment.


> **Brief Intro**
> [`uv`](https://docs.astral.sh/uv/): A faster & better pip.
> [`pixi`](https://pixi.sh/): A faster and better pip+conda (bonus: beats mamba and works for other languages). Uses `uv` under-the-hood for pip installs.

From the moment I (we) started using uv/pixi something clicked. It's simple, fast and developer experience (DX) is at a new level. The way pixi seamlessly integrates uv makes me happy about the ecosystem.  
The reason I opted to use pixi rather than uv a year ago:

1. Conda Universe
2. Able to include CLI tools in environment, e.g. `ffmpeg` & `s5cmd`.
3. Pixi Tasks - alias your common workloads so no-one forget order. 
    * Might sound lazy, but it helps structure.

**The best part?** Everyone in the team has been pleased with the transition, and it's been improvements all around.  

Moving on I'd like to share what we've really enjoyed when you look back.

## Dependent Environments
This is not a pixi-only feature, but it's great to be able to have multiple environments in our base. We use a mono-repo style of working where we combine everything from 
Training to Monitoring in the same repo.

We set up a base environment which is shared among the sub-environments, this includes dependencies like `polars`, `deltalake` and `s5cmd` which is integral to our way of working.  
Then we extend base with `computer_vision` and add our CV related dependencies, and for our `data_pipeline` we extend with data utilities. 

What's great about this? We bump `polars` in one location and it'll be validated across all environments at the same time. 

What's also great? We can separate dependencies based on platform, i.e. `osx-arm64` will have a separate dependency from `linux-64` which is important as `osx-arm64` doesn't have CUDA.

## Pixi Tasks
Another featuer we've utilized more and more with time is `tasks`. They're easy yet powerful.

What type of tasks do we have this far?

1. `pixi run deploy_monitor`: deploy our Streamlit App to Snowflake
2. `pixi run labelme`: open our labeling program with the correct settings out-of-the-box, and refreshes the pre-signed s3-urls (yes, we've patched LabelMe to support URLs :wink:)
3. `pixi run docker_deploy`: build our docker containrs and push correctly to AWS based on arguments

With one word: _Awesome_.  
We've found it helpful in getting people setup and launching internal tools as there's no need to remember where script is and what order to run.

## Temporary Environments
Both Pixi and UV supports temporary environments and global tools. To test something out run:

### Temporary Environments
1. `pixi exec --with <dep> main.py`
2. `uv run --with <dep> main.py`

### Global Tools
1. `pixi global install <dep>`
2. `uv tool install <dep>`


# Final thoughts one year later
Pixi has been a huge success internally in my team, and I've been using both pixi and uv privately. Privately I tend to gravitate towards `uv` as I only have my own environment and it's a little bit "easier" (hard to explain).  

The idea of introducing a completely new tool, pixi, and hearing no complaints, but rather positive remarks is incredible and speaks magnitudes about how good pixi behaves in enterprise settings.   
To give some background the team started with broken pip-installs, "works on my computer", 2 years ago and I transitioned the team into micromamba which stabilized a lot. But it wasn't a fully positive experience in the team. 1 year ago I moved the team to pixi which has been a lot smoother and happy faces all around.

Happy team, happy life!  
~Hampus Londögård

