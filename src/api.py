from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from src.analysis import financial_summary, category_spending, numpy_stats


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset once when server starts
df = pd.read_csv("C:/Users/AVINAB/Desktop/Projects/financeTracker/data/transaction.csv")


# ---------- Summary Endpoint ----------
@app.get("/summary")
def get_summary():
    inc, exp, sav = financial_summary(df)

    return {
        "income": float(inc),
        "expense": float(exp),
        "savings": float(sav)
    }


# ---------- Category Endpoint ----------
@app.get("/categories")
def get_categories():
    cat_sum, hi, lo = category_spending(df)

    return {
        "category_totals": cat_sum.to_dict(),
        "highest": hi,
        "lowest": lo
    }


# ---------- Statistics Endpoint ----------
@app.get("/stats")
def get_stats():
    mean, std, mn, mx = numpy_stats(df)

    return {
        "mean": float(mean),
        "std": float(std),
        "min": float(mn),
        "max": float(mx)
    }
