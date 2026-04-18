import React from 'react';
import { useAppState } from '../../hooks/useAppState';

export default function ProfileSelectionPage() {
  const { navigateTo, authModeIntent } = useAppState();

  const initiateAuth = (type) => {
    // Open auth modal with the specified type and intent
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { type, mode: authModeIntent || 'login' } }));
  };

  return (
  <div className="min-h-screen pt-[120px] pb-[60px] animate-fadeIn">
    <div className="max-w-[800px] mx-auto px-5">
      <div className="text-center mb-10">
        <h2 className="text-[2rem] font-extrabold mb-2.5">Select Your Profile</h2>
        <p className="text-cc-muted2">Choose how you want to calculate and manage your carbon footprint</p>
      </div>
      <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_1fr] gap-[30px]">
        <div
          className="bg-cc-card2 border border-cc-border rounded-[20px] p-10 text-center transition-all duration-300 cursor-pointer hover:border-cc-green hover:-translate-y-1.25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          onClick={() => initiateAuth('individual')}
        >
          <i className="fas fa-user text-[3rem] text-cc-green mb-5 block"></i>
          <h3 className="text-[1.5rem] font-bold mb-2.5">Individual</h3>
          <p className="text-cc-muted2 text-[0.9rem]">Calculate personal emissions and offset your lifestyle. Perfect for individuals and households.</p>
        </div>
        <div
          className="bg-cc-card2 border border-cc-border rounded-[20px] p-10 text-center transition-all duration-300 cursor-pointer hover:border-cc-green hover:-translate-y-1.25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          onClick={() => initiateAuth('company')}
        >
          <i className="fas fa-building text-[3rem] text-cc-green mb-5 block"></i>
          <h3 className="text-[1.5rem] font-bold mb-2.5">Company</h3>
          <p className="text-cc-muted2 text-[0.9rem]">Advanced calculation for businesses. Track vehicle fleets, office electricity, and waste.</p>
        </div>
      </div>
    </div>
  </div>
);
}
