import numpy as np
import streamlit as st
import polars as pl
import plotly.express as px


def main() -> float:
    st.write("# Main Function")
    st.write("Hello, World! (main)")
    multiplier = st.slider("Amplitude Multiplier", 0.0, 10.0, 1.0, 0.1)

    return multiplier


@st.cache_resource
def get_stocks() -> pl.DataFrame:
    return pl.read_csv(
        "https://raw.githubusercontent.com/vega/datalib/master/test/data/stocks.csv"
    )


@st.experimental_fragment()
def first_fragment(multiplier: float):
    st.write("## First Fragment")
    sine_frequency = st.slider("Sine Frequency", 0.0, 10.0, 1.0, 0.1)
    # create sine wave with multiplier height and sine_frequency as frequency
    t = np.linspace(0, 2 * np.pi * sine_frequency, 100)
    y = multiplier * np.sin(t)

    df = pl.DataFrame({"t": t, "y": y})
    st.plotly_chart(
        px.line(df, x="t", y="y", title="Sine wave"), use_container_width=True
    )


@st.experimental_fragment(run_every="2s")
def second_fragment(multiplier: float):
    st.write("## Second Fragment")
    c1, c2 = st.columns(2)

    with c1:
        if not st.checkbox("Lock company"):
            st.session_state["ticker_select"] = np.random.choice(
                ["AAPL", "GOOG", "AMZN"]
            )
    with c2:
        ticker = st.selectbox(
            "Company (symbol)", ["AAPL", "GOOG", "AMZN"], key="ticker_select"
        )
    stocks = get_stocks()
    stocks = stocks.filter(pl.col("symbol") == ticker).with_columns(
        pl.col("price") * multiplier
    )

    st.plotly_chart(
        px.line(stocks, x="date", y="price", title=f"Stock price ({ticker})"),
        use_container_width=True,
    )


if __name__ == "__main__":
    multiplier = main()
    c1, c2 = st.columns(2)

    with c1:
        first_fragment(multiplier)
    with c2:
        second_fragment(multiplier)
