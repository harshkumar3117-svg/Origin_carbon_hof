import React from 'react';
import { useAppState } from '../../hooks/useAppState';

export default function HomePage() {
  const { navigateTo, handleGatedNav, isLoggedIn, connectWallet, user, userType } = useAppState();

  return (
    <div className="min-h-screen pt-[84px] pb-[60px] animate-fadeIn">
      <div className="text-center pt-[60px] px-5 pb-10">
        <div className="inline-flex items-center gap-2 bg-cc-green/10 border border-cc-green/25 text-cc-green py-1.5 px-[18px] rounded-full text-[0.78rem] font-bold tracking-[1px] uppercase mb-6">
          <i className="fas fa-leaf"></i> Powered by Ethereum + ML
        </div>
        <h1 
          className="text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.1] mb-[18px]"
          style={{
            background: 'linear-gradient(135deg, var(--green) 0%, var(--teal) 40%, var(--blue) 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Offset Your Enterprise<br/>Footprint On-Chain
        </h1>
        <p className="text-[1.05rem] text-cc-muted2 max-w-[600px] mx-auto mb-9 leading-[1.7]">
          Calculate your company's CO₂ emissions using our professional ML model, then purchase verified carbon credits directly on the Ethereum blockchain.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <button className="btn-primary" onClick={() => handleGatedNav('calculator')}>
            <i className="fas fa-calculator"></i> Calculate Now
          </button>
          {isLoggedIn && userType !== 'individual' && (
            <button className="btn-outline" onClick={() => navigateTo('marketplace')}>
              <i className="fas fa-shopping-cart"></i> Buy Credits
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-5">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 my-10">
          <div className="bg-cc-card border border-cc-border rounded-2xl p-6 text-center">
            <div className="text-[2.2rem] font-extrabold mb-1.5 text-cc-green">4.0T</div>
            <div className="text-[0.85rem] text-cc-muted2">🌍 CO₂ Offset (tons)</div>
          </div>
          <div className="bg-cc-card border border-cc-border rounded-2xl p-6 text-center">
            <div className="text-[2.2rem] font-extrabold mb-1.5 text-cc-blue">1,240</div>
            <div className="text-[0.85rem] text-cc-muted2">🏢 Active Companies</div>
          </div>
          <div className="bg-cc-card border border-cc-border rounded-2xl p-6 text-center">
            <div className="text-[2.2rem] font-extrabold mb-1.5 text-cc-purple">38,924</div>
            <div className="text-[0.85rem] text-cc-muted2">⛓️ On-Chain Transactions</div>
          </div>
          <div className="bg-cc-card border border-cc-border rounded-2xl p-6 text-center">
            <div className="text-[2.2rem] font-extrabold mb-1.5 text-cc-orange">0.032</div>
            <div className="text-[0.85rem] text-cc-muted2">Ξ Avg Credit Price (ETH)</div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 my-10">
          <div 
            className="bg-cc-card border border-cc-border rounded-[18px] p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1.25 hover:border-cc-green hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            onClick={() => handleGatedNav('calculator')}
          >
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[1.4rem] mb-4 bg-cc-blue/10 text-cc-blue">📊</div>
            <h3 className="text-[1rem] font-bold mb-2">Enterprise ML Calculator</h3>
            <p className="text-[0.83rem] text-cc-muted2 leading-[1.6]">Analyze industrial energy, transport fleet, and corporate waste data.</p>
            <div className="mt-4 text-cc-green text-[0.82rem] font-semibold">Calculate →</div>
          </div>
          
          {isLoggedIn && userType !== 'individual' && (
            <div 
              className="bg-cc-card border border-cc-border rounded-[18px] p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1.25 hover:border-cc-green hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
              onClick={() => navigateTo('marketplace')}
            >
              <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[1.4rem] mb-4 bg-cc-green/10 text-cc-green">🌱</div>
              <h3 className="text-[1rem] font-bold mb-2">Buy Carbon Credits</h3>
              <p className="text-[0.83rem] text-cc-muted2 leading-[1.6]">Purchase ERC-20 CO₂ offset tokens directly from verified green projects. Pay with ETH via MetaMask.</p>
              <div className="mt-4 text-cc-green text-[0.82rem] font-semibold">Shop →</div>
            </div>
          )}
          
          <div 
            className="bg-cc-card border border-cc-border rounded-[18px] p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1.25 hover:border-cc-green hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            onClick={() => handleGatedNav('dashboard')}
          >
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[1.4rem] mb-4 bg-cc-purple/10 text-cc-purple">📊</div>
            <h3 className="text-[1rem] font-bold mb-2">Track Your Impact</h3>
            <p className="text-[0.83rem] text-cc-muted2 leading-[1.6]">View all blockchain transactions, token balances, and your cumulative carbon offset progress over time.</p>
            <div className="mt-4 text-cc-green text-[0.82rem] font-semibold">View Dashboard →</div>
          </div>
          
          <div 
            className="bg-cc-card border border-cc-border rounded-[18px] p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1.25 hover:border-cc-green hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            onClick={connectWallet}
          >
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[1.4rem] mb-4 bg-cc-orange/10 text-cc-orange">🦊</div>
            <h3 className="text-[1rem] font-bold mb-2">MetaMask Integration</h3>
            <p className="text-[0.83rem] text-cc-muted2 leading-[1.6]">Connect your MetaMask wallet to authorize transactions. All purchases are recorded on the Ethereum blockchain.</p>
            <div className="mt-4 text-cc-green text-[0.82rem] font-semibold">Connect →</div>
          </div>
        </div>

        <div className="bg-cc-card border border-cc-border rounded-[20px] p-8 my-5">
          <h2 className="text-[1.4rem] font-extrabold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-0">
            <div className="text-center p-4 relative transition-all duration-300 hover:-translate-y-2" style={{ filter: 'drop-shadow(0 10px 15px rgba(34,197,94,0.2))' }}>
              <div className="w-12 h-12 rounded-full bg-cc-green/15 border-2 border-cc-green flex items-center justify-center mx-auto mb-3 text-[1.3rem]">🏢</div>
              <div className="font-bold mb-1.5">1. Register</div>
              <div className="text-[0.8rem] text-cc-muted2">Create your professional company profile</div>
            </div>
            <div className="text-center p-4 relative transition-all duration-300 hover:-translate-y-2" style={{ filter: 'drop-shadow(0 10px 15px rgba(59,130,246,0.2))' }}>
              <div className="w-12 h-12 rounded-full bg-cc-blue/15 border-2 border-cc-blue flex items-center justify-center mx-auto mb-3 text-[1.3rem]">🦊</div>
              <div className="font-bold mb-1.5">2. Connect</div>
              <div className="text-[0.8rem] text-cc-muted2">Connect your MetaMask wallet securely</div>
            </div>
            <div className="text-center p-4 relative transition-all duration-300 hover:-translate-y-2" style={{ filter: 'drop-shadow(0 10px 15px rgba(168,85,247,0.2))' }}>
              <div className="w-12 h-12 rounded-full bg-cc-purple/15 border-2 border-cc-purple flex items-center justify-center mx-auto mb-3 text-[1.3rem]">🧮</div>
              <div className="font-bold mb-1.5">3. Calculate</div>
              <div className="text-[0.8rem] text-cc-muted2">ML model calculates your carbon footprint</div>
            </div>
            <div className="text-center p-4 relative transition-all duration-300 hover:-translate-y-2" style={{ filter: 'drop-shadow(0 10px 15px rgba(249,115,22,0.2))' }}>
              <div className="w-12 h-12 rounded-full bg-cc-orange/15 border-2 border-cc-orange flex items-center justify-center mx-auto mb-3 text-[1.3rem]">🛒</div>
              <div className="font-bold mb-1.5">4. Buy Credits</div>
              <div className="text-[0.8rem] text-cc-muted2">Purchase CO₂ offset tokens matching footprint</div>
            </div>
            <div className="text-center p-4 relative transition-all duration-300 hover:-translate-y-2" style={{ filter: 'drop-shadow(0 10px 15px rgba(20,184,166,0.2))' }}>
              <div className="w-12 h-12 rounded-full bg-cc-teal/15 border-2 border-cc-teal flex items-center justify-center mx-auto mb-3 text-[1.3rem]">⛓️</div>
              <div className="font-bold mb-1.5">5. Confirmed</div>
              <div className="text-[0.8rem] text-cc-muted2">Transaction recorded immutably on Ethereum</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
