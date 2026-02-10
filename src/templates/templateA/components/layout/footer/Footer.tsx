import Link from 'next/link'

interface FooterProps {
  siteName?: string;
}

function getDomain() {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.hostname;
  }
  return '';
}

export default function Footer({ siteName = 'Site' }: FooterProps) {
  const domain = typeof window !== 'undefined' ? getDomain() : '';
  return (
    <footer className="mt-5">
      <div className="container">
        <div className="divider" />
        <div className="row">
          <div className="col-md-6 copyright text-xs-center">
            <p>
              © {new Date().getFullYear()} {siteName}. Designed by {domain ? (
                <a href={typeof window !== 'undefined' ? window.location.origin : '#'}>{domain}</a>
              ) : (
                'this site'
              )}
            </p>
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
