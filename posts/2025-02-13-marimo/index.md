---
title: "Marimo - A new Notebook/App on the block!"
description: "Marimo tries to replace multiple tools by being a Reactive Notebook (reproducible), Web App and Python Script at once. It's a beautiful kit that could end up accelerating in adoption quickly."
categories: [python, app, notebook]
date: "2025-02-13"
---

# Marimo

Marimo is the "new" kid on the block. Based on what Marimo tries to achieve you can't help yourself but comparing it too other frameworks such as *Gradio, Jupyter, Streamlit, Solara & Panel*.

> **The fact that there's a plethora of options** to build WASM apps/tools and "*literate programming"* through notebook-style **is nothing short of amazing**\
> We're in for a great time!
>
> Drawback? What do I choose!

I'll put a little focus on comparing, especially their WASM usage via [pyodide](https://pyodide.org/), where I the first time wrote about [stlite](https://stlite.net/) in my [blog](https://blog.londogard.com/posts/2024-02-22-stlite/)  (Feb, 2024). Since I discovered WASM deployments via *base64-URLs* and *standalone-HTML-file* I was amazed at the opportunity to deploy simple-to-use tools for your colleagues. 

Marimo tries to become great at multiple battlegrounds, among them WASM and Notebooks. Marimo is a reactive notebook with built-in UI components that can be turned into an app easily.

\

## Usage

I'll start by sharing my current go-to tool for each area of use, and then try to fit Marimo into this.

- Heavy Applications: [Solara](https://solara.dev/) 

    - Pros: 'React' style of programming, very efficient bindings and updates

    - Cons: Not the most modern UI, 

- Simple Applications: [Streamlit](https://streamlit.io/) 

    - Pros: Simple, Modern UI, Large Community

    - Cons: The "execute everything on each change" execution is quite inefficient and with caching reasoning grows harder with time

- WASM Apps: Streamlit via stlite

- ML Demos with API: Gradio

    - Pros: Simple, provides `gradio_client` REST API by default (AMAZING)

    - Cons: I hate building Gradio apps

- Notebook: Jupyter

\

Marimo could possibly replace most in the list, but especially WASM Apps and Notebook. Potentially it can take on ML Demos and Simple Applications too, and why not Heavy?

Marimo is bold at trying to achieve everything, perhaps too bold. Let us dive into this!

\

## WASM

I'm very happy about the fast-paced [Pyodide](https://pyodide.org/en/stable/) development, and that *all my tools support WASM*, i.e. running fully inside the browser.

I'd like to say that [*stlite*](https://stlite.net/) and [*py.cafe*](https://py.cafe/) are quite cool wrappers but *marimo* takes it one step further, while *jupyter lite* takes it one step backwards by not having simple "sharing". Though the Jupyter Lite is excellent in itself!

\

## Quick Rankings

|            |                    |                                      |                |
| ---------- | ------------------ | ------------------------------------ | -------------- |
| **Action** | 🥇                  | 🥈                                    | 🥉              |
| WASM       | stlite, Marimo     | py.cafe (streamlit & solara), gradio | jupyter lite   |
| Notebook   | Jupyter & Marimo   | Streamlit                            | Solara, gradio |
| App        | Streamlit & Solara | Marimo, gradio                       | Jupyter        |
> **WASM Notes**
>
> `stlite` can be deploy as single HTML file, but depends on network then (fetching CDN resources).
>
> `marimo` can be deployed as a HTML folder that needs to be server, but requires no network.
>
> `stlite`, `marimo`, and `py.cafe` all enable "base64-url-apps", i.e. you can have a single URL that contains the full application and can run on their webpage!
>
> `jupyterlite` is really good as a tool, but the share-ability is awful.
>
> `gradio` works decently in WASM, but it has a big pro which is its API when running the real app. The `gradio_client` is an amazing initiative.

If we put scores on each (3,2,1 for 1st, 2nd, and 3rd) we end up with the following:

1. **Marimo & Streamlit:** **8pts**

1. **Solara:** 6pts

1. **Jupyter & Gradio:** 5pts

It seems Marimo ends up covering all needs quite well based on my initial research. Streamlit has just as many points thanks for `stlite`, the community around Streamlit makes it a hero-tool!\
But how do you actually use Marimo, ***and can it beat Streamlit by having a smarter execution system?***

\

## Marimo Intro

There's two ways to run Marimo, 1. Python or 2. WASM.  

### Python

This is essentially like running a Jupyter Notebook in your local python env. It starts a marimo kernel that handles your execution:

```
marimo edit # open marimo editor and app
```

### WASM

Running in a sandboxed Python (pyodide) environment *inside* your browser! 🤯

This is phenomenal way to share your "tools" with the team! The `stlite` approach of being able to embed everything inside a single HTML file (via CDN assets) makes this really cool to, but the URL with files as b64-encode is great too. For some company you might want to self-host which is *incredibly easy*.\
I also posted an issue to actually enable single-HTML file like `stlite` ([here](https://github.com/marimo-team/marimo/issues/3667) ).

\

\

\::: {tip}

# Resource Comparison

It seems that Marimo actually utilizes a lot less RAM to run a basic notebook which is a good thing!

|                                                                           |                         |
| ------------------------------------------------------------------------- | ----------------------- |
| App                                                                       | WASM Memory Consumption |
| Marimo                                                                    | **400 MB**              |
| stlite                                                                    | 600 MB                  |
| jupyterlite                                                               | >1GB                    |
| gradio_lite                                                               | 522 MB                  |
| pyodide (via [pydantic.run](https://pydantic.run/) no UI or dependencies) | **200 MB**              |
\:::

# Marimo

## A basic App Example

I'll share examples from [docs.marimo.io](https://docs.marimo.io/#a-reactive-programming-environment) which is a good resource to get started.

**UI Components:**

[https://docs.marimo.io/_static/readme-ui.mp4](https://docs.marimo.io/_static/readme-ui.mp4) 

**DataFrame Explorer:**\
[https://docs.marimo.io/_static/docs-df.mp4](https://docs.marimo.io/_static/docs-df.mp4)\
**SQL Mixin**\
[https://raw.githubusercontent.com/marimo-team/marimo/main/docs/_static/readme-sql-cell.png](https://raw.githubusercontent.com/marimo-team/marimo/main/docs/_static/readme-sql-cell.png) 

**Plotting Callbacks**

[https://docs.marimo.io/_static/embedding.mp4](https://docs.marimo.io/_static/embedding.mp4) 

[https://cms.marimo.io/landing/3.mp4](https://cms.marimo.io/landing/3.mp4) 

\

**Standouts:**

1. Deterministic Execution Order (annoying but helpful)

    1. It's a tad bit confusing to have it possible to have cells in random order, but **at least it's reproducible** compared to Jupyter!

1. Built-in Package Management (especially handy for WASM)

1. Pretty elements for a notebook (comparing with ipywidgets..)

    1. What's even cooler is that you can easily combine UI components in a markdown string. Making a seamless flow!

## Marimo Editor

While the editor is excellent I found it quite poor in picking up local project files outside the script itself for auto-completion. This is where [watching](https://docs.marimo.io/guides/editor_features/watching/) helps:

```
marimo edit --watch 
```

\
Which enables editing in your local IDE and watch changes in the browser. I think this is a nice balance where you can opt to edit directly in IDE or in browser depending on your current need. But VS Code / PyCharm's built in Notebooks are unbeatable in the User Experience (i.e. Autocompletion + Visualization)! 🤓 

**If Marimo could pick up IntelliSense from the IDE that'd be a great improvement!** The auto-complete in internal projects are especially poor.

\

## Marimo Gotchas

There's a few things one need to think about when developing a Marimo app/notebook.

### Reactive Execution

The reactive nature of Marimo makes it reproducible, but building Apps with reactive execution makes it simple to accidentally "trigger" actions when you didn't anticipate to. Especially as you might be used to Jupyter and not having "auto-run".

**Fixes:**

1. Set expensive/dangerous actions behind a button (define it in a function)

1. Apply `mo.stop` to stop execution.

1. Disable cell ([example](https://docs.marimo.io/guides/reactivity/#disabling-cells))

1. Make "lazy execution" of cell or all cells. This will neatly gray cells that are out-of-sync

![](https://images.amplenote.com/384cdeec-d88b-11ef-b6ab-a76117c9f257/ec4f09a0-44df-433b-a0b1-f49b1c295418.png) [^1]

![](https://images.amplenote.com/384cdeec-d88b-11ef-b6ab-a76117c9f257/08977551-7517-40c8-bf57-829cf7167b9c.png) [^2]

### UI vs root namespace

Marimo mixes `mo.ui.\*` and `mo.\*` namespace for different things.

`mo.ui.\*` includes reactive UI components, e.g. button & slider, while `mo.\*` includes display UI components such as image or video.

This is quite confusing and I think the namespacing issue is a larger one than one might anticipate, as you tend to get lost on where to find what you wish to draw.

What's cool though is that, just like Jupyter, Marimo tries to auto-display element using nice visualization.

\

### Only final element is visible

Only the final component added is actually displayed, in my opinion all `mo.ui` components should be displayed if they're added. It'd make more sense.

One can wrap elements inside a markdown text, accordion or other type of "display multiple elements".

[^1]: D
    +
    1 v def handle_file( filepath_or_url: str \| Path):
    6m
    2
    s = str(filepath_or_url)
    3
    data = {"path": s, "meta": {"_type": "gradio. FileData"}}
    4
    return data
    5
    +
    6
    a = handle_file("ses. dpy")
    v{ 2 Items
    "path": "ses. py"
    v "meta" : { 1 Item
    "_type": "gradio. FileData"
    D
    . . .
    1
    a

[^2]: This cell has not been run with the latest input
    D
    . . .
    4ms
