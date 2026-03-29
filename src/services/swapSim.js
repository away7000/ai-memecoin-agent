const SOL_MINT = "So11111111111111111111111111111111111111112";

// amount kecil buat simulasi (lamports)
const TEST_AMOUNT = 1000000; // ~0.001 SOL

export async function getQuote(inputMint, outputMint, amount) {
  try {
    const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;

    const res = await fetch(url, {
      headers: { "Accept": "application/json" }
    });

    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      return null;
    }

    // ambil best route
    return data.data[0];

  } catch (err) {
    console.error("Quote error:", err);
    return null;
  }
}

// 🔁 simulasi BUY: SOL → TOKEN
export async function simulateBuy(tokenMint) {
  return await getQuote(SOL_MINT, tokenMint, TEST_AMOUNT);
}

// 🔁 simulasi SELL: TOKEN → SOL
export async function simulateSell(tokenMint, amountInToken) {
  return await getQuote(tokenMint, SOL_MINT, amountInToken);
}
