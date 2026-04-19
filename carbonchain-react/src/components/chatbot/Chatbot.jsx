import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAppState } from '../../hooks/useAppState';
import { KB } from '../../constants/chatbot';
import { PROJECTS } from '../../constants/projects';

export default function Chatbot() {
  const { chatOpen, setChatOpen } = useAppState();
  
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const msgsEndRef = useRef(null);

  useEffect(() => {
    // Show badge after 4 seconds if not open
    const timer = setTimeout(() => {
      if (!chatOpen) setShowBadge(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [chatOpen]);

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ sender: 'bot', text: `👋 Hi! I'm <b>CarbonBot</b>!<br><br>Ask me about:<br>• 📅 Monthly carbon kg spending<br>• 🛒 Buying credits + MetaMask help<br>• 📊 Transactions & Dashboard<br>• 🌍 What is carbon footprint?` }]);
      }, 300);
    }
  }, [chatOpen, messages.length]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen) setShowBadge(false);
  };

  const queryGroqAI = async (message) => {
    try {
      const kbData = KB.map(k => k.answer.replace(/<[^>]*>?/gm, '')).join(' | ');
      const projectData = PROJECTS.map(p => `${p.name} (${p.co2}): ${p.priceEth} ETH`).join(', ');

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are CarbonBot, an AI assistant for the Origin Carbon Tracking and Marketplace platform. 
              Always use the following training data to answer questions accurately:
              
              SITE RULES & KNOWLEDGE: ${kbData}
              
              AVAILABLE PROJECTS AND PRICING: ${projectData}
              
              INSTRUCTIONS:
              - Use this data to answer questions directly. Do not make up prices or rules.
              - Be concise, professional, and friendly with emojis.
              - You must format text with basic HTML like <b>bold</b> and <br> for line breaks. Never use markdown (\`\`\`). Keep responses short.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.3, // Lower temp for more factual adherence
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content.replace(/\n/g, '<br>');
    } catch (error) {
      console.error('Groq API Error:', error);
      return 'I am currently having trouble connecting to my AI brain. Please try again later or ask me a simpler question!';
    }
  };

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    setInputVal('');
    
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);
    
    // Call the powerful LLM!
    const aiResponse = await queryGroqAI(userText);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
  };

  const handleQuickAsk = async (q) => {
    if (!chatOpen) {
      setChatOpen(true);
      setShowBadge(false);
    }
    
    setTimeout(async () => {
      setMessages(prev => [...prev, { sender: 'user', text: q }]);
      setIsTyping(true);
      
      const aiResponse = await queryGroqAI(q);
      
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
    }, 500);
  };

  return (
    <>
      <button 
        className="fixed bottom-7 right-7 z-[4000] w-[58px] h-[58px] rounded-full bg-gradient-to-br from-cc-green to-cc-emerald border-none cursor-pointer shadow-[0_8px_24px_rgba(34,197,94,0.4)] flex items-center justify-center text-[1.5rem] transition-all hover:scale-110 hover:shadow-[0_12px_32px_rgba(34,197,94,0.5)]" 
        onClick={toggleChat} 
        title="Ask Carbon Assistant"
      >
        🌿
        {showBadge && <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-cc-red text-[0.65rem] font-bold flex items-center justify-center text-white">1</span>}
      </button>

      <div className={`fixed bottom-[100px] right-4 sm:right-7 w-[calc(100vw-32px)] sm:w-[370px] max-h-[600px] bg-cc-card border border-cc-border2 rounded-[20px] flex flex-col overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)] origin-bottom-right z-[4000] transition-all ${chatOpen ? 'animate-chatIn' : 'hidden'}`}>
        <div className="p-4 bg-gradient-to-br from-cc-green/15 to-cc-emerald/10 border-b border-cc-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cc-green to-cc-teal flex items-center justify-center text-[1.2rem] shrink-0">🤖</div>
          <div>
            <div className="text-[0.95rem] font-bold">CarbonBot</div>
            <div className="text-[0.72rem] text-cc-green flex items-center gap-1">
              <span className="w-[7px] h-[7px] rounded-full bg-cc-green inline-block"></span> Online — Always here to help
            </div>
          </div>
          <button className="ml-auto bg-transparent border-none text-cc-muted2 text-[1.1rem] cursor-pointer transition-all hover:text-cc-text" onClick={toggleChat}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth chatbot-msgs">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 max-w-[92%] ${m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[0.85rem] mt-0.5 ${m.sender === 'user' ? 'bg-cc-green/20' : 'bg-cc-green/10'}`}>
                {m.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`py-2.5 px-3.5 rounded-2xl text-[0.83rem] leading-[1.55] break-words ${m.sender === 'user' ? 'bg-gradient-to-br from-cc-green to-cc-emerald text-white rounded-br-sm' : 'bg-cc-card2 border border-cc-border text-cc-text rounded-bl-sm'}`} dangerouslySetInnerHTML={{ __html: m.text }} />
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 max-w-[92%] self-start">
              <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[0.85rem] mt-0.5 bg-cc-green/10">🤖</div>
              <div className="py-2.5 px-3.5 rounded-2xl text-[0.83rem] break-words bg-cc-card2 border border-cc-border text-cc-text rounded-bl-sm">
                <div className="flex gap-1 items-center py-1 animate-tdot">
                  <span className="w-[7px] h-[7px] rounded-full bg-cc-muted2 animate-[tdot_1.2s_infinite]"></span>
                  <span className="w-[7px] h-[7px] rounded-full bg-cc-muted2 animate-[tdot_1.2s_infinite_0.2s]"></span>
                  <span className="w-[7px] h-[7px] rounded-full bg-cc-muted2 animate-[tdot_1.2s_infinite_0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={msgsEndRef} />
        </div>

        {messages.length < 3 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-3">
            <button className="py-1 px-3 rounded-full border border-cc-border2 bg-cc-card2 text-cc-muted2 text-[0.72rem] cursor-pointer transition-all hover:border-cc-green hover:text-cc-green whitespace-nowrap" onClick={() => handleQuickAsk('How to spend monthly carbon kg?')}>Monthly carbon kg?</button>
            <button className="py-1 px-3 rounded-full border border-cc-border2 bg-cc-card2 text-cc-muted2 text-[0.72rem] cursor-pointer transition-all hover:border-cc-green hover:text-cc-green whitespace-nowrap" onClick={() => handleQuickAsk('How to buy credits?')}>Buy credits</button>
            <button className="py-1 px-3 rounded-full border border-cc-border2 bg-cc-card2 text-cc-muted2 text-[0.72rem] cursor-pointer transition-all hover:border-cc-green hover:text-cc-green whitespace-nowrap" onClick={() => handleQuickAsk('What is carbon footprint?')}>CO₂ footprint?</button>
          </div>
        )}

        <div className="p-3 bg-cc-card border-t border-cc-border flex gap-2">
          <input 
            className="flex-1 py-2.5 px-3.5 bg-cc-card2 border border-cc-border2 rounded-full text-cc-text text-[0.85rem] outline-none transition-all focus:border-cc-green"
            style={{ fontFamily: 'inherit' }}
            placeholder="Ask me anything..." 
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-cc-green to-cc-emerald border-none cursor-pointer flex items-center justify-center text-[0.95rem] text-white shrink-0 transition-all hover:scale-110"
            onClick={handleSend}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
