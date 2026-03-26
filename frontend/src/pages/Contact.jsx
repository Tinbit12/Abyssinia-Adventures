

import React from 'react';
import ContactForm from '../components/ContactForm';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <section className="page-header section">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with us for inquiries, bookings, or any questions</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <div className="info-item">
                <h3>Email</h3>
                <p>info@abyssiniaadventures.com</p>
              </div>
              <div className="info-item">
                <h3>Phone</h3>
                <p>+251 11 123 4567</p>
              </div>
              <div className="info-item">
                <h3>Address</h3>
                <p>
                  Addis Ababa, Ethiopia<br />
                  P.O. Box 12345
                </p>
              </div>
              <div className="info-item">
                <h3>Business Hours</h3>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2>Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
