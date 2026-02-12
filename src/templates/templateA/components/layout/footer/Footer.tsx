'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FooterProps {
  siteName?: string;
}

export default function Footer({ siteName = 'Site' }: FooterProps) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.hostname);
    }
  }, []);

  return (
    <footer className="mt-5 mb-5 px-3">
      <div className="container">
        <div className="divider" />
        <div className="row">
          <div className="col-md-6 copyright text-xs-center">
            <div>
              © {new Date().getFullYear()} {siteName}. Designed by{' '}
              {domain ? (
                <a href={typeof window !== 'undefined' ? window.location.origin : '#'}>{domain}</a>
              ) : (
                <span>this site</span>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <ul className="social-network inline text-md-end text-sm-center">
              <li className="list-inline-item">
                <Link href="#">
                  <i className="icon-facebook" />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link href="#">
                  <i className="icon-behance" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
