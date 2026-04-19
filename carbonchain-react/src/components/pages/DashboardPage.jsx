import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { useAppState } from '../../hooks/useAppState';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function DashboardPage() {
  const { account, ethBalance, co2Balance, transactions, connectWallet, shortAddr, showAlert, userType, user, navigateTo } = useAppState();

  // Audit photo upload state
  const fileInputRef = useRef(null);
  const [auditPhoto, setAuditPhoto] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const AUDIT_ACHIEVEMENTS = [
    { name: 'Eco-Commuter', icon: '🚲', desc: 'Spotted cycling or walking to reduce transport emissions!', badge: 'Transport Hero', color: '#22c55e' },
    { name: 'Green Kitchen', icon: '🥗', desc: 'Healthy, plant-based meal detected — less food carbon!', badge: 'Food Warrior', color: '#3b82f6' },
    { name: 'Waste Reducer', icon: '♻️', desc: 'Recycling or composting activity captured!', badge: 'Waste Champion', color: '#a855f7' },
    { name: 'Solar Observer', icon: '☀️', desc: 'Renewable energy source in frame — clean power!', badge: 'Energy Saver', color: '#f97316' },
    { name: 'Nature Guardian', icon: '🌳', desc: 'Outdoor green activity — planting or nature walk!', badge: 'Planet Saver', color: '#14b8a6' },
  ];

  const handleAuditClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      showAlert('❌ Please upload an image file (JPG, PNG, etc.)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Image = ev.target.result;
      setAuditPhoto(base64Image);
      setAuditLoading(true);
      setAuditResult(null);

      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.2-11b-vision-preview',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Analyze this image. If it shows an eco-friendly or environmental activity (cycling, walking, recycling, composting, solar panels, wind turbines, plant-based food, or nature/planting), respond exactly with one of these names: [Eco-Commuter, Green Kitchen, Waste Reducer, Solar Observer, Nature Guardian]. If the photo does not clearly show an eco-friendly activity or is unrelated to the environment, respond exactly with 'INVALID'.`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: base64Image
                    }
                  }
                ]
              }
            ],
            temperature: 0.1,
            max_tokens: 10
          },
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const aiResult = response.data.choices[0].message.content.trim();
        
        if (aiResult.includes('INVALID')) {
          setAuditResult({ error: true, text: 'This photo doesn\'t seem to show an eco-friendly activity. Please try uploading a different photo related to sustainability!' });
          showAlert('⚠️ Sustainability audit failed', 'warning');
        } else {
          // Find the category in our list
          const matched = AUDIT_ACHIEVEMENTS.find(a => aiResult.toLowerCase().includes(a.name.toLowerCase())) || AUDIT_ACHIEVEMENTS[4];
          setAuditResult(matched);
          showAlert(`🏅 Achievement Unlocked: ${matched.badge}!`, 'success');
        }
      } catch (err) {
        console.error('Audit Error:', err);
        showAlert('❌ AI Analysis failed. Please try again.', 'error');
        setAuditResult({ error: true, text: 'Something went wrong with the AI analysis. Please check your connection and try again.' });
      } finally {
        setAuditLoading(false);
      }
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const closeAuditModal = () => {
    setAuditPhoto(null);
    setAuditResult(null);
    setAuditLoading(false);
  };

  const totalOffset = transactions.reduce((s,t) => s + (t.co2Offset||0), 0);
  const totalEth = transactions.reduce((s,t) => s + parseFloat(t.ethPaid||0), 0);

  let rank = '🏆 Top 10%';
  if (totalOffset < 500) rank = '🌱 Beginner';
  else if (totalOffset < 2000) rank = '🌿 Active';
  else if (totalOffset < 10000) rank = '🌳 Champion';
  else rank = '🏆 Hero';

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly = new Array(12).fill(0);
  transactions.forEach(tx => {
    let m = 0;
    // Handled depending on whether tx.id is a timestamp or blocknumber. Since we set it as Date.now() for local txs:
    if (tx.id > 1000000000000) {
      m = new Date(tx.id).getMonth();
    } else {
      m = new Date().getMonth(); // Rough fallback for blockchain sync without timestamp
    }
    monthly[m] += tx.co2Offset || 0;
  });

  const chartData = {
    labels: months,
    datasets: [{
      label: 'CO₂ Offset (kg)',
      data: monthly,
      backgroundColor: 'rgba(34,197,94,.5)',
      borderColor: '#22c55e',
      borderWidth: 2,
      borderRadius: 6
    }]
  };

  const refreshHistory = () => {
    // Relying on effect hook from AppState if we force update, but dummy reload for demo
    showAlert('🔄 Transaction history refreshed', 'info');
  };

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      showAlert('⚠️ No transactions to export', 'error');
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = transactions.map(tx => ({
        'Date': tx.date,
        'Time': tx.time,
        'Company Name': user?.name || 'N/A',
        'Project': tx.project,
        'Credits (CCT)': tx.credits,
        'CO2 Offset (kg)': tx.co2Offset || (tx.credits * 1000),
        'Price Paid (ETH)': tx.ethPaid,
        'Transaction ID': tx.txHash,
        'Status': tx.status === 'success' ? 'Success' : 'Failed'
      }));

      // Create sheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Basic Column Widths
      const wscols = [
        {wch: 12}, {wch: 10}, {wch: 25}, {wch: 30}, {wch: 12}, {wch: 15}, {wch: 15}, {wch: 45}, {wch: 10}
      ];
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      // Generate file
      XLSX.writeFile(workbook, "OriginCarbon_TransactionHistory.xlsx");
      
      showAlert('✅ Report downloaded successfully!', 'success');
    } catch (err) {
      console.error('Excel Export Error:', err);
      showAlert('❌ Failed to generate report', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-[84px] pb-[60px] animate-fadeIn">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="pt-[30px] pb-5">
          <div className="text-[1.8rem] font-extrabold mb-1.5">📊 My Carbon Dashboard</div>
          <div className="text-[0.9rem] text-cc-muted2">Track your offset progress and transaction history</div>
        </div>

        {!account ? (
          <div className="text-center py-20 px-5">
            <div className="text-[4rem] mb-4">🦊</div>
            <h3 className="text-[1.4rem] font-bold mb-2">Connect Your Wallet</h3>
            <p className="text-cc-muted2 mb-6 max-w-[440px] mx-auto">Connect MetaMask to view your personal dashboard, token balance, and transaction history.</p>
            <button className="btn-primary" onClick={connectWallet}><i className="fas fa-wallet"></i> Connect MetaMask</button>
          </div>
        ) : (
          <div>
            <div className="bg-cc-card border border-cc-border rounded-[18px] p-7 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-cc-green to-cc-blue flex items-center justify-center text-[1.2rem]">🦊</div>
                <div>
                  <div className="text-[0.78rem] text-cc-muted2">Connected Wallet</div>
                  <div className="font-bold">{account}</div>
                </div>
                <span className="ml-auto py-1 px-2.5 rounded-full text-[0.72rem] font-bold bg-cc-orange/10 text-cc-orange border border-cc-orange/30">⚡ Sepolia Testnet</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                <div className="bg-cc-card2 rounded-xl p-4">
                  <div className="text-[0.75rem] text-cc-muted2 mb-1">⚡ ETH Balance</div>
                  <div className="text-[1.5rem] font-extrabold">{(+ethBalance).toFixed(4)} ETH</div>
                  <div className="text-[0.75rem] text-cc-muted2">Sepolia ETH</div>
                </div>
                <div className="bg-cc-card2 rounded-xl p-4">
                  <div className="text-[0.75rem] text-cc-muted2 mb-1">🌿 CO₂ Credits</div>
                  <div className="text-[1.5rem] font-extrabold text-cc-green">{co2Balance} CCT</div>
                  <div className="text-[0.75rem] text-cc-muted2">CCT Tokens</div>
                </div>
              </div>
            </div>

            {userType === 'company' && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-7">
              <div className="bg-cc-card border border-cc-border rounded-2xl p-5.5 p-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.2rem] mb-3 bg-cc-green/10 text-cc-green">🌿</div>
                <div className="text-[0.78rem] text-cc-muted2 mb-1">Total CO₂ Offset</div>
                <div className="text-[1.6rem] font-extrabold text-cc-green">{totalOffset.toLocaleString()} kg</div>
                <div className="text-[0.75rem] mt-1 text-cc-green">↑ Lifetime offset</div>
              </div>
              <div className="bg-cc-card border border-cc-border rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.2rem] mb-3 bg-cc-blue/10 text-cc-blue">⛓️</div>
                <div className="text-[0.78rem] text-cc-muted2 mb-1">Transactions</div>
                <div className="text-[1.6rem] font-extrabold text-cc-blue">{transactions.length}</div>
                <div className="text-[0.75rem] mt-1 text-cc-muted2">On-chain records</div>
              </div>
              <div className="bg-cc-card border border-cc-border rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.2rem] mb-3 bg-cc-orange/10 text-cc-orange">Ξ</div>
                <div className="text-[0.78rem] text-cc-muted2 mb-1">ETH Spent</div>
                <div className="text-[1.6rem] font-extrabold text-cc-orange">{totalEth.toFixed(4)} ETH</div>
                <div className="text-[0.75rem] mt-1 text-cc-muted2">Total investment</div>
              </div>
              <div className="bg-cc-card border border-cc-border rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.2rem] mb-3 bg-cc-purple/10 text-cc-purple">🏆</div>
                <div className="text-[0.78rem] text-cc-muted2 mb-1">Carbon Rank</div>
                <div className="text-[1.6rem] font-extrabold text-cc-purple">{rank}</div>
                <div className="text-[0.75rem] mt-1 text-cc-muted2">vs global avg</div>
              </div>
            </div>
            )}

            {userType === 'company' && (
              <>
                <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-6">
                  <div className="text-[1rem] font-bold mb-4">📈 Monthly CO₂ Offset Progress</div>
                  <div className="relative h-[200px]">
                    <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#64748b' } }, y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#64748b' } } } }} />
                  </div>
                </div>

                <div className="bg-cc-card border border-cc-border rounded-[18px] overflow-hidden">
                  <div className="p-4 flex justify-between items-center border-b border-cc-border">
                    <div className="text-[1rem] font-bold">🔗 Transaction History</div>
                    <div className="flex gap-2">
                      <button 
                        className="py-1.5 px-3.5 bg-cc-green text-black border-none rounded-lg cursor-pointer text-[0.8rem] font-bold transition-all hover:bg-cc-emerald hover:shadow-neon-green" 
                        onClick={handleExportExcel}
                      >
                        <i className="fas fa-file-excel mr-1.5"></i> Excel Report
                      </button>
                      <button className="py-1.5 px-3.5 bg-cc-card2 border border-cc-border2 rounded-lg text-cc-muted2 cursor-pointer text-[0.8rem]" onClick={refreshHistory}><i className="fas fa-sync-alt"></i> Refresh</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="p-3 text-left text-[0.75rem] font-bold uppercase tracking-[0.5px] text-cc-muted2 bg-white/5 border-b border-cc-border">Date</th>
                          <th className="p-3 text-left text-[0.75rem] font-bold uppercase tracking-[0.5px] text-cc-muted2 bg-white/5 border-b border-cc-border">Project</th>
                          <th className="p-3 text-left text-[0.75rem] font-bold uppercase tracking-[0.5px] text-cc-muted2 bg-white/5 border-b border-cc-border">Credits</th>
                          <th className="p-3 text-left text-[0.75rem] font-bold uppercase tracking-[0.5px] text-cc-muted2 bg-white/5 border-b border-cc-border">ETH Paid</th>
                          <th className="p-3 text-left text-[0.75rem] font-bold uppercase tracking-[0.5px] text-cc-muted2 bg-white/5 border-b border-cc-border">Tx Hash</th>
                          <th className="p-3 text-left text-[0.75rem] font-bold uppercase tracking-[0.5px] text-cc-muted2 bg-white/5 border-b border-cc-border">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr><td colSpan="6" className="text-center text-cc-muted2 p-7">No transactions yet. Buy your first carbon credit!</td></tr>
                        ) : (
                          transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-white/5">
                              <td className="p-3.5 border-b border-cc-border text-[0.83rem] text-cc-muted2">{tx.date}<br/><span className="text-[0.7rem]">{tx.time}</span></td>
                              <td className="p-3.5 border-b border-cc-border text-[0.83rem]"><span className="font-semibold">{tx.project}</span></td>
                              <td className="p-3.5 border-b border-cc-border text-[0.83rem] text-cc-green font-bold">{tx.credits} CCT</td>
                              <td className="p-3.5 border-b border-cc-border text-[0.83rem] text-cc-orange">Ξ {tx.ethPaid}</td>
                              <td className="p-3.5 border-b border-cc-border text-[0.83rem]"><a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noreferrer" className="text-cc-blue text-[0.78rem] decoration-none">{tx.txHash.slice(0,10)}...{tx.txHash.slice(-6)} ↗</a></td>
                              <td className="p-3.5 border-b border-cc-border text-[0.83rem]">
                                <span className={`py-1 px-2.5 rounded-full text-[0.72rem] font-bold ${tx.status === 'success' ? 'bg-cc-green/10 text-cc-green' : 'bg-cc-red/10 text-cc-red'}`}>
                                  {tx.status === 'success' ? '✅ Success' : '❌ Failed'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {userType === 'individual' && (
              <div className="animate-slideUp">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[1.2rem] font-bold flex items-center gap-2">
                    <span className="text-[1.4rem]">🏅</span> My Achievement Badges
                  </h3>
                  <span className="text-[0.8rem] text-cc-muted2 bg-cc-card2 py-1 px-3 rounded-full border border-cc-border">
                    Level 2 Eco-Traveler
                  </span>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
                  <div className="bg-cc-card border border-cc-border rounded-2xl p-6 transition-all duration-300 hover:border-cc-green hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)] group">
                    <div className="w-16 h-16 rounded-full bg-cc-green/10 flex items-center justify-center text-[2rem] mb-4 mx-auto border-2 border-cc-green/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.15)]">🔥</div>
                    <div className="text-center">
                      <div className="font-bold text-[1.1rem] mb-1">Daily Streak</div>
                      <div className="text-[0.75rem] text-cc-muted2 leading-[1.5] mb-3">Calculate your footprint 3 days in a row!</div>
                      <div className="w-full bg-cc-card2 h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-cc-green h-full w-[66%]"></div>
                      </div>
                      <div className="text-[0.7rem] text-cc-green font-bold">2/3 Days Active</div>
                    </div>
                  </div>

                  <div className="bg-cc-card border border-cc-border rounded-2xl p-6 transition-all duration-300 hover:border-cc-blue hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] group">
                    <div className="w-16 h-16 rounded-full bg-cc-blue/10 flex items-center justify-center text-[2rem] mb-4 mx-auto border-2 border-cc-blue/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.15)]">🛡️</div>
                    <div className="text-center">
                      <div className="font-bold text-[1.1rem] mb-1">Green Warrior</div>
                      <div className="text-[0.75rem] text-cc-muted2 leading-[1.5] mb-3">Reach your first 100kg total carbon offset goal.</div>
                      <div className="w-full bg-cc-card2 h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-cc-blue h-full w-[100%]"></div>
                      </div>
                      <div className="text-[0.7rem] text-cc-blue font-bold">COMPLETED ✅</div>
                    </div>
                  </div>

                  <div className="bg-cc-card border border-cc-border rounded-2xl p-6 transition-all duration-300 opacity-60 hover:opacity-100 group grayscale hover:grayscale-0">
                    <div className="w-16 h-16 rounded-full bg-cc-purple/10 flex items-center justify-center text-[2rem] mb-4 mx-auto border-2 border-cc-purple/20 group-hover:scale-110 transition-transform">🌿</div>
                    <div className="text-center">
                      <div className="font-bold text-[1.1rem] mb-1">Eco-Efficiency</div>
                      <div className="text-[0.75rem] text-cc-muted2 leading-[1.6]">Maintain an average footprint under 10kg for a full week.</div>
                      <div className="mt-3 text-[0.7rem] text-cc-muted uppercase tracking-wider font-bold">Locked</div>
                    </div>
                  </div>

                  <div className="bg-cc-card border border-cc-border rounded-2xl p-6 transition-all duration-300 hover:border-cc-orange hover:shadow-[0_10px_30px_rgba(249,115,22,0.1)] group">
                    <div className="w-16 h-16 rounded-full bg-cc-orange/10 flex items-center justify-center text-[2rem] mb-4 mx-auto border-2 border-cc-orange/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.15)]">🏆</div>
                    <div className="text-center">
                      <div className="font-bold text-[1.1rem] mb-1">Carbon Hero</div>
                      <div className="text-[0.75rem] text-cc-muted2 leading-[1.5] mb-3">Fall into the top 5% of global emission reducers.</div>
                      <div className="w-full bg-cc-card2 h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-cc-orange h-full w-[45%]"></div>
                      </div>
                      <div className="text-[0.7rem] text-cc-orange font-bold">Level 1 in Progress</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-br from-cc-green/10 to-cc-blue/10 border border-cc-border rounded-[22px] p-8 text-center relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-cc-green/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="text-cc-green font-bold text-[0.8rem] uppercase tracking-widest mb-2">Sustainable Milestone</div>
                    <h4 className="text-[1.8rem] font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cc-green to-cc-blue">Earth Day Contribution</h4>
                    <p className="text-[0.95rem] text-cc-muted2 max-w-[500px] mx-auto leading-[1.7] mb-6">
                      You've consistently kept your daily transport emissions in check! <br/>
                      <span className="text-white font-bold">Keep going to unlock the exclusive "Planet Saver" limited edition badge.</span>
                    </p>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
                    <button className="py-2.5 px-8 rounded-full bg-white text-black font-bold text-[0.85rem] transition-all hover:scale-105 hover:bg-cc-green hover:text-white" onClick={handleAuditClick}>
                      <i className="fas fa-camera mr-2"></i> Audit Today's Impact
                    </button>
                  </div>
                </div>

                {/* Audit Photo Result Modal */}
                {auditPhoto && (
                  <div className="fixed inset-0 bg-black/75 z-[3000] flex items-center justify-center p-5 animate-fadeIn" onClick={closeAuditModal}>
                    <div className="bg-cc-card border border-cc-border2 rounded-[22px] p-6 max-w-[480px] w-full animate-modalIn" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[1.1rem] font-bold flex items-center gap-2"><span className="text-cc-green">📸</span> Impact Audit</h3>
                        <button className="bg-transparent border-none text-cc-muted2 text-[1.2rem] cursor-pointer hover:text-white" onClick={closeAuditModal}>✕</button>
                      </div>

                      {/* Uploaded Photo */}
                      <div className="rounded-xl overflow-hidden border border-cc-border mb-4 max-h-[250px]">
                        <img src={auditPhoto} alt="Audit" className="w-full h-full object-cover max-h-[250px]" />
                      </div>

                      {/* Loading State */}
                      {auditLoading && (
                        <div className="text-center py-6">
                          <div className="w-[48px] h-[48px] border-4 border-cc-border border-t-cc-green rounded-full animate-spin mx-auto mb-3"></div>
                          <div className="text-[0.9rem] text-cc-muted2">🔍 Analyzing your eco-activity...</div>
                        </div>
                      )}

                      {/* Result */}
                      {auditResult && (
                        <div className="animate-fadeIn">
                          {auditResult.error ? (
                            // Error / Rejection Case
                            <div className="bg-cc-red/10 border border-cc-red/30 rounded-xl p-5 text-center mb-4">
                              <div className="text-[3rem] mb-2">❌</div>
                              <div className="text-[1.1rem] font-bold text-cc-red mb-2">Audit Failed</div>
                              <div className="text-[0.85rem] text-cc-muted2 leading-[1.6] mb-4">{auditResult.text}</div>
                              <button className="w-full py-2.5 rounded-xl bg-cc-card2 border border-cc-border text-white font-bold text-[0.85rem] cursor-pointer" onClick={() => { closeAuditModal(); handleAuditClick(); }}>
                                <i className="fas fa-redo mr-2"></i> Try Another Photo
                              </button>
                            </div>
                          ) : (
                            // Success Case
                            <>
                              <div className="bg-cc-card2 border border-cc-border rounded-xl p-5 text-center mb-4">
                                <div className="text-[3rem] mb-2">{auditResult.icon}</div>
                                <div className="text-[0.75rem] uppercase tracking-widest font-bold mb-1" style={{ color: auditResult.color }}>Achievement Unlocked!</div>
                                <div className="text-[1.3rem] font-extrabold mb-2" style={{ color: auditResult.color }}>{auditResult.badge}</div>
                                <div className="text-[0.85rem] text-cc-muted2 leading-[1.6]">{auditResult.desc}</div>
                              </div>
                              <div className="flex gap-3">
                                <button className="flex-1 py-2.5 rounded-xl bg-cc-green text-black font-bold text-[0.85rem] border-none cursor-pointer transition-all hover:bg-cc-emerald" onClick={closeAuditModal}>
                                  🎉 Claim Badge
                                </button>
                                <button className="flex-1 py-2.5 rounded-xl bg-cc-card2 border border-cc-border text-cc-muted2 font-bold text-[0.85rem] cursor-pointer transition-all hover:text-white hover:border-cc-green" onClick={() => { closeAuditModal(); handleAuditClick(); }}>
                                  📸 Upload Another
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
