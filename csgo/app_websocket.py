from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from cs_go_arbitrage import check_arbitrage_and_return, get_buff_goods, get_steam_lowest_price, load_buff_cookie, BUFF_HEADERS
import json
import logging
import asyncio

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s - %(message)s")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

@app.websocket("/arbitrage/ws")
async def arbitrage_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        config_data = await websocket.receive_text()
        config = json.loads(config_data)

        threshold = config.get("threshold", 0.15)
        buff_fee = config.get("buff_fee", 0.025)
        steam_fee = config.get("steam_fee", 0.15)
        exchange_rate = config.get("exchange_rate", 7.2)
        min_usd = config.get("min_usd", 0.0)
        max_pages = config.get("max_pages", 3)

        cookies = load_buff_cookie()
        result_count = 0

        for page in range(1, max_pages + 1):
            goods = get_buff_goods(page)
            for item in goods:
                name = item.get("market_hash_name")
                if not name:
                    continue
                try:
                    buff_price = float(item.get("sell_min_price", 0))
                except:
                    continue

                steam_price = get_steam_lowest_price(name)
                if not steam_price or steam_price < min_usd:
                    continue

                steam_price_rmb = steam_price * exchange_rate
                steam_net = steam_price_rmb * (1 - steam_fee)

                icon_url = item.get("goods_info", {}).get("icon_url", "")
                image = f"https://image.buff.163.com{icon_url}" if icon_url else ""

                def extract_exterior(name): return next((lvl for lvl in ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"] if lvl in name), "Unknown")
                def parse_attrs(n): return {
                    "exterior": extract_exterior(n),
                    "is_stattrak": "StatTrak" in n,
                    "is_souvenir": "Souvenir" in n,
                    "is_special": "★" in n,
                }

                if steam_net - buff_price > threshold * buff_price:
                    profit = steam_net - buff_price
                    rate = profit / buff_price * 100
                    await websocket.send_json({
                        "name": name,
                        "strategy": "BUFF → Steam",
                        "buffPrice": f"¥{buff_price:.2f}",
                        "steamPrice": f"${steam_price:.2f}",
                        "profitRate": f"{rate:.2f}%",
                        "image": image,
                        **parse_attrs(name)
                    })
                    await asyncio.sleep(0.2)

                elif buff_price - steam_net > threshold * steam_net:
                    profit = buff_price - steam_net
                    rate = profit / steam_net * 100
                    await websocket.send_json({
                        "name": name,
                        "strategy": "Steam → BUFF",
                        "buffPrice": f"¥{buff_price:.2f}",
                        "steamPrice": f"${steam_price:.2f}",
                        "profitRate": f"{rate:.2f}%",
                        "image": image,
                        **parse_attrs(name)
                    })
                    await asyncio.sleep(0.2)

        await websocket.close()

    except WebSocketDisconnect:
        logging.warning("客户端断开连接")
    except Exception as e:
        logging.exception("WebSocket 出错")
        await websocket.close()
