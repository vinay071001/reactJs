import React from 'react';
import '../assets/css/app.scss';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';

export default function Layout({ children }) {
  return (
    <div className="page-data-wrap-seprator">
      <Header />
      <>{children}</>
      <div className="page-footer-wrap" id="contact">
        <Footer />
      </div>
    </div>
  );
}