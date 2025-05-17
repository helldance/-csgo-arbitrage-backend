"use client";

import { useState } from "react";

export default function Home() {
  const [threshold, setThreshold] = useState(15);
  const [maxPages, setMaxPages] = useState(3);
  const [buffFee, setBuffFee] = useState(2.5);
  const [steamFee, setSteamFee] = useState(15);
  const [usdToRmb, setUsdToRmb] = useState(7.2);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatTrak, setFilterStatTrak] = useState(false);
  const [filterSouvenir, setFilterSouvenir] = useState(false);
  const [filterSpecial, setFilterSpecial] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8006/arbitrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threshold: threshold / 100,
          max_pages: maxPages,
          buff_fee: buffFee / 100,
          steam_fee: steamFee / 100,
          exchange_rate: usdToRmb,
        }),
      });
      const data = await res.json();
      const filtered = data.filter((item: any) => {
        if (filterStatTrak && item.is_stattrak) return false;
        if (filterSouvenir && item.is_souvenir) return false;
        if (filterSpecial && item.is_special) return false;
        return true;
      });
      setResults(filtered);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
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
