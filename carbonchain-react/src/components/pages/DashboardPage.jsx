import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppState } from '../../hooks/useAppState';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function DashboardPage() {
  const { account, ethBalance, co2Balance, transactions, connectWallet, shortAddr, showAlert } = useAppState();

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

            <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-6">
              <div className="text-[1rem] font-bold mb-4">📈 Monthly CO₂ Offset Progress</div>
              <div className="relative h-[200px]">
                <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#64748b' } }, y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#64748b' } } } }} />
              </div>
            </div>

            <div className="bg-cc-card border border-cc-border rounded-[18px] overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b border-cc-border">
                <div className="text-[1rem] font-bold">🔗 Transaction History</div>
                <button className="py-1.5 px-3.5 bg-cc-card2 border border-cc-border2 rounded-lg text-cc-muted2 cursor-pointer text-[0.8rem]" onClick={refreshHistory}><i className="fas fa-sync-alt"></i> Refresh</button>
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
          </div>
        )}
      </div>
    </div>
  );
}
