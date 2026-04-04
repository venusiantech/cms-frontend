'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
interface FooterProps {
  siteName?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  onContactClick?: () => void; // Optional contact click handler
}

export default function Footer({ siteName = 'Site', instagramUrl, facebookUrl, twitterUrl, contactEmail, contactPhone, onContactClick }: FooterProps) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.hostname);
    }
  }, []);

  const hasContact = contactEmail || contactPhone;
  const hasSocial = instagramUrl || facebookUrl || twitterUrl;
  
  // Calculate grid columns
  let colClass = 'col-lg-4'; // Base: Brand, Quick Links, Categories
  if (hasContact && hasSocial) {
    colClass = 'col-lg-2'; // 5 columns
  } else if (hasContact || hasSocial) {
    colClass = 'col-lg-3'; // 4 columns
  }

  return (
    <footer className="mt-5 pt-5 pb-4 footer-section">
      <div className="container">
        <div className="divider" />
        {/* Main Footer Content */}
        <div className={`row g-4 mb-4`}>
          {/* Brand/Logo Section */}
          <div className={`${colClass} col-md-6`}>
            <p className="logo navbar-brand mb-3 text-[1.8rem]">
              <Link href="/" className="logo text-decoration-none">
                {siteName}
              </Link>
            </p>
          </div>

          {/* Quick Links */}
          <div className={`${colClass} col-md-6`}>
            <h5 className="footer-heading mb-3 font-bold text-[1.1rem]">
              Quick Links
            </h5>
            <ul className="list-unstyled footer-links text-sm">
              <li className="mb-2">
                <a href="/" className="text-muted text-decoration-none transition-colors duration-200">
                  Home
                </a>
              </li>
              {onContactClick && (
                <li className="mb-2">
                  <a 
                    onClick={onContactClick} 
                    className="text-muted text-decoration-none transition-colors duration-200 bg-transparent border-0 p-0 cursor-pointer"
                  >
                    Contact Us
                  </a>
                </li>
              )}
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className={`${colClass} col-md-6`}>
            <h5 className="footer-heading mb-3 font-bold text-[1.1rem]">
              Categories
            </h5>
            <ul className="list-unstyled footer-links text-sm">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none transition-colors duration-200">
                  Articles
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none transition-colors duration-200">
                  News
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none transition-colors duration-200">
                  Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information - Only show if exists */}
          {hasContact && (
            <div className={`${colClass} col-md-6`}>
              <h5 className="footer-heading mb-3 font-bold text-[1.1rem]">
                Contact
              </h5>
              <ul className="list-unstyled footer-links footer-contact-links text-sm">
                {contactEmail && (
                  <li className="mb-2">
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="text-muted text-decoration-none d-flex align-items-center contact-link transition-colors duration-200" 
                    >
                      <FaEnvelope className="me-2 contact-icon text-base" />
                      <span className="contact-text">{contactEmail}</span>
                    </a>
                  </li>
                )}
                {contactPhone && (
                  <li className="mb-2">
                    <a 
                      href={`tel:${contactPhone}`}
                      className="text-muted text-decoration-none d-flex align-items-center contact-link transition-colors duration-200" 
                    >
                      <FaPhoneAlt className="me-2 contact-icon text-base" />
                      <span className="contact-text">{contactPhone}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Follow Us / Social Media - Only show if at least one social link exists */}
          {hasSocial && (
            <div className={`${colClass} col-md-6`}>
              <h5 className="footer-heading mb-3 font-bold text-[1.1rem]">
                Follow Us
              </h5>
              <p className="text-muted footer-description mb-3 text-sm">
                Stay connected with our latest updates
              </p>
              <ul className="social-network list-inline mb-0">
                {facebookUrl && (
                  <li className="list-inline-item me-2">
                    <a 
                      href={facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center w-10 h-10 rounded-full bg-[#e9ecef] transition-all duration-300 no-underline"
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#3b5998';
                        e.currentTarget.querySelector('i')!.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.querySelector('i')!.style.color = '#6c757d';
                      }}
                    >
                      <i className="icon-facebook text-[1.2rem] text-[#6c757d] transition-colors duration-300" />
                    </a>
                  </li>
                )}
                {twitterUrl && (
                  <li className="list-inline-item me-2">
                    <a 
                      href={twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center w-10 h-10 rounded-full bg-[#e9ecef] transition-all duration-300 no-underline"
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#1da1f2';
                        e.currentTarget.querySelector('i')!.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.querySelector('i')!.style.color = '#6c757d';
                      }}
                    >
                      <i className="icon-twitter text-[1.2rem] text-[#6c757d] transition-colors duration-300" />
                    </a>
                  </li>
                )}
                {instagramUrl && (
                  <li className="list-inline-item me-2">
                    <a 
                      href={instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center w-10 h-10 rounded-full bg-[#e9ecef] transition-all duration-300 no-underline"
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#e4405f';
                        e.currentTarget.querySelector('i')!.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.querySelector('i')!.style.color = '#6c757d';
                      }}
                    >
                      <i className="icon-instagram text-[1.2rem] text-[#6c757d] transition-colors duration-300" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className=" mb-3" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted copyright-text text-[0.85rem]">
              © {new Date().getFullYear()} {siteName}. Designed by{' '}
              {domain ? (
                <a 
                  href={typeof window !== 'undefined' ? window.location.origin : '#'}
                  className="text-decoration-none copyright-link text-[#6c757d] transition-colors duration-200"
                >
                  {domain}
                </a>
              ) : (
                <span>this site</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Light mode styles */
        .footer-links a:hover {
          color: #000 !important;
          padding-left: 5px;
        }
        .footer-heading {
          color: #212529;
        }
        .copyright-link:hover {
          color: #000 !important;
        }
        
        /* Dark mode styles */
        :global(.dark-mode) .footer-heading {
          color: #f8f9fa !important;
        }
        :global(.dark-mode) .footer-links a {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        :global(.dark-mode) .footer-links a:hover {
          color: #ffffff !important;
        }
        :global(.dark-mode) .footer-description,
        :global(.dark-mode) .text-muted {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        :global(.dark-mode) .copyright-text {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        :global(.dark-mode) .copyright-link {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        :global(.dark-mode) .copyright-link:hover {
          color: #ffffff !important;
        }
        
        /* Contact links dark mode - explicit styling */
        :global(.dark-mode) .footer-contact-links .contact-link {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        :global(.dark-mode) .footer-contact-links .contact-icon {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        :global(.dark-mode) .footer-contact-links .contact-text {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        :global(.dark-mode) .footer-contact-links .contact-link:hover {
          color: #ffffff !important;
        }
        :global(.dark-mode) .footer-contact-links .contact-link:hover .contact-icon,
        :global(.dark-mode) .footer-contact-links .contact-link:hover .contact-text {
          color: #ffffff !important;
        }
      `}</style>
    </footer>
  );
}
