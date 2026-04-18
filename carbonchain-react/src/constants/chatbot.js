export const KB = [
  { keys:['monthly carbon','monthly kg','spend monthly','monthly co2','per month','how much carbon'],
    answer:`📅 <b>Monthly Carbon Spending</b><br><br>Your calculator gives an <b>annual</b> kg figure. Divide by 12 for monthly:<br>• Example: 9,600 kg/year = <b>800 kg/month</b><br><br>To offset 800 kg/month, buy <b>1 credit/month</b> (each = 750–1,200 kg CO₂).<br><br>👉 Go to <b>Buy Credits</b> → pick a project → confirm with MetaMask.` },
  { keys:['buy credit','how to buy','purchase credit','buy carbon','get credit'],
    answer:`🛒 <b>How to Buy Credits</b><br><br>1. Click <b>Connect Wallet</b> (top-right)<br>2. Switch MetaMask to <b>Sepolia Testnet</b><br>3. Open <b>Buy Credits</b> tab<br>4. Choose a project → <b>Buy with ETH</b><br>5. Set quantity → <b>Confirm in MetaMask</b><br><br>✅ Credits appear in Dashboard instantly.` },
  { keys:['metamask','connect wallet','wallet','install metamask'],
    answer:`🦊 <b>MetaMask Setup</b><br><br>• Install: <a href="https://metamask.io/download/" target="_blank" style="color:var(--green)">metamask.io</a><br>• Click <b>Connect Wallet</b> top-right<br>• Switch to <b>Sepolia Testnet</b><br>• Free test ETH: <a href="https://sepoliafaucet.com" target="_blank" style="color:var(--green)">sepoliafaucet.com</a>` },
  { keys:['carbon footprint','what is carbon','co2 footprint','what is co2'],
    answer:`🌍 <b>Carbon Footprint</b> = total CO₂ produced yearly from:<br>• ⚡ Energy • 🚗 Transport • 🍔 Food • 🛍️ Shopping<br><br>Global avg: ~<b>11,000 kg/year</b>. Use the <b>ML Calculator</b> to find yours!` },
  { keys:['eth','ethereum','gas fee','why eth','need eth'],
    answer:`Ξ <b>Why ETH?</b><br><br>Credits are on <b>Ethereum Sepolia testnet</b>. ETH = payment currency. Gas = tiny network fee.<br>On Sepolia it's free test ETH — no real money!<br>Get some: <a href="https://sepoliafaucet.com" target="_blank" style="color:var(--green)">sepoliafaucet.com</a>` },
  { keys:['transaction','tx history','my purchase','transaction history'],
    answer:`🔗 Connect wallet → open <b>Dashboard</b> → scroll to <b>Transaction History</b>.<br>Each row: date, project, credits, ETH paid + Etherscan link.` },
  { keys:['failed','error','not working','transaction fail','rejected','problem'],
    answer:`⚠️ <b>Troubleshooting</b><br><br>• Rejected → click <b>Confirm</b> in MetaMask<br>• No ETH → get test ETH at sepoliafaucet.com<br>• Wrong network → switch to <b>Sepolia</b><br>• Locked wallet → unlock MetaMask<br><br>Still stuck? Refresh page, reconnect wallet, retry.` },
  { keys:['project','forest','solar','wind','ocean','amazon','mangrove'],
    answer:`🌱 <b>Projects</b><br><br>🌳 Amazon — 1,000 kg @ 0.025 ETH<br>☀️ Sahara Solar — 800 kg @ 0.020 ETH<br>💨 Nordic Wind — 750 kg @ 0.018 ETH<br>🌊 Mangrove — 1,200 kg @ 0.032 ETH<br>🍳 India Cookstove — 600 kg @ 0.015 ETH<br>🌾 Patagonia — 900 kg @ 0.022 ETH` },
  { keys:['price','cost','how much','expensive'],
    answer:`💰 Credits: <b>0.015–0.032 ETH</b> per credit. See <b>Buy Credits</b> for full pricing.` },
  { keys:['offset','net zero','neutralize','how to offset'],
    answer:`🎯 Run the <b>Calculator</b> → get annual kg → buy matching credits on the <b>Marketplace</b>.<br>💡 1 Mangrove credit/month offsets 14,400 kg/year!` },
  { keys:['balance','cct','token','my credits'],
    answer:`💰 CCT = Carbon Credit Token (ERC-20).<br>Connect wallet → <b>Dashboard</b> to see your balance.` },
];

export function botAnswer(q) {
  const lower = q.toLowerCase();
  for (const item of KB) {
    if (item.keys.some(k => lower.includes(k))) return item.answer;
  }
  if (/hi|hello|hey/.test(lower)) return `👋 Hi! I'm <b>CarbonBot</b>. Ask about monthly carbon kg, buying credits, MetaMask, or transactions!`;
  if (/thank/.test(lower)) return `🌿 You're welcome! Keep offsetting! 🌍`;
  return `🤔 Try asking:<br>• Monthly carbon spending<br>• How to buy credits<br>• MetaMask setup<br>• Transaction history`;
}
