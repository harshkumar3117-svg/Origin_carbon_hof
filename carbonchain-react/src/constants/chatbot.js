export const KB = [
  // ── CARBON FOOTPRINT BASICS ──────────────────────────────────
  { keys: ['what is carbon footprint', 'carbon footprint', 'what is co2', 'co2 footprint', 'explain carbon'],
    answer: `🌍 <b>Carbon Footprint</b> is the total CO₂ gas you produce every year from your daily activities:<br><br>
• ⚡ <b>Energy</b> — electricity, heating at home<br>
• 🚗 <b>Transport</b> — car, flights, trains<br>
• 🍔 <b>Food</b> — what you eat (meat vs veg)<br>
• 🛍️ <b>Shopping</b> — clothes, electronics<br><br>
🌐 Global average: <b>~4,000–11,000 kg/year</b> per person.<br>
Use our <b>ML Calculator</b> to find your exact footprint!` },

  // ── INDIVIDUAL CALCULATOR ────────────────────────────────────
  { keys: ['individual calculator', 'personal calculator', 'individual form', 'personal form', 'individual footprint'],
    answer: `👤 <b>Individual Carbon Calculator</b><br><br>
After signing up as <b>Individual</b>, the calculator asks:<br>
• Body type, diet (vegan/omnivore/etc.)<br>
• Transport type + monthly km driven<br>
• Air travel frequency<br>
• Heating source, monthly grocery bill<br>
• Shower, waste bags, clothes per month<br>
• TV/PC hours, internet hours/day<br>
• Recycling habits & cooking method<br><br>
✅ This uses a <b>personal ML model</b> to give your annual CO₂ in kg.` },

  // ── COMPANY CALCULATOR ───────────────────────────────────────
  { keys: ['company calculator', 'business calculator', 'company form', 'company carbon', 'company footprint'],
    answer: `🏢 <b>Company Carbon Calculator</b><br><br>
After signing up as <b>Company</b>, the calculator asks:<br>
• Annual km by personal vehicles & public transport<br>
• Plane & train journeys per year<br>
• Annual electricity (kWh) & water usage (litres)<br>
• Annual waste (kg) & employee diet type<br><br>
📊 Our <b>XGBoost annual ML model</b> (R² = 94.5%) predicts your company's yearly CO₂.<br>
Your result is checked against your <b>Govt Mandatory Limit</b> (600–1200 kg).` },

  // ── GOVT LIMIT / REGULATORY ─────────────────────────────────
  { keys: ['govt limit', 'government limit', 'regulatory', 'mandatory limit', 'compliance', 'regulatory breach', 'exceed limit'],
    answer: `🏛️ <b>Government Mandatory Limit</b> (Company only)<br><br>
Each company gets a <b>unique govt limit</b> (600–1200 kg CO₂/year) based on their registered company name.<br><br>
• ✅ <b>Compliant</b> — under your limit<br>
• ⚠️ <b>Warning</b> — within 10% over limit → can buy offsets<br>
• 🚫 <b>Regulatory Breach</b> — over 10% limit → must physically reduce emissions<br><br>
Individual users are compared to the <b>global average target (4,000 kg)</b> — no govt limit.` },

  // ── MONTHLY CARBON ──────────────────────────────────────────
  { keys: ['monthly carbon', 'monthly kg', 'spend monthly', 'monthly co2', 'per month', 'how much carbon'],
    answer: `📅 <b>Monthly Carbon Spending</b><br><br>
Your calculator gives an <b>annual</b> kg figure. Divide by 12 for monthly:<br>
• Example: 9,600 kg/year = <b>800 kg/month</b><br><br>
To offset 800 kg/month, buy <b>1 credit/month</b> (each = 600–1,200 kg CO₂).<br><br>
👉 Go to <b>Buy Credits</b> → pick a project → confirm with MetaMask.` },

  // ── BUY CREDITS ─────────────────────────────────────────────
  { keys: ['buy credit', 'how to buy', 'purchase credit', 'buy carbon', 'get credit', 'buy offset'],
    answer: `🛒 <b>How to Buy Credits</b><br><br>
1. Click <b>Connect Wallet</b> (top-right)<br>
2. Switch MetaMask to <b>Sepolia Testnet</b><br>
3. Open <b>Buy Credits</b> tab<br>
4. Choose a project → <b>Buy with ETH</b><br>
5. Set quantity → <b>Confirm in MetaMask</b><br><br>
✅ Credits appear in Dashboard instantly.<br>
⚠️ Only <b>Company</b> users can access the marketplace.` },

  // ── SIGNUP / LOGIN ──────────────────────────────────────────
  { keys: ['sign up', 'signup', 'register', 'create account', 'how to login', 'login', 'log in'],
    answer: `🔐 <b>Sign Up / Log In</b><br><br>
<b>Sign Up:</b><br>
• Choose <b>Company</b> → enter company name, business email, employee name, password<br>
• Choose <b>Individual</b> → enter full name, email, password<br><br>
<b>Log In:</b><br>
• Enter email + password → you'll be taken to the Calculator.<br><br>
💡 Individual users: no Marketplace access (by design).` },

  // ── METAMASK ────────────────────────────────────────────────
  { keys: ['metamask', 'connect wallet', 'wallet', 'install metamask'],
    answer: `🦊 <b>MetaMask Setup</b><br><br>
• Install: <a href="https://metamask.io/download/" target="_blank" style="color:var(--green)">metamask.io</a><br>
• Click <b>Connect Wallet</b> top-right<br>
• Switch to <b>Sepolia Testnet</b><br>
• Free test ETH: <a href="https://sepoliafaucet.com" target="_blank" style="color:var(--green)">sepoliafaucet.com</a>` },

  // ── ETH / GAS ───────────────────────────────────────────────
  { keys: ['eth', 'ethereum', 'gas fee', 'why eth', 'need eth'],
    answer: `Ξ <b>Why ETH?</b><br><br>
Credits are on <b>Ethereum Sepolia testnet</b>. ETH = payment currency. Gas = tiny network fee.<br>
On Sepolia it's free test ETH — no real money!<br>
Get some: <a href="https://sepoliafaucet.com" target="_blank" style="color:var(--green)">sepoliafaucet.com</a>` },

  // ── TRANSACTIONS ────────────────────────────────────────────
  { keys: ['transaction', 'tx history', 'my purchase', 'transaction history', 'purchase history'],
    answer: `🔗 Connect wallet → open <b>Dashboard</b> → scroll to <b>Transaction History</b>.<br>
Each row shows: date, project, credits bought, ETH paid + Etherscan link.` },

  // ── PROJECTS / PRICING ──────────────────────────────────────
  { keys: ['project', 'forest', 'solar', 'wind', 'ocean', 'amazon', 'mangrove', 'available project'],
    answer: `🌱 <b>Available Projects</b><br><br>
🌳 Amazon Forest — 1,000 kg @ 0.025 ETH<br>
☀️ Sahara Solar — 800 kg @ 0.020 ETH<br>
💨 Nordic Wind — 750 kg @ 0.018 ETH<br>
🌊 Mangrove Ocean — 1,200 kg @ 0.032 ETH<br>
🍳 India Cookstove — 600 kg @ 0.015 ETH<br>
🌾 Patagonia Land — 900 kg @ 0.022 ETH` },

  { keys: ['price', 'cost', 'how much', 'expensive', 'credit price'],
    answer: `💰 Credits: <b>0.015–0.032 ETH</b> per credit.<br>See <b>Buy Credits</b> tab for full pricing per project.` },

  { keys: ['offset', 'net zero', 'neutralize', 'how to offset', 'go carbon neutral'],
    answer: `🎯 <b>How to Offset</b><br><br>
1. Run the <b>Calculator</b> → get your annual kg CO₂<br>
2. Go to <b>Buy Credits</b> → pick a project<br>
3. Buy enough credits to match your footprint<br><br>
💡 1 Mangrove credit = 1,200 kg offset!` },

  // ── ERRORS / TROUBLESHOOTING ─────────────────────────────────
  { keys: ['failed', 'error', 'not working', 'transaction fail', 'rejected', 'problem', 'network error'],
    answer: `⚠️ <b>Troubleshooting</b><br><br>
• <b>Network Error</b> → Backend (Java server) might be off. Restart Spring Boot on port 8080.<br>
• <b>TX Rejected</b> → Click <b>Confirm</b> in MetaMask<br>
• <b>No ETH</b> → Get test ETH at sepoliafaucet.com<br>
• <b>Wrong Network</b> → Switch MetaMask to <b>Sepolia</b><br>
• <b>Locked Wallet</b> → Unlock MetaMask<br><br>
Still stuck? Refresh the page and reconnect wallet.` },

  // ── BALANCE / TOKENS ─────────────────────────────────────────
  { keys: ['balance', 'cct', 'token', 'my credits', 'carbon credit token'],
    answer: `💰 <b>CCT = Carbon Credit Token</b> (ERC-20 on Sepolia).<br>
Connect your wallet → open <b>Dashboard</b> to see your CCT balance & ETH balance.` },

  // ── ML MODEL ─────────────────────────────────────────────────
  { keys: ['ml model', 'machine learning', 'how does calculator work', 'ai model', 'xgboost', 'prediction model'],
    answer: `🤖 <b>ML Models Used</b><br><br>
• <b>Individual</b>: Custom personal lifestyle model (port 5000)<br>
• <b>Company</b>: XGBoost trained on annual carbon dataset — R² = <b>94.5% accuracy</b> (port 5001)<br><br>
Just fill the form and click <b>Calculate</b> — the AI does the rest!` },
];

export function botAnswer(q) {
  const lower = q.toLowerCase();
  for (const item of KB) {
    if (item.keys.some(k => lower.includes(k))) return item.answer;
  }
  if (/hi|hello|hey/.test(lower)) return `👋 Hi! I'm <b>CarbonBot</b>. Ask about carbon footprint, buying credits, MetaMask, or the calculator!`;
  if (/thank/.test(lower)) return `🌿 You're welcome! Keep offsetting! 🌍`;
  return null; // null = send to Groq AI for unknown questions
}
