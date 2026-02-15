'use client';

import { CheckCircle2, ExternalLink, Clock, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeploymentTabProps {
  domain: any;
}

// Helper functions (copied from parent)
const getDisplaySubdomain = (subdomain: string) => {
  return `${subdomain}.jaal.com`;
};

const getSiteUrl = (subdomain: string) => {
  return `https://${subdomain}.jaal.com`;
};

export default function DeploymentTab({ domain }: DeploymentTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Deployment</h3>
        <p className="text-sm text-gray-600">Your website is live and accessible</p>
      </div>

      {/* Compact Status */}
      <div className="flex items-center gap-2 py-2">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={20} className="text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">Deployment Successful</h4>
          <p className="text-xs text-gray-600">Your website is live and accessible</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Subdomain */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subdomain</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-mono text-sm text-gray-900 mb-2 break-all">{getDisplaySubdomain(domain.website.subdomain)}</p>
            <a
              href={getSiteUrl(domain.website.subdomain)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-900 hover:underline flex items-center gap-1 font-medium"
            >
              View site <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Custom Domain */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Custom Domain</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-mono text-sm text-gray-900 mb-3 break-all">{domain.domainName}</p>
            
            {/* DNS Configuration */}
            {domain.nameServers && domain.nameServers.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">DNS Configuration</p>
                  {domain.nameServersStatus && (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      domain.nameServersStatus === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {domain.nameServersStatus === 'active' ? (
                        <>
                          <CheckCircle2 size={12} />
                          Active
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          Pending
                        </>
                      )}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-3">Point your domain to these nameservers:</p>
                
                <div className="space-y-2 mb-3">
                  {domain.nameServers.map((ns: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-mono text-xs text-gray-900 flex-1">{ns}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ns);
                          toast.success('Copied to clipboard!');
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-md transition-all duration-200"
                      >
                        <Copy size={12} />
                        <span>Copy</span>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-lg p-3 border-l-2 border-gray-900">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    💡 Update nameservers at your domain registrar. Changes may take 24-48 hours to propagate.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
