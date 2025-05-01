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

class ArbitrageRequest(BaseModel):
    threshold: float
    buff_fee: float
    steam_fee: float
    exchange_rate: float
    max_pages: int

class ArbitrageItem(BaseModel):
    name: str
    strategy: str
    buffPrice: str
    steamPrice: str
    profitRate: str
    image: str

@app.post("/arbitrage", response_model=List[ArbitrageItem])
def run_arbitrage(config: ArbitrageRequest):
    return check_arbitrage_and_return(
        threshold=config.threshold,
        buff_fee=config.buff_fee,
        steam_fee=config.steam_fee,
        exchange_rate=config.exchange_rate,
        max_pages=config.max_pages
    )