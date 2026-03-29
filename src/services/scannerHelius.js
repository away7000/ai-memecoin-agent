export async function validateWithHelius(token) {
  try {
    const url = `https://api.helius.xyz/v0/addresses/${token.address}/transactions?api-key=${process.env.HELIUS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!Array.isArray(data)) return false;

    // 🔥 basic signal
    const recentTx = data.slice(0, 20);

    const uniqueWallets = new Set(
      recentTx.map(tx => tx?.feePayer)
    ).size;

    // 🧠 filter:
    if (recentTx.length < 5) return false;
    if (uniqueWallets < 3) return false;

    return true;

  } catch (err) {
    console.error("Helius error:", err);
    return false;
  }
}
