import React from 'react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen pt-[84px] pb-[60px] animate-fadeIn max-w-[900px] mx-auto px-5">
      <div className="text-center pt-10 pb-8">
        <h1 
          className="text-[clamp(2.2rem,5vw,3rem)] font-black leading-[1.1] mb-5"
          style={{
            background: 'linear-gradient(135deg, var(--green) 0%, var(--teal) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          About Origin Carbon
        </h1>
        <p className="text-[1.1rem] text-cc-muted2 leading-[1.7] max-w-[700px] mx-auto">
          We are on a mission to bring transparency and efficiency to the global carbon market by leveraging Ethereum blockchain technology and Machine Learning.
        </p>
      </div>

      <div className="bg-cc-card border border-cc-border rounded-2xl p-8 my-8 shadow-lg">
        <h2 className="text-[1.5rem] font-extrabold mb-4 text-cc-text">Our Vision</h2>
        <p className="text-[1rem] text-cc-muted2 leading-[1.8] mb-6">
          Origin Carbon was born out of a simple idea: that everyone should have the power to accurately measure and completely offset their carbon footprint in a trustworthy way. Traditional carbon markets limit participation and lack transparency. We are changing that.
        </p>
        
        <h2 className="text-[1.5rem] font-extrabold mb-4 text-cc-text">Why Blockchain?</h2>
        <p className="text-[1rem] text-cc-muted2 leading-[1.8] mb-6">
          By tokenizing carbon credits as ERC-20 assets on the Ethereum blockchain, we ensure that every ton of CO₂ offset is verifiable, immutable, and immune to double-counting.
        </p>
        
        <h2 className="text-[1.5rem] font-extrabold mb-4 text-cc-text">The Team</h2>
        <p className="text-[1rem] text-cc-muted2 leading-[1.8]">
          We are a team of environmentalists, blockchain engineers, and data scientists dedicated to fighting climate change.
        </p>
      </div>
    </div>
  );
}
