import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppState } from '../../hooks/useAppState';

export default function AuthModal() {
  const { navigateTo, setIsLoggedIn, setUserType, setUser, showAlert, setAuthToken, API_BASE_URL } = useAppState();
  
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false);

  // Input states - Company only
  const [comLoginEmail, setComLoginEmail] = useState('');
  const [comLoginPass, setComLoginPass] = useState('');
  const [comSignupName, setComSignupName] = useState('');
  const [comSignupEmail, setComSignupEmail] = useState('');
  const [comSignupEmp, setComSignupEmp] = useState('');
  const [comSignupPass, setComSignupPass] = useState('');

  useEffect(() => {
    const handleOpen = (e) => {
      setAuthMode(e.detail.mode || 'login');
      setIsOpen(true);
    };
    window.addEventListener('openAuthModal', handleOpen);
    return () => window.removeEventListener('openAuthModal', handleOpen);
  }, []);

  const closeAuthModal = () => setIsOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processAuth();
    }
  };

  const processAuth = async () => {
    setIsLoading(true);
    try {
      if (authMode === 'signup') {
        const payload = {
          type: 'company',
          email: comSignupEmail,
          password: comSignupPass,
          companyName: comSignupName,
          empName: comSignupEmp
        };

        if (!payload.email || !payload.password || !payload.companyName) {
          showAlert('❌ Please fill in all required fields', 'error');
          setIsLoading(false);
          return;
        }

        await axios.post(`${API_BASE_URL}/auth/signup`, payload);
        showAlert('✅ Company account created! Now logging you in...', 'success');
        
        // Auto-login after signup
        const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: payload.email,
          password: payload.password
        });
        finalizeLogin(loginRes.data);
      } else {
        if (!comLoginEmail || !comLoginPass) {
          showAlert('❌ Please enter email and password', 'error');
          setIsLoading(false);
          return;
        }

        const res = await axios.post(`${API_BASE_URL}/auth/login`, { email: comLoginEmail, password: comLoginPass });
        finalizeLogin(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed';
      showAlert('❌ ' + msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeLogin = (data) => {
    const { token, name, userType } = data;
    localStorage.setItem('token', token);
    setAuthToken(token);
    setUser(data);
    setIsLoggedIn(true);
    setUserType('company');
    closeAuthModal();
    showAlert('✅ Logged in successfully as ' + name, 'success');
    navigateTo('calculator');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-[2000] flex animate-fadeIn items-center justify-center p-5 hidden [&.flex]:flex" onKeyDown={handleKeyDown}>
      <div className="bg-cc-card border border-cc-border2 rounded-[20px] p-8 max-w-[400px] w-full animate-modalIn">
        
        <div className="flex gap-2.5 mb-5 border-b border-cc-border pb-2.5">
          <div 
            className={`cursor-pointer font-semibold text-[0.9rem] py-1 px-2.5 ${authMode === 'login' ? 'text-cc-green border-b-2 border-cc-green' : 'text-cc-muted2'}`} 
            onClick={() => setAuthMode('login')}
          >
            Log In
          </div>
          <div 
            className={`cursor-pointer font-semibold text-[0.9rem] py-1 px-2.5 ${authMode === 'signup' ? 'text-cc-green border-b-2 border-cc-green' : 'text-cc-muted2'}`} 
            onClick={() => setAuthMode('signup')}
          >
            Sign Up
          </div>
        </div>
        
        {authMode === 'login' ? (
          <div>
            <div className="form-group">
              <label className="form-label">Company Email</label>
              <input type="email" value={comLoginEmail} onChange={e=>setComLoginEmail(e.target.value)} className="form-input" placeholder="admin@company.com" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={comLoginPass} onChange={e=>setComLoginPass(e.target.value)} className="form-input" placeholder="••••••••" />
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" value={comSignupName} onChange={e=>setComSignupName(e.target.value)} className="form-input" placeholder="EcoTech Solutions" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Business Email</label>
              <input type="email" value={comSignupEmail} onChange={e=>setComSignupEmail(e.target.value)} className="form-input" placeholder="representative@company.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Employee Name</label>
              <input type="text" value={comSignupEmp} onChange={e=>setComSignupEmp(e.target.value)} className="form-input" placeholder="Jane Smith" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={comSignupPass} onChange={e=>setComSignupPass(e.target.value)} className="form-input" placeholder="••••••••" />
            </div>
          </div>
        )}

        <button className="calc-btn mt-5 flex justify-center items-center gap-2" onClick={processAuth} disabled={isLoading}>
          {isLoading && <i className="fas fa-spinner fa-spin"></i>}
          {authMode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
        <button className="modal-btn-cancel w-full mt-2.5" onClick={closeAuthModal} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </div>
  );
}
