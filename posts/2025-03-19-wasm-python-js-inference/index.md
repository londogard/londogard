---
title: "Transformers.js.py accelerated on-device inference with Python WASM"
description: "I've previously talked about onnxruntime-web that enables accelerated on-device inference. There's now a wrapper that proxy Transformers.js to Pyodide. In this post I'll share how to do just that!"
categories: [python, wasm, js, inference, onnxruntime]
date: "2025-03-19"
---

[Transformers.js](https://huggingface.co/docs/transformers.js/en/index) is an ambitious project by HuggingFace to bring _transformers_ to Web/JS and simplify inference on-device, running `onnxruntime-web` under-the-hood.  
I've written blogs and apps with `onnxruntime-web`^[through JS / KotlinJS perspective], and I must say - I'm a sucker for efficient on-device inference!  

::: {.callout-tip collapse="true"}
# ONNX Runtime and `onnxruntime-web`

`onnxruntime-web` helps run models efficiently directly in your browser (JS) through the default backend _WASM_ (cpu).

Additionally you can accelerate inference via GPU/NPU when swapping backend to either `WebGL`, `WebGPU`, or `WebNN`. I think this is really cool as we can now develop Progressive Web Apps (PWA) that accelerate their inference using a smartphones NPU - crazy!

ONNX Runtime also supports many other ways to run inference, e.g. JVM, .NET, Python, and C++.
:::

And recently I learned about a thin wrapper around `transformers.js`, namely [Transformers.js.py](https://github.com/whitphx/transformers.js.py) that proxies the API to [Pyodide](https://pyodide.org/en/stable/)^[Pyodide is CPython port to WASM, enabling Python running directly in the browser].   
Right below 👇 I share how to run Object Detection.

## How to: Object Detection Inference

```{.python filename="infer.py"}
from transformers_js_py import import_transformers_js, as_url # <1>
transformers = await import_transformers_js()                 # <1>
pipeline = transformers.pipeline                              # <1>

img = "<URL_OR_PATH_TO_AN_IMAGE>"
pipe = await pipeline("object-detection") # <2>

pred = await pipe(as_url(img)) # <3>
print(pred) # list of predictions [{"score": float, "label": str, "box": dict[str, int]}, ...]
```
1. Import library and "import" `pipeline`
2. Set up `pipeline` object, downloading model and making things ready to run
3. Run inference. `as_url` converts local/virtual files to a URL as `pipeline` object requires URL's that can be opened in the JS context.

I share how to customize the inference in @sec-usage and a full-fledged WebApp with on-device inference using Marimo in @sec-marimo

## Why `transformer.js.py` + `pyodide`

There's a good question here: _why not run JS directly?_  
I don't have a great answer, it's all about trade-offs. 

JS enables "native" usage which likely works better in real-time applications, as it runs JS->WASM rather than WASM->JS->WASM.  
What JS doesn't have is a robust data science ecosystem, unlike Python. "Merging" the two through Pyodide makes sense, and further its fun! 🤓

::: {.callout-note collapse="true"}
# A quick Pro/Con list of JS vs Pyodide

**Why JS?**  

- **Pros:**
    - Faster / Realtime (as no WASM/JS communication)
    - Native integration in webapps
- **Cons:** 
  - Not great data science tools

**Why Python (Pyodide)?**  

- **Pros:**
  - Great ecosystem (PIL.Image, numpy, altair, polars, ...)
  - Familarity
  - Simpler PoC UI tools available (marimo, streamlit, solara, jupyterlite)
- **Cons:** 
  - Overhead moving data from Pyodide (WASM) to JS
    - Hard to make realtime because of this
:::

## Inference Customization {#sec-usage}


To select a specific model define the name as you build the pipeline.

```{.python filename="infer_options.py"}
pipe = await pipeline(
  "object-detection", # task_name # <1>
  "Xenova/yolos-tiny", # model_name # <2>
  {                                       # <3>
    dtype: "q4", # default "q8" for WASM. # <3>
    device: "webgpu", # default "WASM" (cpu) # <3>
    use_external_data_format: "false" # default "false", set "true" to load >= 2GB model # <3>
  } # <3>
)
```
1. Find all available tasks and their linked model-list [here](https://huggingface.co/docs/transformers.js/index#tasks).
2. Find all available Object Detection models [here](https://huggingface.co/models?pipeline_tag=object-detection&library=transformers.js).
3. Find all options [here](https://huggingface.co/docs/transformers.js/en/api/utils/hub#utilshubmodelspecificpretrainedoptions--code-object-code) and [here](https://huggingface.co/docs/transformers.js/en/api/utils/hub#utilshubmodelspecificpretrainedoptions--code-object-code).

Simple right?  
I'm continuously impressed by how far we've gotten. On-device inference, even with acceleration, is a painless thing today. If you want simplicity I recommend `web` and otherwise to use the _mobile_/_native_ releases or alternatively [LiteRT](https://ai.google.dev/edge/litert) (previously TFLite).

What's left?  
Improving the JS data science ecosystem, for now I prefer Pyodide because of the vast ecosystem. Though I'd like to congratulate `transformers.js` at successfully making inference simple for people who simply wants a blackbox. Personally I usually want to work with data before/after inference which requires better tools that Pyodide provides.


## WASM App using Marimo {#sec-marimo}

If you've read my blog you know I recently discovered [Marimo](https://marimo.io/), and as always with new tools you try to use them, perhaps a bit too much, whenever you can.  
I thought I'd give it a shot to integrate with `transformer.js.py` and run the inference fully on-device with WASM.  
It's certainly not real-time, but ~5 seconds per image is OK I'd say.

::: {#fig-infernce}
{{<video on-device-preds.mp4>}}

Marimo WASM App running inference on two images.
:::

All in all I think this approach is quite neat and could provide very useful, especially for Proof-of-Concepts or Internal Tooling.

Run the app yourself via my [marimo.io WASM notebook](https://marimo.io/p/@hlondogard/notebook-transformer-js-py-object-detection-wasm?show-code=false). Show the code by clicking the three dots in top-right corner.


Thanks for this time,  
Hampus Londögård