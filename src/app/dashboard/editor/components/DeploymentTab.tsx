'use client';

import { CheckCircle2, ExternalLink } from 'lucide-react';

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

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Deployment Successful</h4>
            <p className="text-sm text-green-700">Your website is live and accessible to visitors</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">SUBDOMAIN</p>
          <p className="font-mono text-xs sm:text-sm text-gray-900 mb-3 break-all">{getDisplaySubdomain(domain.website.subdomain)}</p>
          <a
            href={getSiteUrl(domain.website.subdomain)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-900 hover:underline flex items-center gap-1"
          >
            View site <ExternalLink size={14} />
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">CUSTOM DOMAIN</p>
          <p className="font-mono text-xs sm:text-sm text-gray-900 mb-3 break-all">{domain.domainName}</p>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">DNS Configuration</p>
            <p className="text-xs text-gray-600 mb-2">Add this CNAME record to your DNS provider:</p>
            <div className="font-mono text-xs bg-white rounded p-2 border border-gray-200 break-all">
              {domain.domainName} → {domain.website.subdomain}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
