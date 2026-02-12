# Create a module that extracts meaningful insights from the DataFrame.

import numpy as np
import pandas as pd


# ---------- Financial Summary ----------
def financial_summary(df):

    income = df[df["type"] == "Income"]["amount"].sum()
    expense = df[df["type"] == "Expense"]["amount"].sum()
    savings = income - expense

    return income, expense, savings


# ---------- Category Spending ----------
def category_spending(df):

    exp_df = df[df["type"] == "Expense"]

    cat_sum = exp_df.groupby("category")["amount"].sum()

    highest = cat_sum.idxmax()
    lowest = cat_sum.idxmin()

    return cat_sum, highest, lowest


# ---------- NumPy Statistics ----------
def numpy_stats(df):

    exp_values = df[df["type"] == "Expense"]["amount"].to_numpy()

    mean = np.mean(exp_values)
    std = np.std(exp_values)
    minimum = np.min(exp_values)
    maximum = np.max(exp_values)

    return mean, std, minimum, maximum

