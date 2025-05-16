#!/usr/bin/env python3
# coding: utf-8

"""
功能：
- 自动抓取 BUFF 商品列表（分页）
- 使用 Cookie 登录（首次手动登录后存入本地）
- 对每个商品从 Steam 查询最低售价
- 扣除手续费，按阈值判断套利机会
- 可被 FastAPI 接口调用
- 带日志输出与异常捕获
"""

import requests
import time
steam_price_cache = {}
import json
import logging
from urllib.parse import quote

def extract_exterior(name: str) -> str:
    for level in ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]:
        if level in name:
            return level
    return "Unknown"

def parse_skin_attributes(name: str) -> dict:
    return {
        "exterior": extract_exterior(name),
        "is_stattrak": "StatTrak" in name,
        "is_souvenir": "Souvenir" in name,
        "is_special": "★" in name,
    }

# 配置日志
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

BUFF_COOKIE_FILE = "buff_cookie.json"
BUFF_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
}
STEAM_API_TEMPLATE = "https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name={}"

BUFF_GOODS_API = "https://buff.163.com/api/market/goods"
BUFF_ITEM_PAGE_SIZE = 80

def load_buff_cookie():
    try:
        with open(BUFF_COOKIE_FILE, "r") as f:
            cookies_dict = json.load(f)
        return cookies_dict
    except FileNotFoundError:
        logger.error("未找到 buff_cookie.json，请先登录并保存 cookie。")
        return {}


def get_buff_goods(page):
    url = f"{BUFF_GOODS_API}?game=csgo&page_num={page}&page_size={BUFF_ITEM_PAGE_SIZE}"
    cookies = load_buff_cookie()
    if not cookies:
        return []
    try:
        resp = requests.get(url, headers=BUFF_HEADERS, cookies=cookies)
        if resp.status_code == 200:
            data = resp.json()
            items = data.get("data", {}).get("items", [])
            logger.info(f"第 {page} 页获取 {len(items)} 项 BUFF 商品")
            return items
        else:
            logger.warning(f"[BUFF] 获取商品列表失败: HTTP {resp.status_code}")
    except Exception as e:
        logger.exception(f"[BUFF] 请求异常: {e}")
    return []


import random

def get_steam_lowest_price(market_hash_name):
    if market_hash_name in steam_price_cache:
        print(f"steam price from cache: s%", market_hash_name)
        return steam_price_cache[market_hash_name]
    url = STEAM_API_TEMPLATE.format(quote(market_hash_name))
    for attempt in range(3):
        try:
            resp = requests.get(url)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("success") and data.get("lowest_price"):
                    price_str = data["lowest_price"].replace("$", "").replace(",", "")
                    logger.info(f"Steam 价格 [{market_hash_name}]: ${price_str}")
                    price = float(price_str)
                    steam_price_cache[market_hash_name] = price
                    return price
                else:
                    logger.info(f"Steam 无最低价 [{market_hash_name}] 响应: {data}")
                    return None
            elif resp.status_code == 429:
                logger.warning(f"Steam 429 限速 [{market_hash_name}] - 第 {attempt+1} 次重试")
                time.sleep(2 + random.uniform(0.5, 1.5))  # 回避速率限制
            else:
                logger.warning(f"Steam 获取失败 [{market_hash_name}]: HTTP {resp.status_code}")
                return None
        except Exception as e:
            logger.exception(f"[Steam] 获取价格失败 [{market_hash_name}]: {e}")
    return None  # 3次失败后放弃


def check_arbitrage_and_return(threshold: float, buff_fee: float, steam_fee: float, exchange_rate: float, max_pages: int):
    logger.info(f"开始套利计算，阈值：{threshold * 100:.1f}%")
    result = []
    try:
        for page in range(1, max_pages + 1):
            goods = get_buff_goods(page)
            for item in goods:
                name = item.get("market_hash_name")
                if not name:
                    continue
                buff_price = item.get("sell_min_price")
                if not buff_price:
                    continue
                try:
                    buff_price = float(buff_price)
                except:
                    continue

                steam_price = get_steam_lowest_price(name)
                if not steam_price:
                    continue

                steam_price_rmb = steam_price * exchange_rate
                steam_net = steam_price_rmb * (1 - steam_fee)

                # BUFF → Steam
                if steam_net - buff_price > threshold * buff_price:
                    profit = steam_net - buff_price
                    rate = profit / buff_price * 100
                    logger.info(f"套利机会 [BUFF→Steam] {name}: 利润率 {rate:.2f}%")
                    result.append({
                        "name": name,
                    **parse_skin_attributes(name),
                **parse_skin_attributes(name),
                        "strategy": "BUFF → Steam",
                        "buffPrice": f"¥{buff_price:.2f}",
                        "steamPrice": f"${steam_price:.2f}",
                        "profitRate": f"{rate:.2f}%",
                        "image": f"https://image.buff.163.com{item.get('goods_info', {}).get('icon_url', '')}"
                    })

                # Steam → BUFF
                elif buff_price - steam_net > threshold * steam_net:
                    profit = buff_price - steam_net
                    rate = profit / steam_net * 100
                    logger.info(f"套利机会 [Steam→BUFF] {name}: 利润率 {rate:.2f}%")
                    result.append({
                        "name": name,
                    **parse_skin_attributes(name),
                **parse_skin_attributes(name),
                        "strategy": "Steam → BUFF",
                        "buffPrice": f"¥{buff_price:.2f}",
                        "steamPrice": f"${steam_price:.2f}",
                        "profitRate": f"{rate:.2f}%",
                        "image": f"https://image.buff.163.com{item.get('goods_info', {}).get('icon_url', '')}"
                    })

                time.sleep(0.3)
    except Exception as e:
        logger.exception(f"处理套利时异常: {e}")
    logger.info(f"套利完成，共发现 {len(result)} 项")
    return result


if __name__ == "__main__":
    opportunities = check_arbitrage_and_return(threshold=0.15)
    for item in opportunities:
        print(item)
