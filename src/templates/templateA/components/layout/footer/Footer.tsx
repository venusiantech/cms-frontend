'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FooterProps {
  siteName?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}

export default function Footer({ siteName = 'Site', instagramUrl, facebookUrl, twitterUrl }: FooterProps) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.hostname);
    }
  }, []);

  return (
    <footer className="mt-5 pt-5 pb-4">
      <div className="container">
        <div className="divider" />
        {/* Main Footer Content */}
        <div className={`row g-4 mb-4`}>
          {/* Brand/Logo Section */}
          <div className={`${(instagramUrl || facebookUrl || twitterUrl) ? 'col-lg-3' : 'col-lg-4'} col-md-6`}>
            <h1 className="logo navbar-brand mb-3" style={{ fontSize: '1.8rem' }}>
              <Link href="/" className="logo text-decoration-none">
                {siteName}
              </Link>
            </h1>
            {/* <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Your trusted source for {siteName.toLowerCase()} news and information.
            </p> */}
          </div>

          {/* Quick Links */}
          <div className={`${(instagramUrl || facebookUrl || twitterUrl) ? 'col-lg-3' : 'col-lg-4'} col-md-6`}>
            <h5 className="footer-heading mb-3" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
              Quick Links
            </h5>
            <ul className="list-unstyled footer-links" style={{ fontSize: '0.9rem' }}>
              <li className="mb-2">
                <a href="/" className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className={`${(instagramUrl || facebookUrl || twitterUrl) ? 'col-lg-3' : 'col-lg-4'} col-md-6`}>
            <h5 className="footer-heading mb-3" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
              Categories
            </h5>
            <ul className="list-unstyled footer-links" style={{ fontSize: '0.9rem' }}>
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                  Articles
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                  News
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                  Insights
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us / Social Media - Only show if at least one social link exists */}
          {(instagramUrl || facebookUrl || twitterUrl) && (
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-heading mb-3" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                Follow Us
              </h5>
              <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                Stay connected with our latest updates
              </p>
              <ul className="social-network list-inline mb-0">
                {facebookUrl && (
                  <li className="list-inline-item me-2">
                    <a 
                      href={facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        width: '40px', 
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e9ecef',
                        transition: 'all 0.3s',
                        textDecoration: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#3b5998';
                        e.currentTarget.querySelector('i')!.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.querySelector('i')!.style.color = '#6c757d';
                      }}
                    >
                      <i className="icon-facebook" style={{ fontSize: '1.2rem', color: '#6c757d', transition: 'color 0.3s' }} />
                    </a>
                  </li>
                )}
                {twitterUrl && (
                  <li className="list-inline-item me-2">
                    <a 
                      href={twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        width: '40px', 
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e9ecef',
                        transition: 'all 0.3s',
                        textDecoration: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#1da1f2';
                        e.currentTarget.querySelector('i')!.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.querySelector('i')!.style.color = '#6c757d';
                      }}
                    >
                      <i className="icon-twitter" style={{ fontSize: '1.2rem', color: '#6c757d', transition: 'color 0.3s' }} />
                    </a>
                  </li>
                )}
                {instagramUrl && (
                  <li className="list-inline-item me-2">
                    <a 
                      href={instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        width: '40px', 
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e9ecef',
                        transition: 'all 0.3s',
                        textDecoration: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#e4405f';
                        e.currentTarget.querySelector('i')!.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.querySelector('i')!.style.color = '#6c757d';
                      }}
                    >
                      <i className="icon-instagram" style={{ fontSize: '1.2rem', color: '#6c757d', transition: 'color 0.3s' }} />
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
            <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} {siteName}. Designed by{' '}
              {domain ? (
                <a 
                  href={typeof window !== 'undefined' ? window.location.origin : '#'}
                  className="text-decoration-none"
                  style={{ color: '#6c757d', transition: 'color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#000'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
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
        .footer-links a:hover {
          color: #000 !important;
          padding-left: 5px;
        }
        .footer-heading {
          color: #212529;
        }
      `}</style>
    </footer>
  );
}
