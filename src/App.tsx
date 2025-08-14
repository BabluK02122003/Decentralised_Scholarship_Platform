import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';


import LandingPage from './components/LandingPage';
import ProviderLogin from './components/ProviderLogin';
import ProviderRequirements from './components/ProviderRequirements';
import ApplicantLogin from './components/ApplicantLogin';
import ApplicantDashboard from './components/ApplicantDashboard';
import ActiveScholarships from './components/ActiveScholarships';
import ScholarshipApplication from './components/ScholarshipApplication';
import AppliedScholarships from './components/AppliedScholarships';

import './App.css';

function App() {
  return (
    <AptosWalletAdapterProvider>
      <WalletProvider>
        <Router>
          <div className="App">
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
              <WalletSelector />
            </div>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/provider/login" element={<ProviderLogin />} />
              <Route path="/provider/requirements" element={<ProviderRequirements />} />
              <Route path="/applicant/login" element={<ApplicantLogin />} />
              <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
              <Route path="/scholarships/active" element={<ActiveScholarships />} />
              <Route path="/scholarship/apply/:id" element={<ScholarshipApplication />} />
              <Route path="/scholarships/applied" element={<AppliedScholarships />} />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </AptosWalletAdapterProvider>
  );
}

export default App;
