'use client'

import { useState } from 'react'

export default function Page() {
  const [query, setQuery] = useState('')
  const [coins, setCoins] = useState<any[]>([])
  const [coin, setCoin] = useState<any>(null)
  const [date, setDate] = useState('2023-01-01')
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function searchCoins(q: string) {
    setQuery(q)
    if (!q) return

    const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${q}`)
    const data = await res.json()
    setCoins(data.coins || [])
  }

  async function calculate() {
    if (!coin) return

    setLoading(true)

    const d = new Date(date)
    const formatted = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`

    const oldRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin.id}/history?date=${formatted}`
    )
    const oldData = await oldRes.json()

    const currentRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd`
    )
    const currentData = await currentRes.json()

    const oldPrice = oldData?.market_data?.current_price?.usd || 0
    const currentPrice = currentData?.[coin.id]?.usd || 0

    const coinsAmount = amount / oldPrice
    const valueNow = coinsAmount * currentPrice

    setResult({ valueNow, oldPrice, currentPrice })
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">If You Bought 🚀</h1>

        {/* Search */}
        <input
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Search crypto (btc, eth...)"
          onChange={(e) => searchCoins(e.target.value)}
        />

        {/* Coin list */}
        <div className="max-h-40 overflow-auto mt-2">
          {coins.map((c) => (
            <div
              key={c.id}
              onClick={() => setCoin(c)}
              className="p-2 hover:bg-zinc-700 cursor-pointer"
            >
              {c.name} ({c.symbol})
            </div>
          ))}
        </div>

        {/* Inputs */}
        <input
          type="number"
          className="w-full mt-3 p-2 bg-zinc-800 rounded"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <input
          type="date"
          className="w-full mt-3 p-2 bg-zinc-800 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={calculate}
          className="w-full mt-4 bg-white text-black p-2 rounded font-bold"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-4 p-3 bg-zinc-800 rounded">
            <p>Old Price: ${result.oldPrice}</p>
            <p>Current Price: ${result.currentPrice}</p>
            <h2 className="text-xl font-bold mt-2">
              Now: ${result.valueNow.toFixed(2)}
            </h2>
          </div>
        )}
      </div>
    </main>
  )
}
