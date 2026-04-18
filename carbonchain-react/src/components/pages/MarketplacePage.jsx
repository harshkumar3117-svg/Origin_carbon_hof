import React, { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { PROJECTS } from '../../constants/projects';
import { CONTRACT_ADDRESS } from '../../constants/contract';

export default function MarketplacePage() {
  const { navigateTo } = useAppState();
  const [filter, setFilter] = useState('all');

  const items = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.type === filter);

  const handleBuyClicks = (projectId) => {
    window.dispatchEvent(new CustomEvent('openBuyModal', { detail: { projectId } }));
  };

  return (
    <div className="min-h-screen pt-[84px] pb-[60px] animate-fadeIn">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="pt-[30px] pb-5">
          <div className="text-[1.8rem] font-extrabold mb-1.5">🌱 Carbon Credit Marketplace</div>
          <div className="text-[0.9rem] text-cc-muted2">Buy verified CO₂ offset tokens — Powered by Ethereum smart contract</div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex gap-1.5">
            <button className={`py-1.5 px-4 rounded-lg text-[0.8rem] font-semibold border ${filter === 'all' ? 'border-cc-green text-cc-green bg-cc-green/10' : 'border-cc-border text-cc-muted2 bg-transparent hover:border-cc-green hover:text-cc-green hover:bg-cc-green/10'} transition-all`} onClick={() => setFilter('all')}>All Projects</button>
            <button className={`py-1.5 px-4 rounded-lg text-[0.8rem] font-semibold border ${filter === 'forest' ? 'border-cc-green text-cc-green bg-cc-green/10' : 'border-cc-border text-cc-muted2 bg-transparent hover:border-cc-green hover:text-cc-green hover:bg-cc-green/10'} transition-all`} onClick={() => setFilter('forest')}>🌲 Forest</button>
            <button className={`py-1.5 px-4 rounded-lg text-[0.8rem] font-semibold border ${filter === 'solar' ? 'border-cc-green text-cc-green bg-cc-green/10' : 'border-cc-border text-cc-muted2 bg-transparent hover:border-cc-green hover:text-cc-green hover:bg-cc-green/10'} transition-all`} onClick={() => setFilter('solar')}>☀️ Solar</button>
            <button className={`py-1.5 px-4 rounded-lg text-[0.8rem] font-semibold border ${filter === 'wind' ? 'border-cc-green text-cc-green bg-cc-green/10' : 'border-cc-border text-cc-muted2 bg-transparent hover:border-cc-green hover:text-cc-green hover:bg-cc-green/10'} transition-all`} onClick={() => setFilter('wind')}>💨 Wind</button>
            <button className={`py-1.5 px-4 rounded-lg text-[0.8rem] font-semibold border ${filter === 'ocean' ? 'border-cc-green text-cc-green bg-cc-green/10' : 'border-cc-border text-cc-muted2 bg-transparent hover:border-cc-green hover:text-cc-green hover:bg-cc-green/10'} transition-all`} onClick={() => setFilter('ocean')}>🌊 Ocean</button>
          </div>
          <div className="flex items-center gap-2 text-[0.82rem] text-cc-muted2">
            <span>Smart Contract:</span>
            <span className="font-mono text-cc-blue text-[0.75rem]">{CONTRACT_ADDRESS.slice(0,6) + '...' + CONTRACT_ADDRESS.slice(-4)}</span>
            <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="text-cc-blue text-[0.75rem]">View ↗</a>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {items.map(p => (
            <div key={p.id} className="bg-cc-card border border-cc-border rounded-[18px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="h-[140px] flex items-center justify-center text-[3rem] relative" style={{ background: p.bg }}>
                <span>{p.emoji}</span>
                <span className="absolute top-2.5 right-2.5 py-1 px-2.5 rounded-full text-[0.7rem] font-bold" style={{ background: p.badgeColor, color: p.badgeText }}>{p.badge}</span>
              </div>
              <div className="p-[18px]">
                <div className="text-[1rem] font-bold mb-1">{p.name}</div>
                <div className="text-[0.8rem] text-cc-muted2 mb-3 leading-[1.5]">{p.desc}</div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="text-[0.72rem] py-1 px-2 rounded-md bg-cc-green/10 text-cc-green">{p.verified}</span>
                  <span className="text-[0.72rem] py-1 px-2 rounded-md bg-white/5 text-cc-muted2">{p.country}</span>
                  <span className="text-[0.72rem] py-1 px-2 rounded-md bg-white/5 text-cc-muted2">{p.available.toLocaleString()} left</span>
                </div>
                <div className="flex justify-between items-center mb-[14px]">
                  <div className="text-[0.85rem] text-cc-green font-semibold">🌿 {p.co2}</div>
                  <div className="text-right">
                    <div className="text-[1.1rem] font-extrabold text-cc-text">Ξ {p.priceEth}</div>
                    <div className="text-[0.72rem] text-cc-muted2">≈ ${p.priceUsd} USD</div>
                  </div>
                </div>
                <button className="calc-btn w-full mt-3" style={{ padding: '12px' }} onClick={() => handleBuyClicks(p.id)}>
                  <i className="fab fa-ethereum"></i> Buy with ETH
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
