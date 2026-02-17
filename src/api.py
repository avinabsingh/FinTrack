from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd

from src.analysis import financial_summary, category_spending, numpy_stats

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["fintrack"]
collection = db["transactions"]

app = FastAPI()

origins = ["http://localhost:8080"]  # Node backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_user_dataframe(user_id: str):
    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        return pd.DataFrame()

    data = list(collection.find(
        {"user": user_obj_id},
        {"_id": 0, "user": 0}
    ))

    if not data:
        return pd.DataFrame()

    return pd.DataFrame(data)



# ---------- Summary Endpoint ----------
@app.post("/summary")
def get_summary(payload: dict):

    df = get_user_dataframe(payload["userId"])

    if df.empty:
        return {"income": 0, "expense": 0, "savings": 0}

    inc, exp, sav = financial_summary(df)

    return {
        "income": float(inc),
        "expense": float(exp),
        "savings": float(sav)
    }


# ---------- Category Endpoint ----------
@app.post("/categories")
def get_categories(payload: dict):

    df = get_user_dataframe(payload["userId"])

    if df.empty:
        return {"category_totals": {}, "highest": None, "lowest": None}

    cat_sum, hi, lo = category_spending(df)

    return {
        "category_totals": cat_sum.to_dict(),
        "highest": hi,
        "lowest": lo
    }


# ---------- Statistics Endpoint ----------
@app.post("/stats")
def get_stats(payload: dict):

    df = get_user_dataframe(payload["userId"])

    if df.empty:
        return {"mean": 0, "std": 0, "min": 0, "max": 0}

    mean, std, mn, mx = numpy_stats(df)

    return {
        "mean": float(mean),
        "std": float(std),
        "min": float(mn),
        "max": float(mx)
    }
