import React from 'react';
import { useAppState } from '../hooks/useAppState';

export default function Navbar() {
  const {
    currentPage, navigateTo, handleGatedNav,
    isLoggedIn, userType, user, logout,
    account, connectWallet, shortAddr,
    setAuthModeIntent
  } = useAppState();

  const openAuthChoice = (intent) => {
    setAuthModeIntent(intent);
    navigateTo('profileSelection');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-cc-bg/85 backdrop-blur-md border-b border-cc-border flex items-center justify-between px-6 h-16">
      <div className="flex items-center gap-2.5 text-[1.1rem] font-extrabold cursor-pointer" onClick={() => navigateTo('home')}>
        <i className="fas fa-leaf text-cc-green"></i>
        <span style={{
          background: 'linear-gradient(135deg, var(--green) 0%, var(--teal) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CarbonChain
        </span>
      </div>

      <div className="hidden sm:flex gap-1" id="navLinks">
        <button
          className={`py-1.5 px-3.5 rounded-lg text-[0.82rem] font-semibold transition-all duration-200 border-none bg-transparent ${currentPage === 'home' ? 'bg-cc-green/10 text-cc-green' : 'text-cc-muted2 hover:bg-cc-green/10 hover:text-cc-green'}`}
          onClick={() => navigateTo('home')}
        >
          🏠 Home
        </button>
        <button
          className={`py-1.5 px-3.5 rounded-lg text-[0.82rem] font-semibold transition-all duration-200 border-none bg-transparent ${currentPage === 'calculator' ? 'bg-cc-green/10 text-cc-green' : 'text-cc-muted2 hover:bg-cc-green/10 hover:text-cc-green'}`}
          onClick={() => handleGatedNav('calculator')}
        >
          🧮 Calculator
        </button>

        {isLoggedIn && (
          <>
            <button
              className={`py-1.5 px-3.5 rounded-lg text-[0.82rem] font-semibold transition-all duration-200 border-none bg-transparent ${currentPage === 'marketplace' ? 'bg-cc-green/10 text-cc-green' : 'text-cc-muted2 hover:bg-cc-green/10 hover:text-cc-green'}`}
              onClick={() => navigateTo('marketplace')}
            >
              🛒 Buy Credits
            </button>
            <button
              className={`py-1.5 px-3.5 rounded-lg text-[0.82rem] font-semibold transition-all duration-200 border-none bg-transparent ${currentPage === 'dashboard' ? 'bg-cc-green/10 text-cc-green' : 'text-cc-muted2 hover:bg-cc-green/10 hover:text-cc-green'}`}
              onClick={() => navigateTo('dashboard')}
            >
              📊 Dashboard
            </button>
          </>
        )}

        <button
          className={`py-1.5 px-3.5 rounded-lg text-[0.82rem] font-semibold transition-all duration-200 border-none bg-transparent ${currentPage === 'contact' ? 'bg-cc-green/10 text-cc-green' : 'text-cc-muted2 hover:bg-cc-green/10 hover:text-cc-green'}`}
          onClick={() => navigateTo('contact')}
        >
          📞 Contact Us
        </button>

        <button
          className={`py-1.5 px-3.5 rounded-lg text-[0.82rem] font-semibold transition-all duration-200 border-none bg-transparent ${currentPage === 'about' ? 'bg-cc-green/10 text-cc-green' : 'text-cc-muted2 hover:bg-cc-green/10 hover:text-cc-green'}`}
          onClick={() => navigateTo('about')}
        >
          ℹ️ About Us
        </button>


      </div>

      <div className="flex items-center gap-2.5">
        <div id="authSection">
          {isLoggedIn ? (
            <div className="flex items-center gap-2 bg-cc-card2 border border-cc-border py-1 px-3 rounded-full text-[0.8rem]">
              <i className={`fas fa-${userType === 'individual' ? 'user' : 'building'}`}></i>
              <span>{user?.name?.split(' ')[0] || user?.companyName?.split(' ')[0]}</span>
              <i className="fas fa-sign-out-alt text-cc-red cursor-pointer text-[0.8rem] ml-2" onClick={logout} title="Logout"></i>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="btn-outline"
                style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '10px' }}
                onClick={() => openAuthChoice('login')}
              >
                Log In
              </button>
              <button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '10px' }}
                onClick={() => openAuthChoice('signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <button
            className={`flex items-center gap-2 py-2 px-[18px] rounded-[10px] text-[0.82rem] font-bold cursor-pointer transition-all duration-200`}
            style={
              account
                ? { background: 'linear-gradient(135deg, #1e3a2f, #1a3530)', border: '1px solid var(--green)', color: 'var(--green)' }
                : { background: 'linear-gradient(135deg, var(--green) 0%, var(--emerald) 100%)', border: 'none', color: 'white' }
            }
            onClick={connectWallet}
          >
            {account ? (
              <><i className="fas fa-circle text-[0.5rem]"></i> {shortAddr(account)}</>
            ) : (
              <><i className="fas fa-wallet"></i> Connect Wallet</>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
