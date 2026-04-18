import React from 'react';
import { useAppState } from './hooks/useAppState';

import Navbar from './components/Navbar';
import AlertBox from './components/AlertBox';
import BuyModal from './components/modals/BuyModal';
import AuthModal from './components/modals/AuthModal';
import Chatbot from './components/chatbot/Chatbot';

import HomePage from './components/pages/HomePage';
import CalculatorPage from './components/pages/CalculatorPage';
import MarketplacePage from './components/pages/MarketplacePage';
import DashboardPage from './components/pages/DashboardPage';
import AboutUsPage from './components/pages/AboutUsPage';
import ContactUsPage from './components/pages/ContactUsPage';

export default function App() {
  const { currentPage } = useAppState();

  return (
    <>
      <Navbar />
      <AlertBox />

      {currentPage === 'home' && <HomePage />}
      {currentPage === 'calculator' && <CalculatorPage />}
      {currentPage === 'marketplace' && <MarketplacePage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'about' && <AboutUsPage />}
      {currentPage === 'contact' && <ContactUsPage />}

      <BuyModal />
      <AuthModal />
      <Chatbot />
    </>
  );
}
