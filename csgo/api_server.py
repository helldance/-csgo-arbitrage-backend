# api_server.py

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from cs_go_arbitrage import check_arbitrage_and_return  # 你将在cs_go_arbitrage.py中定义这个函数

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有跨域请求
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArbitrageItem(BaseModel):
    name: str
    strategy: str
    buffPrice: str
    steamPrice: str
    profitRate: str
    image: str

@app.get("/arbitrage", response_model=List[ArbitrageItem])
def run_arbitrage(threshold: float = Query(15.0)):
    return check_arbitrage_and_return(threshold)
