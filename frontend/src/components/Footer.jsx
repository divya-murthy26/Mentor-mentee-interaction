import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>Fund a Child</h3>
          <p>Building a brighter future for India, one student at a time.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <ul>
            <li>About Us</li>
            <li>Our Mentors</li>
            <li>Success Stories</li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li>Contact</li>
            <li>FAQ</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li>Twitter</li>
            <li>LinkedIn</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
      <div className="container copyright">
        <p>&copy; 2023 Fund a Child India. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
