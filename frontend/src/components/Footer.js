import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3">Campus Events</h5>
            <p className="text-muted">
              The ultimate platform for college event management, making it easy to discover, 
              register, and participate in campus activities.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-white fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none hover-link">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/events" className="text-muted text-decoration-none hover-link">Events</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-muted text-decoration-none hover-link">Dashboard</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none hover-link">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/faq" className="text-muted text-decoration-none hover-link">FAQ</Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-muted text-decoration-none hover-link">Privacy Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-muted text-decoration-none hover-link">Terms of Service</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none hover-link">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3">Stay Updated</h5>
            <p className="text-muted">Subscribe to our newsletter for the latest events and updates.</p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email address" 
                aria-label="Your email address" 
              />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </div>
        </div>
        
        <hr className="my-4 bg-secondary" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted">
              &copy; {currentYear} College Event Management System. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <img 
              src="https://via.placeholder.com/120x40/0d6efd/FFFFFF?text=Campus+Events" 
              alt="Campus Events Logo" 
              height="40" 
            />
          </div>
        </div>
      </div>
      
      {/* Add custom CSS for hover effect */}
      <style jsx="true">{`
        .hover-link {
          transition: color 0.3s ease;
        }
        .hover-link:hover {
          color: white !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;