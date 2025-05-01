"use client";

import { useState } from "react";

export default function Home() {
  const [threshold, setThreshold] = useState(15);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8002/arbitrage?threshold=${threshold}`
      );
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      <div className="col-span-2">
        <div className="rounded-xl shadow border p-4 space-y-4">
          <h2 className="text-lg font-semibold">策略配置</h2>
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              套利利润阈值 (%)
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              min={1}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleRun}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "运行中..." : "运行策略"}
          </button>
        </div>
      </div>

      <div className="col-span-3">
        <div className="rounded-xl shadow border p-4">
          <h2 className="text-lg font-semibold mb-4">套利机会列表</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="pb-2">皮肤</th>
                <th>策略</th>
                <th>BUFF价</th>
                <th>Steam价</th>
                <th>利润率</th>
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
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    暂无套利机会
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
