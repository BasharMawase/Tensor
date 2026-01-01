import React from 'react';

const Footer = () => {
    return (
        <footer id="contact">
            <div className="footer-logo">TENSOR</div>
            <div className="footer-links">
                <a href="#">Research</a>
                <a href="#">Alumni</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
            </div>
            <div className="visitor-counter">
                <span className="visitor-icon">👁️</span>
                <span>TOTAL VISITORS: </span>
                <span className="visitor-number">Loading...</span>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.6 }}>
                © 2026 Tensor International Math Institute. All Rights Reserved.
            </p>
        </footer>
    );
};

export default Footer;
