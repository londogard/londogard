# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "duckdb==1.2.0",
#     "fsspec==2025.2.0",
#     "marimo",
#     "pandas==2.2.3",
#     "polars==1.23.0",
#     "pyarrow==19.0.1",
# ]
# ///

import marimo

__generated_with = "0.11.13"
app = marimo.App(width="medium")


@app.cell
def _():
    import polars as pl
    import marimo as mo
    import os
    from pathlib import Path
    import duckdb
    import fsspec
    import pyarrow as pa

    os.environ["MARIMO_OUTPUT_MAX_BYTES"] = "10_000_000"
    return Path, duckdb, fsspec, mo, os, pa, pl


@app.cell
def _(mo):
    mo.md(
        r"""
        # File Conversion
        Convert file formats back and forth.
        """
    )
    return


@app.cell
def _(mo):
    file = mo.ui.file([".csv", ".parquet", ".json"], label="Upload File:")
    file
    return (file,)


@app.cell
def _(file, get_fmt, mo):
    title_c = mo.md("## Convert File")

    fmts = {"csv", "json", "parquet"} - {get_fmt(file.value[0].name)}
    formats = mo.ui.dropdown(fmts, label="Convert to format:", value=list(fmts)[0])
    return fmts, formats, title_c


@app.cell
def _(Path, df, duckdb, file, formats, mo):
    file_name = (
        f"{Path(file.value[0].name).stem}.{formats.value.replace('excel', 'xlsx')}"
    )


    def write_file():
        out = file_name
        if formats.value == "csv":
            return df.write_csv().encode("UTF-8")
        elif formats.value == "parquet":
            duckdb.from_arrow(df.to_arrow()).write_parquet(file_name)
            return file_name
        elif formats.value == "json":
            return df.to_pandas().to_json().encode("UTF-8")


    download_file = mo.download(write_file, filename=file_name)
    return download_file, file_name, write_file


@app.cell
def _(duckdb, pl):
    import pandas as pd
    import io


    def get_fmt(file_name: str) -> str:
        return file_name.rsplit(".")[-1]


    def read_file(file: "FileUploadResults") -> pl.DataFrame:
        fmt = get_fmt(file.name)
        data = io.BytesIO(file.contents)

        if fmt == "csv":
            return pl.read_csv(data)
        elif fmt == "json":
            return pl.from_arrow(duckdb.read_json(data))
        elif fmt == "parquet":
            return pl.from_pandas(pd.read_parquet(data))
    return get_fmt, io, pd, read_file


@app.cell
def _(file, mo, read_file):
    title_e = mo.md(
        """
    ## Explore File
    Start exploring and plotting!
    """
    )

    df = read_file(file.value[0])
    return df, title_e


@app.cell
def _(df, download_file, formats, mo, title_c, title_e):
    # "Transform DataFrame": mo.ui.dataframe(df),
    df_explore = mo.vstack(
        [
            mo.md("## DataFrame (with stats)"),
            df,
            mo.md("## Visualization (plots: limit=10_000)"),
            mo.ui.data_explorer(df.limit(10_000)),
        ]
    )

    tab_explore = mo.vstack([title_e, df_explore])


    tab_convert = mo.vstack([title_c, formats, download_file])
    mo.ui.tabs({"Convert": tab_convert, "Explore": tab_explore})
    return df_explore, tab_convert, tab_explore


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
