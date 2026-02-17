import pandas as pd

df = pd.read_csv("C:/Users/AVINAB/Desktop/Projects/financeTracker/data/transaction.csv")
print(df.head(5))
print(df.shape)
print(df.info())

