import pandas as pd
from analysis import financial_summary, category_spending, numpy_stats

df = pd.read_csv("C:/Users/AVINAB/Desktop/Projects/financeTracker/data/transaction.csv")

# Summary
inc, exp, sav = financial_summary(df)
print("Income:", inc)
print("Expense:", exp)
print("Savings:", sav)

# Category
cat, hi, lo = category_spending(df)
print("\nCategory Spending:\n", cat)
print("Highest:", hi)
print("Lowest:", lo)

# NumPy Stats
mean, std, mn, mx = numpy_stats(df)
print("\nStats:")
print("Mean:", mean)
print("Std:", std)
print("Min:", mn)
print("Max:", mx)
