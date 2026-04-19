import React, { useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAppState } from '../../hooks/useAppState';
import CompanyForm from '../calculator/CompanyForm';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CalculatorPage() {
  const { userType, navigateTo, showAlert, user, setAllowableOffset, setOffsettingBlocked, setPurchaseCompleted } = useAppState();
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null until calculated
  
  const [chartData, setChartData] = useState({
    labels: ['Energy', 'Transport', 'Food', 'Shopping'],
    datasets: [{
      data: [30, 40, 20, 10],
      backgroundColor: ['rgba(234,179,8,.8)', 'rgba(59,130,246,.8)', 'rgba(34,197,94,.8)', 'rgba(168,85,247,.8)'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  });

  const [recos, setRecos] = useState([]);

  const animateNumber = (from, to, duration, setter) => {
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1-t, 3);
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      setter(Math.round(from + (to - from) * easeOut(p)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const calculateCarbon = async () => {
    setLoading(true);
    setResult(null);

    const payload = formRef.current.getPayload();
    const apiUrl = 'http://localhost:5001/predict';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.status === 'success') {
        const mlTotal = Math.round(data.carbon_emission);
        displayResults(mlTotal);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err) {
      console.error('ML Server error:', err);
      const port = 5001;
      const folder = 'company-data';
      setResult({ error: true, port, folder });
      showAlert(`❌ ML server not reachable on port ${port}. Start ${folder}/server.py`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const displayResults = (mlTotal) => {
    const energy = Math.round(mlTotal * 0.35);
    const transport = Math.round(mlTotal * 0.40);
    const food = Math.round(mlTotal * 0.15);
    const other = mlTotal - energy - transport - food;

    // Fixed Limit explicitly defined beforehand
    const govtLimit = user?.govtLimit || 50;
    
    const maxTotal = govtLimit * 1.5;
    const pct = Math.min((mlTotal / maxTotal) * 100, 100);

    const excess = mlTotal - govtLimit;
    const blockThreshold = govtLimit * 1.1; // Strict +10% 

    let isBlocked = false;
    let allowedCredits = mlTotal; // Up to their total footprint

    if (mlTotal > blockThreshold) {
       isBlocked = true;
       allowedCredits = 0; // Strict blocking
    }
    
    // Globally enforce logic 
    setOffsettingBlocked(isBlocked);
    setAllowableOffset(allowedCredits);
    setPurchaseCompleted(false);

    let color, level, compare;
    if (excess <= 0) { color = '#22c55e'; level = 'Compliant'; compare = `Well within ${govtLimit.toLocaleString()} kg Limit`; }
    else if (!isBlocked) { color = '#eab308'; level = 'Warning Margin Active'; compare = `Exceeds limits by less than 10%. Purchasing Authorized.`; }
    else { color = '#ef4444'; level = 'REGULATORY BREACH'; compare = 'Over 10% limit tolerance. Mandated physical reduction required.'; }

    setChartData({
      labels: ['Energy', 'Transport', 'Food', 'Shopping'],
      datasets: [{
        data: [energy, transport, food, other],
        backgroundColor: ['rgba(234,179,8,.8)', 'rgba(59,130,246,.8)', 'rgba(34,197,94,.8)', 'rgba(168,85,247,.8)'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    });

    const newRecos = [];
    if (energy > (govtLimit * 0.3)) {
      newRecos.push({
        icon: '⚡',
        title: 'Industrial Energy Audit',
        text: 'Optimize HVAC systems and switch to industrial solar panels.',
        impact: 'High Impact', saving: Math.max(1, Math.round(energy * 0.25))
      });
    }
    if (transport > (govtLimit * 0.4)) {
      newRecos.push({
        icon: '🚗',
        title: 'Fleet Electrification',
        text: 'Transition company vehicles to electric to cut fleet emissions by 60%.',
        impact: 'Critical', saving: Math.max(1, Math.round(transport * 0.40))
      });
    }
    if (food > (govtLimit * 0.1)) {
      newRecos.push({
        icon: '🥗',
        title: 'Sustainable Catering',
        text: 'Offer more vegetarian options in the company canteen.',
        impact: 'Medium Impact', saving: Math.max(1, Math.round(food * 0.35))
      });
    }
    if (newRecos.length === 0) {
      newRecos.push({
        icon: '🌱', title: 'Maintain Low Footprint',
        text: 'You are completely compliant with government regulations!',
        impact: 'Efficiency', saving: mlTotal
      });
    }

    setResult({
      total: mlTotal,
      animatedTotal: 0,
      breakdown: { energy, transport, food, other },
      color, level, compare, pct,
      credits: allowedCredits,
      govtLimit,
      isBlocked, 
      excess
    });
    setRecos(newRecos);

    setTimeout(() => {
      animateNumber(0, mlTotal, 1200, (val) => {
        setResult(prev => ({ ...prev, animatedTotal: val }));
      });
    }, 50);
  };

  return (
    <div className="min-h-screen pt-[84px] pb-[60px] animate-fadeIn">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="pt-[30px] pb-5">
          <div className="text-[1.8rem] font-extrabold mb-1.5">
            🏢 Company Carbon Calculator
          </div>
          <div className="text-[0.9rem] text-cc-muted2">
            Professional ML tool for business emission tracking
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <div className="flex justify-between items-end mb-4 border-b border-cc-border pb-3">
              <div>
                <div className="text-[0.8rem] text-cc-muted2 font-semibold">Active Regulatory Entity Tracker</div>
                <div className="text-[1.1rem] font-bold text-white">{user?.name || 'Demo Corp'}</div>
              </div>
              <div className="text-right bg-cc-card2 py-1.5 px-3 rounded-lg border border-cc-border2">
                <div className="text-[0.65rem] text-cc-muted2 uppercase tracking-wide">Govt Mandatory Limit</div>
                <div className="text-[0.95rem] font-extrabold text-cc-teal tracking-tight">{(user?.govtLimit || 50).toLocaleString()} kg</div>
              </div>
            </div>

            <CompanyForm ref={formRef} />
            <button className="calc-btn mb-10 w-full" onClick={calculateCarbon}>
              <i className="fas fa-magic"></i> Calculate Company Footprint
            </button>
          </div>

          <div>
            {result && !result.error && (
              <div className="bg-cc-card border border-cc-border rounded-[18px] p-6 mb-4 animate-fadeIn">
                <h3 className="text-[0.95rem] font-bold mb-[18px] flex items-center gap-2"><span className="text-cc-teal">📊</span> Emission Breakdown</h3>
                <div className="relative h-[200px] mt-4">
                  <Doughnut data={chartData} options={{ maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } } } }} />
                </div>
              </div>
            )}

            <div className="bg-cc-card2 border border-cc-border2 rounded-[14px] p-5 mt-5">
              {!result && !loading && (
                <div className="text-center text-cc-muted2 text-[0.88rem] py-5">
                  <i className="fas fa-calculator text-[2.5rem] mb-2.5 block text-cc-muted"></i>
                  Fill in the form and click Calculate to see your carbon footprint
                </div>
              )}

              {loading && (
                <div className="text-center py-5">
                  <div className="w-[52px] h-[52px] border-4 border-cc-border border-t-cc-green rounded-full animate-spin-fast mx-auto mb-4"></div>
                  <p>Calculating with ML model...</p>
                </div>
              )}

              {result?.error && (
                <div className="text-center text-cc-muted2 text-[0.82rem] leading-[1.7] py-5">
                  <i className="fas fa-exclamation-triangle text-[2.5rem] mb-3 block text-cc-red"></i>
                  <div className="font-bold mb-2 text-cc-red">ML Server Not Running</div>
                  <div>
                    Please start the <b>{result.folder}/server.py</b> Flask server on port <b>{result.port}</b>.<br/>
                    <code className="text-[0.78rem] bg-cc-card py-1 px-2 rounded-md inline-block mt-2">
                      cd {result.folder} && python server.py
                    </code>
                  </div>
                </div>
              )}

              {result && !result.error && (
                <div className="animate-fadeIn">
                  <div className="text-center mb-2 text-[0.85rem] text-cc-muted2">Your Annual Carbon Footprint</div>
                  <div className="text-[3rem] font-black text-center my-2.5" style={{ color: result.color }}>{result.animatedTotal.toLocaleString()}</div>
                  <div className="text-[1rem] text-cc-muted2 text-center mb-5">kg CO₂ per year</div>

                  <div className="flex justify-between text-[0.78rem] text-cc-muted2 mb-1">
                    <span>0 kg</span>
                    <span style={{ color: result.color }}>Level: {result.level}</span>
                    <span>{(result.govtLimit * 1.5).toLocaleString()} kg</span>
                  </div>
                  <div className="h-3 rounded-full bg-cc-border overflow-hidden my-2.5">
                    <div className="h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${result.pct}%`, background: result.color }}></div>
                  </div>
                  <div className="text-center my-2 text-[0.85rem]">{result.compare}</div>

                  <div className="grid grid-cols-2 gap-2.5 mt-4">
                    <div className="bg-cc-card rounded-[10px] py-2.5 px-3.5 border border-cc-border2">
                      <div className="text-[0.72rem] text-cc-muted2 mb-0.5">⚡ Energy</div>
                      <div className="text-[0.95rem] font-bold text-cc-yellow">{result.breakdown.energy.toLocaleString()} kg</div>
                    </div>
                    <div className="bg-cc-card rounded-[10px] py-2.5 px-3.5 border border-cc-border2">
                      <div className="text-[0.72rem] text-cc-muted2 mb-0.5">🚗 Transport</div>
                      <div className="text-[0.95rem] font-bold text-cc-blue">{result.breakdown.transport.toLocaleString()} kg</div>
                    </div>
                    <div className="bg-cc-card rounded-[10px] py-2.5 px-3.5 border border-cc-border2">
                      <div className="text-[0.72rem] text-cc-muted2 mb-0.5">🍔 Food</div>
                      <div className="text-[0.95rem] font-bold text-cc-green">{result.breakdown.food.toLocaleString()} kg</div>
                    </div>
                    <div className="bg-cc-card rounded-[10px] py-2.5 px-3.5 border border-cc-border2">
                      <div className="text-[0.72rem] text-cc-muted2 mb-0.5">🛍️ Shopping</div>
                      <div className="text-[0.95rem] font-bold text-cc-purple">{result.breakdown.other.toLocaleString()} kg</div>
                    </div>
                  </div>

                  {result.isBlocked ? (
                    <div className="mt-5 p-4 bg-cc-red/10 border border-cc-red/30 rounded-xl text-center backdrop-blur-sm shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                      <div className="text-[0.85rem] font-black text-cc-red flex items-center justify-center gap-1.5 mb-2"><i className="fas fa-ban"></i> REGULATORY BLOCK MANDATED</div>
                      <div className="text-[0.8rem] text-cc-muted2 leading-[1.6]">You exceeded the strict 10% tolerance margin above your <strong className="text-white">{result.govtLimit.toLocaleString()} kg</strong> limit. Offsetting is disallowed. You must physically reduce emissions immediately.</div>
                    </div>
                  ) : result.excess > 0 ? (
                    <div className="mt-5 p-4 bg-cc-yellow/10 border border-cc-yellow/30 rounded-xl text-center shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                      <div className="text-[0.8rem] text-cc-muted2 mb-1">Excess Emissions (<span className="text-cc-yellow font-bold">10% Margin Active</span>)</div>
                      <div className="text-[1.5rem] font-extrabold text-cc-yellow mt-1">Authorized for Purchasing</div>
                      <div className="text-[0.78rem] text-cc-muted2 mt-1.5 leading-[1.5]">You are authorized to purchase up to <strong>{result.credits.toLocaleString()}</strong> offset credits to bring your metrics back under the mandated limit.</div>
                      <button className="mt-3 pt-[10px] pb-[10px] px-6 w-full bg-cc-yellow/10 border border-cc-yellow hover:bg-cc-yellow hover:text-black rounded-lg text-cc-yellow font-bold cursor-pointer text-[0.85rem] transition-colors" onClick={() => navigateTo('marketplace')}>
                        Purchase Offsets →
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 p-4 bg-cc-green/10 border border-cc-green/30 rounded-xl text-center shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                      <div className="text-[0.8rem] text-cc-muted2 mb-1">Status: <span className="font-bold text-cc-green tracking-tight">Fully Compliant 🌿</span></div>
                      <div className="text-[1.5rem] font-extrabold text-cc-green mt-1">Authorized for Purchasing</div>
                      <div className="text-[0.78rem] text-cc-muted2 mt-1.5 leading-[1.5]">You are <strong className="text-white">{(result.govtLimit - result.total).toLocaleString()} kg</strong> under your govt limit. You are completely authorized to voluntarily purchase up to <strong>{result.credits.toLocaleString()}</strong> offset credits to formally reach Net Zero!</div>
                      <button className="mt-3 pt-[10px] pb-[10px] px-6 w-full bg-cc-green/10 border border-cc-green hover:bg-cc-green hover:text-black rounded-lg text-cc-green font-bold cursor-pointer text-[0.85rem] transition-colors" onClick={() => navigateTo('marketplace')}>
                        Purchase Voluntary Offsets →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>


          </div>
        </div>

        {result && !result.error && (
          <div className="bg-cc-card border border-cc-border rounded-[20px] p-6 mt-6 animate-slideUp">
            <div className="text-[1.1rem] font-bold mb-4 text-cc-green"><i className="fas fa-lightbulb"></i> Personalized Recommendations</div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              {recos.map((r, i) => (
                <div key={i} className="bg-cc-card2 border border-cc-border rounded-xl p-4 flex gap-3.5 items-center">
                  <div className="w-[42px] h-[42px] rounded-full bg-cc-green/10 flex items-center justify-center text-[1.2rem] shrink-0">{r.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-[0.9rem]">{r.title}</div>
                      <span className="text-[0.7rem] py-0.5 px-2 rounded-full bg-cc-green/10 text-cc-green font-semibold">{r.impact}</span>
                    </div>
                    <div className="text-[0.8rem] text-cc-muted2 leading-[1.4]">{r.text}</div>
                    <div className="text-cc-green text-[0.78rem] mt-1 font-semibold">💚 Potential Save: {r.saving.toLocaleString()} kg/year</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
