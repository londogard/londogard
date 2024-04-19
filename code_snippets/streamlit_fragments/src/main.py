import numpy as np
import streamlit as st


def main():
    st.write("# Main Function")
    st.write("Hello, World! (main)")
    st.toggle("Toggle me!")


@st.experimental_fragment()
def first_fragment():
    st.write("## First Fragment")
    random_choice = np.random.choice(["a", "b", "c"])
    st.write(f"Random choice: {random_choice}")
    st.toggle("Toggle me! (1st Fragment)")


@st.experimental_fragment(run_every="2s")
def second_fragment():
    st.write("## Second Fragment")
    st.write("Hello, World! (2nd Fragment)")
    random_choice = np.random.choice(["a", "b", "c"])
    st.write(f"Random choice: {random_choice}")
    st.toggle("Toggle me! (2nd Fragment)")


if __name__ == "__main__":
    main()
    c1, c2 = st.columns(2)

    with c1:
        first_fragment()
    with c2:
        second_fragment()
