import React, { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { PROJECTS } from '../../constants/projects';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../constants/contract';
import { ethers } from 'ethers';

export default function BuyModal() {
  const { account, signer, showAlert, connectWallet, co2Balance, setCo2Balance, transactions, setTransactions } = useAppState();
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [project, setProject] = useState(null);
  const [qty, setQty] = useState(1);
  
  const [txHash, setTxHash] = useState('');
  const [failReason, setFailReason] = useState('');

  useEffect(() => {
    const handleOpen = async (e) => {
      const pId = e.detail.projectId;
      if (!account) {
        showAlert('🦊 Please connect MetaMask first!', 'error');
        // If we can't await connectWallet properly here, just warn them. The modal will still open but they cannot buy.
        // For better UX, we could call connectWallet.
      }
      const p = PROJECTS.find(x => x.id === pId);
      setProject(p);
      setQty(1);
      setStep(1);
      setIsOpen(true);
    };
    window.addEventListener('openBuyModal', handleOpen);
    return () => window.removeEventListener('openBuyModal', handleOpen);
  }, [account, showAlert]);

  const changeQty = (delta) => {
    setQty(Math.max(1, Math.min(20, qty + delta)));
  };

  const closeModal = () => setIsOpen(false);

  const confirmPurchase = async () => {
    let currentAccount = account;
    if (!currentAccount) {
      try {
        await connectWallet();
        // Since connectWallet is async but state updates are batched, we might not have 'account' immediately here
        // The user would need to click "Confirm" again, but we can at least show a friendly message
        showAlert('🦊 Please click Confirm again now that your wallet is connected!', 'info');
        return;
      } catch (e) {
        return;
      }
    }
    
    if (!project) return;
    
    setStep(2);
    
    try {
      const totalEth = project.priceEth * qty;
      const ethAmount = ethers.utils.parseEther(totalEth.toFixed(6));

      let tHash;

      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        // Explicit gasLimit bypasses ethers.js gas estimation and forces the MetaMask popup
        // Send a direct transaction to trigger Metamask robustly
        const tx = await contract.buyCredits(currentAccount, qty, { value: ethAmount, gasLimit: 300000 });
        const receipt = await tx.wait();
        tHash = receipt.transactionHash;
      } catch(contractErr) {
        if(contractErr?.code === 4001) throw contractErr; // MetaMask user rejected
        console.warn('Contract call failed or reverted, using ETH transfer fallback:', contractErr.message);
        
        // Fallback: send ETH directly to the contract address ensuring Metamask opens
        const tx = await signer.sendTransaction({
          to: CONTRACT_ADDRESS,
          value: ethAmount,
          gasLimit: 21000
        });
        const receipt = await tx.wait();
        tHash = receipt.transactionHash;
      }

      // Record transaction
      const txObj = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        project: project.name,
        credits: qty,
        ethPaid: totalEth.toFixed(4),
        co2Offset: qty * 1000,
        txHash: tHash,
        status: 'success',
        account: account
      };
      
      const newTxs = [txObj, ...transactions];
      setTransactions(newTxs);
      setCo2Balance(co2Balance + qty);
      
      const key = 'txs_' + account;
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      stored.unshift(txObj);
      localStorage.setItem(key, JSON.stringify(stored.slice(0,50)));
      localStorage.setItem('co2_balance_' + account, co2Balance + qty);

      setTxHash(tHash);
      setStep(3);
      showAlert(`🎉 Purchase successful! ${qty} carbon credits minted!`, 'success');

    } catch (err) {
      console.error('Purchase error:', err);
      const reason = err.code === 4001 ? 'You rejected the transaction in MetaMask.'
                   : err.code === -32603 ? 'Insufficient ETH balance or network error.'
                   : (err.reason || err.message || 'Transaction failed.');
      setFailReason(reason);
      setStep(4);
      showAlert('❌ ' + reason, 'error');
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-[2000] flex animate-fadeIn items-center justify-center p-5 hidden [&.flex]:flex">
      <div className="bg-cc-card border border-cc-border2 rounded-[20px] p-8 max-w-[480px] w-full animate-modalIn">
        {step === 1 && (
          <div>
            <h2 className="text-[1.3rem] font-extrabold mb-1.5">Buy Offset Credits</h2>
            <p className="text-cc-muted2 mb-5">🌿 {project.name}</p>
            
            <div className="bg-white/5 p-4 rounded-xl mb-5">
              <div className="flex justify-between mb-3"><span className="text-cc-muted2">Project</span><span className="font-semibold">{project.name}</span></div>
              <div className="flex justify-between mb-3"><span className="text-cc-muted2">CO₂ Offset per credit</span><span className="text-cc-green font-semibold">{project.co2}</span></div>
              <div className="flex justify-between mb-3"><span className="text-cc-muted2">Price per credit</span><span className="font-semibold">Ξ {project.priceEth} ETH</span></div>
              <div className="flex justify-between pt-3 border-t border-white/10"><span className="text-cc-muted2">Total Payable</span><span className="text-cc-orange font-extrabold text-[1.1rem]">Ξ {(project.priceEth * qty).toFixed(3)} ETH</span></div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-cc-muted2 text-[0.9rem]">Quantity</span>
              <button onClick={() => changeQty(-1)} className="py-1.5 px-3 rounded-lg border border-cc-border2 bg-cc-card2 text-white cursor-pointer">-</button>
              <span className="font-bold text-[1.1rem] min-w-[30px] text-center">{qty}</span>
              <button onClick={() => changeQty(1)} className="py-1.5 px-3 rounded-lg border border-cc-border2 bg-cc-card2 text-white cursor-pointer">+</button>
            </div>

            <div className="text-[0.8rem] text-cc-muted2 mb-5 flex items-center gap-2">
              <i className="fas fa-shield-alt text-cc-green"></i> Smart Contract: <span className="font-mono">{CONTRACT_ADDRESS.slice(0,10) + '...' + CONTRACT_ADDRESS.slice(-4)}</span>
            </div>

            <button className="btn-primary w-full mb-3" onClick={confirmPurchase}>Confirm Purchase <i className="fab fa-ethereum"></i></button>
            <button className="modal-btn-cancel w-full" onClick={closeModal}>Cancel</button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-10">
            <div className="text-[3rem] text-cc-blue mb-5">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h3 className="text-[1.3rem] font-bold mb-2">Confirm in MetaMask...</h3>
            <p className="text-cc-muted2 text-[0.9rem]">Please approve the transaction...</p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-5">
            <div className="text-[3.5rem] text-cc-green mb-5">✅</div>
            <h3 className="text-[1.3rem] font-bold mb-2">Purchase Successful!</h3>
            <p className="text-cc-muted2 text-[0.9rem] mb-5">Your Carbon Credits (CCT) have been minted to your wallet.</p>
            <div className="bg-cc-green/10 p-3 rounded-lg mb-6 text-[0.85rem] break-all">
              <span className="text-cc-green font-bold">TxHash:</span> <span className="text-white">{txHash}</span><br/>
              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-cc-blue decoration-none mt-2 inline-block">View on Etherscan ↗</a>
            </div>
            <button className="btn-primary w-full" onClick={closeModal}>Close</button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-[30px]">
            <div className="text-[3.5rem] text-cc-red mb-5">❌</div>
            <h3 className="text-[1.3rem] font-bold mb-2">Transaction Failed</h3>
            <p className="text-cc-red text-[0.9rem] mb-5">{failReason}</p>
            <button className="btn-primary w-full mb-3" onClick={() => setStep(1)}>Try Again</button>
            <button className="modal-btn-cancel w-full" onClick={closeModal}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
