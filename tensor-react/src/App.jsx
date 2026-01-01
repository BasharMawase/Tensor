import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import RegionModal from './components/RegionModal';
import Footer from './components/Footer';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import Admin from './pages/Admin';
import Booking from './pages/Booking';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="App">
            <div className="bg-grid"></div>
            <div className="bg-glow"></div>

            <Header />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/booking" element={<Booking />} />
            </Routes>

            <Footer />
            <RegionModal />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
