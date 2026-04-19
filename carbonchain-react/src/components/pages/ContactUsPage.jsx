import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactUsPage() {

  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_origin",          // your service id
      "template_origin",        // 🔥 replace this
      formRef.current,
      "OLKLZVHgL3BXC5qlh"          // 🔥 replace this
    )
      .then(() => {
        alert('Message sent successfully!');
      })
      .catch((error) => {
        console.log(error);
        alert('Failed to send message');
      });
  };
  return (
    <div className="min-h-screen pt-[84px] pb-[60px] animate-fadeIn max-w-[800px] mx-auto px-5">
      <div className="text-center pt-10 pb-8">
        <h1
          className="text-[clamp(2.2rem,5vw,3rem)] font-black leading-[1.1] mb-5"
          style={{
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Contact Us
        </h1>
        <p className="text-[1.1rem] text-cc-muted2 leading-[1.7] max-w-[600px] mx-auto">
          Have questions about our carbon offsets, partnerships, or need technical support? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-cc-card border border-cc-border rounded-2xl p-8 my-8 shadow-lg">
        <form ref={formRef} className="space-y-6" onSubmit={sendEmail}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="user_name" type="text" className="form-input" placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="user_email" type="email" className="form-input" placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select name="subject" className="form-select" required>
              <option value="">Select a topic...</option>
              <option value="support">Technical Support</option>
              <option value="partnership">Partnerships</option>
              <option value="feedback">General Feedback</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea name="message" className="form-input min-h-[120px] resize-y" placeholder="How can we help you?" required></textarea>
          </div>
          <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            Send Message <i className="fas fa-paper-plane text-[0.9rem]"></i>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        <div className="bg-cc-card2 border border-cc-border2 rounded-xl p-5 text-center">
          <div className="text-[1.5rem] text-cc-blue mb-3"><i className="fas fa-envelope"></i></div>
          <div className="font-bold mb-1">Email Us</div>
          <div className="text-[0.75rem] text-cc-muted2 break-all">support.carbonfootprinting@gmail.com</div>
        </div>
        <div className="bg-cc-card2 border border-cc-border2 rounded-xl p-5 text-center">
          <div className="text-[1.5rem] text-cc-green mb-3"><i className="fab fa-twitter"></i></div>
          <div className="font-bold mb-1">Follow Us</div>
          <div className="text-[0.8rem] text-cc-muted2">@OriginCarbon</div>
        </div>
        <div className="bg-cc-card2 border border-cc-border2 rounded-xl p-5 text-center">
          <div className="text-[1.5rem] text-cc-purple mb-3"><i className="fas fa-map-marker-alt"></i></div>
          <div className="font-bold mb-1">HQ</div>
          <div className="text-[0.8rem] text-cc-muted2 leading-relaxed">T-Hub Phase 2, Kavuri Hills, Madhapur, Hyderabad, Telangana</div>
        </div>
      </div>
    </div>
  );
}
