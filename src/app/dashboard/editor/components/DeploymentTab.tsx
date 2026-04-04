'use client';

import { CheckCircle2, ExternalLink, Clock, Copy, Rocket, AlertCircle, Loader2, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { domainsAPI } from '@/lib/api';
import { useState } from 'react';

interface DeploymentTabProps {
  domain: any;
}

// Helper functions (copied from parent)
const getDisplaySubdomain = (subdomain: string) => {
  return `${subdomain}.fastofy.com`;
};

const getSiteUrl = (subdomain: string) => {
  return `https://${subdomain}.fastofy.com`;
};

export default function DeploymentTab({ domain }: DeploymentTabProps) {
  const queryClient = useQueryClient();
  const [isDeploying, setIsDeploying] = useState(false);
  const [dnsCheckResult, setDnsCheckResult] = useState<{ status: string; autoDeployed?: boolean } | null>(null);

  const deployWorkersMutation = useMutation({
    mutationFn: () => domainsAPI.deployWorkers(domain.id),
    onMutate: () => {
      setIsDeploying(true);
      toast.loading('Deploying DNS records...', { id: 'deploy-workers' });
    },
    onSuccess: (response) => {
      setIsDeploying(false);
      if (response.data.success) {
        toast.success('DNS records deployed successfully! 🎉', { id: 'deploy-workers' });
      } else {
        toast.error('Failed to deploy some DNS records', { id: 'deploy-workers' });
      }
      queryClient.invalidateQueries({ queryKey: ['domain', domain.id] });
    },
    onError: (error: any) => {
      setIsDeploying(false);
      toast.error(error.response?.data?.message || 'Failed to deploy DNS records', { id: 'deploy-workers' });
    },
  });

  const checkDnsMutation = useMutation({
    mutationFn: () => domainsAPI.checkDnsStatus(domain.id),
    onSuccess: (response) => {
      const { nameServersStatus, autoDeployed } = response.data;
      setDnsCheckResult({ status: nameServersStatus, autoDeployed });
      if (nameServersStatus === 'active') {
        toast.success(autoDeployed ? 'DNS is active! Workers auto-deployed 🎉' : 'DNS is active and pointing correctly ✅');
      } else {
        toast('DNS not yet active. Changes can take 24-48 hours to propagate.', { icon: '⏳' });
      }
      queryClient.invalidateQueries({ queryKey: ['domain', domain.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check DNS status');
    },
  });

  const retryCloudfareMutation = useMutation({
    mutationFn: () => domainsAPI.retryCloudflare(domain.id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['domain', domain.id] });
      toast.success('Nameservers created successfully! 🎉');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create nameservers');
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-neutral-100 mb-1">Deployment</h3>
        <p className="text-sm font-light text-neutral-400">Your website is live and accessible</p>
      </div>

      {/* Compact Status */}
      <div className="flex items-center gap-2 py-2">
        <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center border border-green-700/50">
          <CheckCircle2 size={20} className="text-green-400" />
        </div>
        <div>
          <h4 className="text-neutral-100 text-sm">Deployment Successful</h4>
          <p className="text-xs font-light text-neutral-400">Your website is live and accessible</p>
        </div>
      </div>

      <div className="w-full max-w-full divide-y divide-neutral-800">
        {/* Subdomain */}
        <div className="pb-8">
          <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-3">Subdomain</p>
          <div className="py-1">
            <p className="font-mono text-sm text-neutral-100 mb-2 break-all">{getDisplaySubdomain(domain.website.subdomain)}</p>
            <a
              href={getSiteUrl(domain.website.subdomain)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-white hover:underline flex items-center gap-1"
            >
              View site <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Custom Domain */}
        <div className="pt-8">
          <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-3">Custom Domain</p>
          <div className="py-1">
            <p className="font-mono text-sm text-neutral-100 mb-3 break-all">{domain.domainName}</p>
            
            {/* DNS Configuration - Show if nameservers exist */}
            {domain.nameServers && domain.nameServers.length > 0 ? (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-neutral-100">DNS Configuration</p>
                  {domain.nameServersStatus && (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                      domain.nameServersStatus === 'active' 
                        ? 'bg-green-900/40 text-green-300 border-green-700/50' 
                        : 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50'
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
                
                <p className="text-xs text-neutral-400 mb-3">Point your domain to these nameservers:</p>
                
                <div className="space-y-2 mb-3">
                  {domain.nameServers.map((ns: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-[#262626] border border-neutral-600 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-[#404040] transition-colors"
                    >
                      <span className="font-mono text-xs text-neutral-200 flex-1">{ns}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ns);
                          toast.success('Copied to clipboard!');
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-light text-neutral-200 bg-[#404040] hover:bg-white hover:text-black rounded-md transition-all duration-200"
                      >
                        <Copy size={12} />
                        <span>Copy</span>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-[#262626] rounded-lg p-3 border-l-2 border-neutral-500">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    💡 Update nameservers at your domain registrar. Changes may take 24-48 hours to propagate.
                  </p>
                </div>

                {/* Check DNS button - always visible when nameservers exist */}
                <div className="mt-3">
                  <button
                    onClick={() => checkDnsMutation.mutate()}
                    disabled={checkDnsMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-light text-neutral-300 bg-[#262626] hover:bg-[#404040] border border-neutral-600 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkDnsMutation.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Search size={12} />
                    )}
                    {checkDnsMutation.isPending ? 'Checking...' : 'Check DNS Status'}
                  </button>
                  {dnsCheckResult && (
                    <p className={`text-xs mt-1.5 font-medium ${dnsCheckResult.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {dnsCheckResult.status === 'active' ? '🟢 DNS is pointing correctly ' : '⏳ DNS not yet active'}
                    </p>
                  )}
                </div>

                {/* Deploy Worker Domains Button - Show when workers not yet deployed */}
                {!domain.workersDeployed && (
                  <div className="mt-4 pt-4 border-t border-neutral-700">
                    <button
                      onClick={() => deployWorkersMutation.mutate()}
                      disabled={isDeploying}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-neutral-200 text-black rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <Rocket size={16} className={isDeploying ? 'animate-bounce' : ''} />
                      {isDeploying ? 'Deploying...' : 'Deploy DNS Records'}
                    </button>
                    <p className="text-xs text-neutral-400 mt-2 text-center">
                      Configures both {domain.domainName} and www.{domain.domainName}
                    </p>
                  </div>
                )}

                {/* Deployed indicator */}
                {domain.workersDeployed && (
                  <div className="mt-4 pt-4 border-t border-neutral-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                    <p className="text-xs text-green-400 font-light">
                      DNS records are configured and pointing to your website
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <div className="bg-orange-950/40 rounded-lg p-4 border-l-2 border-orange-500/60">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle size={20} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-200 mb-1">Nameservers Not Configured</p>
                      <p className="text-xs text-orange-300/90 leading-relaxed font-light">
                        DNS records need to be created for this domain. Click below to set up nameservers via Cloudflare.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => retryCloudfareMutation.mutate()}
                    disabled={retryCloudfareMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {retryCloudfareMutation.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Creating Nameservers...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        Setup Nameservers
                      </>
                    )}
                  </button>
                  
                  <div className="mt-3 bg-[#262626] rounded-lg p-3 border-l-2 border-orange-500">
                    <p className="text-xs text-neutral-300 leading-relaxed font-light">
                      ⚠️ <strong>Note:</strong> Domain must have a valid extension (e.g., .com, .net, .io). If setup fails, verify your domain format is correct.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
