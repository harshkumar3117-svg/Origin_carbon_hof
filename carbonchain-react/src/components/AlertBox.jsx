import React from 'react';
import { useAppState } from '../hooks/useAppState';

export default function AlertBox() {
  const { alert } = useAppState();

  if (!alert.show) return null;

  let bgClass = '';
  let borderClass = '';
  let textClass = '';

  if (alert.type === 'success') {
    bgClass = 'bg-[#1a3a27]';
    borderClass = 'border-cc-green';
    textClass = 'text-cc-green';
  } else if (alert.type === 'error') {
    bgClass = 'bg-[#3a1a1a]';
    borderClass = 'border-cc-red';
    textClass = 'text-cc-red';
  } else {
    bgClass = 'bg-[#1a2a3a]';
    borderClass = 'border-cc-blue';
    textClass = 'text-cc-blue';
  }

  return (
    <div className={`fixed top-[76px] right-5 z-[3000] px-5 py-3.5 rounded-xl text-[0.85rem] font-semibold max-w-[340px] animate-slideIn border ${bgClass} ${borderClass} ${textClass}`}>
      {/* react dangerouslySetInnerHTML since some alerts use HTML */}
      <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
    </div>
  );
}
