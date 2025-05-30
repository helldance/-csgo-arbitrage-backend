"use client";

import { useState } from "react";

interface ArbitrageItem {
  name: string;
  strategy: string;
  buffPrice: string;
  steamPrice: string;
  profitRate: string;
  image: string;
  exterior: string;
  is_stattrak: boolean;
  is_souvenir: boolean;
  is_special: boolean;
}

export default function Home() {
  const [threshold, setThreshold] = useState(15);
  const [maxPages, setMaxPages] = useState(3);
  const [buffFee, setBuffFee] = useState(2.5);
  const [steamFee, setSteamFee] = useState(15);
  const [usdToRmb, setUsdToRmb] = useState(7.2);
  const [minUsd, setMinUsd] = useState(1);
  const [results, setResults] = useState<ArbitrageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatTrak, setFilterStatTrak] = useState(false);
  const [filterSouvenir, setFilterSouvenir] = useState(false);
  const [filterSpecial, setFilterSpecial] = useState(false);

  const handleRun = () => {
    setResults([]);
    setLoading(true);
    const ws = new WebSocket("ws://localhost:8001/arbitrage/ws");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          threshold: threshold / 100,
          max_pages: maxPages,
          buff_fee: buffFee / 100,
          steam_fee: steamFee / 100,
          exchange_rate: usdToRmb,
          min_usd: minUsd
        })
      );
    };
    ws.onmessage = (event) => {
      const data: ArbitrageItem = JSON.parse(event.data);
      if (filterStatTrak && data.is_stattrak) return;
      if (filterSouvenir && data.is_souvenir) return;
      if (filterSpecial && data.is_special) return;
      setResults((prev) => [...prev, data]);
    };
    ws.onclose = () => {
      setLoading(false);
    };
    ws.onerror = () => {
      setLoading(false);
    };
  };

  return (
    <div className="flex gap-4 p-4 items-start">
      <div className="w-1/5 min-w-[240px] space-y-4 border rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold">策略配置</h2>

        <div className="grid gap-2">
          <label className="text-sm">套利利润阈值 (%)</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm">BUFF 手续费 (%)</label>
          <input
            type="number"
            value={buffFee}
            onChange={(e) => setBuffFee(parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm">Steam 手续费 (%)</label>
          <input
            type="number"
            value={steamFee}
            onChange={(e) => setSteamFee(parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm">汇率（USD → RMB）</label>
          <input
            type="number"
            value={usdToRmb}
            onChange={(e) => setUsdToRmb(parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm">最小价格 (USD)</label>
          <input
            type="number"
            value={minUsd}
            onChange={(e) => setMinUsd(parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm">BUFF 页面数量</label>
          <input
            type="number"
            value={maxPages}
            onChange={(e) => setMaxPages(parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">过滤选项</label>
          <label><input type="checkbox" checked={filterStatTrak} onChange={(e) => setFilterStatTrak(e.target.checked)} /> 排除 StatTrak™</label>
          <label><input type="checkbox" checked={filterSouvenir} onChange={(e) => setFilterSouvenir(e.target.checked)} /> 排除纪念皮</label>
          <label><input type="checkbox" checked={filterSpecial} onChange={(e) => setFilterSpecial(e.target.checked)} /> 排除特殊皮（★）</label>
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "运行中..." : "运行策略"}
        </button>
      </div>

      <div className="flex-1 border rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">套利机会列表</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="pb-2">皮肤</th>
              <th>策略</th>
              <th>BUFF价</th>
              <th>Steam价</th>
              <th>利润率</th>
              <th>磨损</th>
              <th>图片</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="py-1 pr-4">{item.name}</td>
                <td>{item.strategy}</td>
                <td>{item.buffPrice}</td>
                <td>{item.steamPrice}</td>
                <td>{item.profitRate}</td>
                <td>{item.exterior}</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain"
                  />
                </td>
              </tr>
            ))}
            {results.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  暂无套利机会
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}