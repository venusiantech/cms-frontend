'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheck, FaEnvelope, FaPhoneAlt } from "react-icons/fa";


interface ContactSectionProps {
  domain: { name: string };
  website: any;
  onBack: () => void;
  assetsPath: string;
}

export default function ContactSection({ domain, website, onBack, assetsPath }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top when contact form opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/public/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.name,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const siteName = domain.name.split('.')[0];
  const siteDisplay = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center position-relative" style={{ minHeight: '50vh' }}>
          {/* Left Side - Domain Info */}
          <div className="col-lg-6 mb-4 mb-lg-0" style={{ 
            paddingRight: '3rem'
          }}>
            <div className="pe-lg-3">
              {/* Domain Logo/Name */}
              <h1 className="logo mb-4 contact-heading" style={{ fontSize: '3rem' }}>
                Contact Us
              </h1>
              
              {/* Description */}
              <p className="lead text-muted contact-description mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Have a question or want to get in touch? We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
              </p>

              {/* Contact Info */}
              {(website?.contactEmail || website?.contactPhone) && (
                <div className="mt-5 contact-info-section">
                  {website?.contactEmail && (
                    <div className="mb-3 d-flex align-items-center">
                      <FaEnvelope className="me-3 contact-icon" style={{ fontSize: '1.3rem' }} />
                      <a 
                        href={`mailto:${website.contactEmail}`}
                        className="text-muted contact-link"
                        style={{ textDecoration: 'none' }}
                      >
                        {website.contactEmail}
                      </a>
                    </div>
                  )}
                  {website?.contactPhone && (
                    <div className="mb-3 d-flex align-items-center">
                      <FaPhoneAlt className="me-3 contact-icon" style={{ fontSize: '1.3rem' }} />
                      <a 
                        href={`tel:${website.contactPhone}`}
                        className="text-muted contact-link"
                        style={{ textDecoration: 'none' }}
                      >
                        {website.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Vertical Divider - Only visible on desktop */}
          {/* <div 
            className="d-none d-lg-block position-absolute"
            style={{
              left: '50%',
              top: '5%',
              bottom: '5%',
              width: '1px',
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              transform: 'translateX(-50%)'
            }}
          /> */}

          {/* Right Side - Contact Form */}
          <div className="col-lg-6" style={{ paddingLeft: '3rem' }}>
            <div style={{ padding: '1rem' }}>
                {submitted ? (
                  /* Success Message */
                  <div className="text-center py-4 success-message">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#d4edda',
                        color: '#155724'
                      }}
                    >
                      <FaCheck style={{ fontSize: '2rem' }} />
                    </div>
                    <h3 className="h5 fw-bold mb-2 success-title" style={{ color: '#155724' }}>
                      Message Sent!
                    </h3>
                    <p className="text-muted mb-3 small success-text">
                      We'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn btn-success btn-sm px-4"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  /* Contact Form */
                  <form onSubmit={handleSubmit} className="contact-form">
                    <h2 className="h4 fw-bold mb-3 form-heading">Send us a message</h2>
                    
                    {/* Name Field */}
                    <div className="mb-3">
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name *"
                        style={{ 
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid #dee2e6',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Your Email *"
                        style={{ 
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid #dee2e6',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    {/* Message Field */}
                    <div className="mb-3">
                      <textarea
                        id="message"
                        className="form-control"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Your Message *"
                        style={{ 
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid #dee2e6',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-dark py-2"
                        style={{ 
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </div>
                  </form>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Dark mode styles for contact section */}
      <style jsx>{`
        /* Light mode - default color */
        :global(.contact-info-section) .contact-icon {
          color: #6c757d !important;
        }
        :global(.contact-info-section) .contact-link {
          color: #6c757d !important;
        }
        :global(.contact-info-section) .contact-link:hover {
          color: #000 !important;
        }
        
        /* Dark mode - Contact Info */
        :global(.dark-mode) :global(.contact-info-section) .contact-icon {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        :global(.dark-mode) :global(.contact-info-section) .contact-link {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        :global(.dark-mode) :global(.contact-info-section) .contact-link:hover {
          color: #ffffff !important;
        }
        
        /* Dark mode - Main Heading */
        :global(.dark-mode) .contact-heading {
          color: rgba(255, 255, 255, 0.95) !important;
        }
        
        /* Dark mode - Description Text */
        :global(.dark-mode) .contact-description {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        /* Dark mode - Form Heading */
        :global(.dark-mode) .form-heading {
          color: rgba(255, 255, 255, 0.95) !important;
        }
        
        /* Dark mode - Success Message */
        :global(.dark-mode) .success-title {
          color: #4ade80 !important;
        }
        
        :global(.dark-mode) .success-text {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        /* Dark mode - Form Inputs */
        :global(.dark-mode) :global(.contact-form) :global(.form-control) {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        :global(.dark-mode) :global(.contact-form) :global(.form-control):focus {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          color: rgba(255, 255, 255, 0.95) !important;
        }
        
        /* Dark mode - Placeholders */
        :global(.dark-mode) :global(.contact-form) :global(.form-control)::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
          opacity: 1;
        }
        
        :global(.dark-mode) :global(.contact-form) :global(.form-control)::-webkit-input-placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        
        :global(.dark-mode) :global(.contact-form) :global(.form-control)::-moz-placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        
        :global(.dark-mode) :global(.contact-form) :global(.form-control):-ms-input-placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </section>
  );
}
