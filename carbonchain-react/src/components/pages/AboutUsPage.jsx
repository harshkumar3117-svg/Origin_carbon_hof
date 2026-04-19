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
          About Carbon Footprinting
        </h1>
        <p className="text-[1.1rem] text-cc-muted2 leading-[1.7] max-w-[700px] mx-auto">
          Our goal is to provide accessible tools for tracking and understanding carbon emissions. By combining data-driven analysis with verified records, we aim to bridge the gap between complex climate data and actionable change.
        </p>
      </div>

      <div className="bg-cc-card border border-cc-border rounded-2xl p-8 my-8 shadow-lg">
        <h2 className="text-[1.5rem] font-extrabold mb-4 text-cc-text">The Intent</h2>
        <p className="text-[1rem] text-cc-muted2 leading-[1.8] mb-6">
          Environmental responsibility starts with clear, honest information. Carbon footprinting shouldn't be a complex hurdle or a PR statement; it should be a straightforward part of how we manage our impact on the planet. This platform was built to simplify the measurement process and provide a practical path toward reduction and offsetting.
        </p>

        <h2 className="text-[1.5rem] font-extrabold mb-4 text-cc-text">A Practical Approach</h2>
        <p className="text-[1rem] text-cc-muted2 leading-[1.8] mb-6">
          By utilizing blockchain technology for tokenized credits, we focus on ensuring that every transaction is recorded transparently. It’s not about revolutionary technology for its own sake, but about using the right tools to prevent double-counting and ensure that your offsets actually count.
        </p>

        <h2 className="text-[1.5rem] font-extrabold mb-4 text-cc-text">Our Team</h2>
        <p className="text-[1rem] text-cc-muted2 leading-[1.8]">
          We are a small group of developers and environmental advocates working to make carbon management more accessible. Our focus is on building functional tools that help people and businesses take small, measurable steps toward a lower-carbon future.
        </p>
      </div>
    </div>
  );
}
