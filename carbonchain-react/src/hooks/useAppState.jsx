import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';

const API_BASE_URL = 'http://localhost:8080/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  // Wallet & Blockchain State
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [co2Balance, setCo2Balance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('company'); // Defaulting to company
  const [user, setUser] = useState(null);
  const [authModeIntent, setAuthModeIntent] = useState('login'); // track if they clicked sign in or log in
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);

  // 🏛️ Regulatory State Tracker
  const [allowableOffset, setAllowableOffset] = useState(-1);
  const [offsettingBlocked, setOffsettingBlocked] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  
  // Alert Helper
  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Navigation Helper
  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo(0,0);
  };
  
  const handleGatedNav = (pageId) => {
    if(!isLoggedIn) {
      showAlert('⚠️ You must log in first to access this feature.', 'error');
      setAuthModeIntent('login');
      // Trigger Auth Modal directly for company
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { type: 'company', mode: 'login' } }));
      return;
    }
    navigateTo(pageId);
  };

  // Logout Helper
  const logout = () => {
    setIsLoggedIn(false);
    setUserType('company');
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('token');
    navigateTo('home');
    showAlert('ℹ️ You have been logged out', 'info');
  };

  // Auth Effect: Fetch user if token exists
  useEffect(() => {
    const checkAuth = async () => {
      if (authToken) {
        try {
          const res = await axios.get(`${API_BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          setUser(res.data);
          setUserType(res.data.type);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Auth check failed", err);
          logout();
        }
      }
    };
    checkAuth();
  }, [authToken]);

  const shortAddr = (addr) => {
    if(!addr) return '';
    return addr.slice(0,6) + '...' + addr.slice(-4);
  };

  // Wallet Connection
  const connectWallet = async () => {
    if(!window.ethereum) {
      showAlert('🦊 MetaMask not found! Simulating wallet for demo...', 'info');
      const dummyAcc = '0x' + Array.from({length:40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setAccount(dummyAcc);
      setEthBalance('10.5000');
      showAlert('✅ Demo Wallet connected: ' + shortAddr(dummyAcc), 'success');
      return;
    }
    try {
      showAlert('🦊 Connecting to MetaMask...', 'info');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      setSigner(web3Provider.getSigner());

      showAlert('✅ Wallet connected: ' + shortAddr(accounts[0]), 'success');

      // Listen for changes
      window.ethereum.on('accountsChanged', (accs) => {
        if(accs.length === 0) disconnectWallet();
        else { setAccount(accs[0]); }
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    } catch(err) {
      showAlert('❌ ' + (err.message || 'Connection failed'), 'error');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
  };

  // Update Balances
  useEffect(() => {
    const fetchBalances = async () => {
      if(account && provider) {
        try {
          const bal = await provider.getBalance(account);
          setEthBalance(ethers.utils.formatEther(bal));
        } catch(e) {
          console.warn("Could not fetch ETH balance", e);
        }

        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const bal = await contract.balanceOf(account);
          const balNumber = Number(ethers.utils.formatUnits(bal, bal.gt(1000000) ? 18 : 0));
          setCo2Balance(Math.floor(balNumber));
        } catch(e) {
          console.warn("Could not fetch CO2 balance from contract", e.message);
          setCo2Balance(0);
        }
        
        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const filter = contract.filters.CreditsPurchased(account);
          const events = await contract.queryFilter(filter);
          let txs = [];
          if (events && events.length > 0) {
            txs = events.map(e => {
              let c = e.args.amount ? e.args.amount.toNumber() : 0;
              let eth = e.args.ethPaid ? ethers.utils.formatEther(e.args.ethPaid) : "0";
              return {
                id: e.blockNumber,
                date: "Web3",
                time: "Tx",
                project: "Blockchain Record",
                credits: c,
                ethPaid: Number(eth).toFixed(4),
                co2Offset: c * 1000,
                txHash: e.transactionHash,
                status: "success",
                account: account
              };
            }).reverse();
          }
          
          const localTxs = JSON.parse(localStorage.getItem('txs_' + account) || '[]');
          if (txs.length === 0 && localTxs.length > 0) txs = localTxs;
          setTransactions(txs);
          
        } catch(e) {
          console.warn("Blockchain query failed.", e.message);
          const localTxs = JSON.parse(localStorage.getItem('txs_' + account) || '[]');
          setTransactions(localTxs);
        }
      }
    };
    fetchBalances();
  }, [account, provider]);

  const value = {
    currentPage, navigateTo, handleGatedNav,
    alert, showAlert,
    account, provider, signer, ethBalance, co2Balance, setCo2Balance, transactions, setTransactions,
    connectWallet, disconnectWallet, shortAddr,
    isLoggedIn, setIsLoggedIn, userType, setUserType, user, setUser, logout,
    chatOpen, setChatOpen,
    allowableOffset, setAllowableOffset, offsettingBlocked, setOffsettingBlocked, purchaseCompleted, setPurchaseCompleted,
    authModeIntent, setAuthModeIntent,
    authToken, setAuthToken, API_BASE_URL
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  return useContext(AppContext);
}
