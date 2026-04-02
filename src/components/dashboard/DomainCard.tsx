'use client';

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Globe,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  AlertCircle,
  Loader2,
  Server,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { domainsAPI, getSiteUrl } from '@/lib/dashboard';
import { useJobStatus } from '@/hooks/useJobStatus';
import { GeneratingWebsiteAnimation } from './GeneratingWebsiteAnimation';

export function DomainCard({ domain, index, onGenerateWebsite, setGlobalLoading, viewMode = 'card' }: any) {
  const queryClient = useQueryClient();
  const [generationJobId, setGenerationJobId] = useState<string | null>(null);
  const [showDnsModal, setShowDnsModal] = useState(false);
  const [dnsStatus, setDnsStatus] = useState(domain.nameServersStatus);
  const [isCheckingDns, setIsCheckingDns] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { status, progress, isCompleted, isFailed } = useJobStatus(
    generationJobId,
    (result) => {
      console.log('✅ Website generation completed:', result);
      toast.success('Website generated successfully! 🎉', { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setGenerationJobId(null);
    },
    (error) => {
      console.error('❌ Website generation failed:', error);
      toast.error(error || 'Failed to generate website');
      setGenerationJobId(null);
    }
  );

  const deleteMutation = useMutation({
    mutationFn: () => domainsAPI.delete(domain.id),
    onMutate: () => {
      setGlobalLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast.success(`Domain "${domain.domainName}" deleted successfully`);
      setGlobalLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete domain');
      setGlobalLoading(false);
    },
  });

  const retryCloudfareMutation = useMutation({
    mutationFn: () => domainsAPI.retryCloudflare(domain.id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast.success('Nameservers created successfully! 🎉');
      setDnsStatus(response.data.nameServersStatus);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create nameservers');
    },
  });

  const isGenerating = !!generationJobId && !isCompleted && !isFailed;

  const checkDnsStatus = async () => {
    if (!domain.nameServers || domain.nameServers.length === 0) return;

    setIsCheckingDns(true);
    try {
      const response = await domainsAPI.checkDnsStatus(domain.id);
      const newStatus = response.data.nameServersStatus;
      const autoDeployed = response.data.autoDeployed;
      const deploymentSuccess = response.data.deploymentSuccess;
      const deploymentError = response.data.deploymentError;

      setDnsStatus(newStatus);

      queryClient.invalidateQueries({ queryKey: ['domains'] });

      if (newStatus === 'active') {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        if (autoDeployed) {
          if (deploymentSuccess) {
            toast.success('DNS is active! Worker domains and KV mappings deployed automatically! 🚀', { duration: 5000 });
          } else {
            toast.success('DNS is active! 🎉', { duration: 4000 });
            if (deploymentError) {
              toast.error(`Auto-deployment failed: ${deploymentError}`, { duration: 5000 });
            }
          }
        } else {
          toast.success('DNS is now active! 🎉');
        }
      }
    } catch (error: any) {
      console.error('Failed to check DNS status:', error);
    } finally {
      setIsCheckingDns(false);
    }
  };

  useEffect(() => {
    if (showDnsModal && dnsStatus !== 'active' && domain.nameServers && domain.nameServers.length > 0) {
      checkDnsStatus();

      pollingIntervalRef.current = setInterval(() => {
        checkDnsStatus();
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [showDnsModal, dnsStatus]);

  useEffect(() => {
    setDnsStatus(domain.nameServersStatus);
  }, [domain.nameServersStatus]);

  const hasWebsite = !!(domain.website && domain.website.pages && domain.website.pages.length > 0);

  const statusBadges = isGenerating ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-light text-neutral-400">
      <div className="w-2 h-2 bg-neutral-500 rounded-full animate-pulse" />
      Generating website
    </span>
  ) : (
    <>
      <span
        className={
          'inline-flex items-center text-neutral-300 gap-1.5 text-xs font-light px-2 py-0.5 rounded bg-[#262626]'
        }
      >
        {domain.status === 'ACTIVE' ? (
          <CheckCircle size={12} className="text-emerald-400" />
        ) : (
          <Clock size={12} className="text-amber-400" />
        )}
        {domain.status}
      </span>
      {domain.nameServers && domain.nameServers.length > 0 ? (
        <button
          onClick={() => setShowDnsModal(true)}
          className="inline-flex items-center text-neutral-300 gap-1.5 text-xs font-light px-2 py-0.5 rounded bg-[#262626] cursor-pointer hover:opacity-90"
          title="Click to view DNS configuration"
        >
          {dnsStatus === 'active' ? (
            <CheckCircle size={12} className="text-emerald-400" />
          ) : (
            <Clock size={12} className="text-amber-400" />
          )}
          {dnsStatus === 'active' ? 'DNS Active' : 'DNS Pending'}
        </button>
      ) : (
        <button
          onClick={() => retryCloudfareMutation.mutate()}
          disabled={retryCloudfareMutation.isPending}
          className="inline-flex items-center gap-1.5 text-xs font-light px-2 py-0.5 rounded bg-[#262626] text-neutral-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Click to create nameserver records"
        >
          {retryCloudfareMutation.isPending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <AlertCircle size={12} className="text-orange-400" />
          )}
          {retryCloudfareMutation.isPending ? 'Creating...' : 'Setup Nameservers'}
        </button>
      )}
    </>
  );

  return (
    <>
      {viewMode === 'list' ? (
        <div className="group bg-[#0a0a0a] hover:bg-[#101010] transition-colors px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3.5 xl:grid xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] xl:items-center xl:gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 bg-[#262626] rounded-md flex items-center justify-center flex-shrink-0 border border-neutral-700">
                <Globe size={18} className="text-neutral-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-light text-neutral-100 truncate">{domain.domainName}</h3>
                {domain.website?.subdomain && (
                  <p className="text-xs font-light text-neutral-400 truncate mt-0.5">
                    {getSiteUrl(domain.website.subdomain).replace(/^https?:\/\//, '')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap xl:justify-center">
              {statusBadges}
            </div>

            <div className="flex items-center gap-2.5 xl:justify-end">
              {hasWebsite ? (
                <>
                  <Link
                    href={`/dashboard/editor/${domain.id}`}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-200 text-black rounded-md transition-colors flex items-center justify-center gap-1.5 text-sm group/btn"
                  >
                    <span>Manage</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                  <a
                    href={getSiteUrl(domain.website.subdomain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-2 bg-[#262626] hover:bg-[#404040] text-neutral-200 rounded-md transition-colors flex items-center justify-center border border-neutral-700"
                    title="View site"
                  >
                    <ExternalLink size={16} />
                  </a>
                </>
              ) : !isGenerating ? (
                <button
                  onClick={() => onGenerateWebsite(setGenerationJobId)}
                  className="px-3 py-1.5 bg-white hover:bg-neutral-200 text-black rounded-md text-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  Generate
                </button>
              ) : null}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`Delete "${domain.domainName}"? This cannot be undone.`)) {
                    deleteMutation.mutate();
                  }
                }}
                className="text-neutral-300 hover:text-neutral-200 hover:bg-[#262626] p-1.5 rounded transition-colors"
                title="Delete domain"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          {isGenerating && !hasWebsite ? (
            <div className="mt-3">
              <GeneratingWebsiteAnimation progress={progress} isCompleted={isCompleted} />
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className="group bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-700 rounded-lg p-2 lg:p-4 transition-all duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-[#262626] rounded-lg flex items-center justify-center flex-shrink-0 border border-neutral-700">
                <Globe size={20} className="text-neutral-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-light text-neutral-100 truncate">{domain.domainName}</h3>
                {domain.website?.subdomain && (
                  <p className="text-sm font-light text-neutral-400 truncate mt-0.5">{getSiteUrl(domain.website.subdomain).replace(/^https?:\/\//, '')}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`Delete "${domain.domainName}"? This cannot be undone.`)) {
                    deleteMutation.mutate();
                  }
                }}
                className="text-neutral-300 hover:text-neutral-300 hover:bg-[#262626] p-1.5 rounded transition-colors"
                title="Delete domain"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">{statusBadges}</div>
          </div>

          {hasWebsite ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex gap-3">
                <Link
                  href={`/dashboard/editor/${domain.id}`}
                  className="flex-1 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-md transition-colors flex items-center justify-center gap-2 text-sm group/btn"
                >
                  <span>Manage</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
                <a
                  href={getSiteUrl(domain.website.subdomain)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#262626] hover:bg-[#404040] text-neutral-200 rounded-md transition-colors flex items-center justify-center border border-neutral-700"
                  title="View site"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ) : isGenerating ? (
            <GeneratingWebsiteAnimation
              progress={progress}
              isCompleted={isCompleted}
            />
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => onGenerateWebsite(setGenerationJobId)}
                className="w-full px-3 py-2 bg-white hover:bg-neutral-200 text-black rounded-md text-sm flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                Generate Website
              </button>
            </div>
          )}
        </div>
      )}

      {showDnsModal && domain.nameServers && domain.nameServers.length > 0 && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowDnsModal(false)}
        >
          <div
            className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#262626] rounded-xl flex items-center justify-center border border-neutral-700">
                  <Server size={24} className="text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-100">DNS Configuration</h3>
                  <p className="text-sm text-neutral-400 mt-0.5">Configure your domain nameservers</p>
                </div>
              </div>
              <button
                onClick={() => setShowDnsModal(false)}
                className="text-neutral-400 hover:text-neutral-200 hover:bg-[#262626] p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="bg-[#262626] border border-neutral-700 rounded-lg p-4">
                <p className="text-sm text-neutral-400">Point your domain to these nameservers</p>
                <p className="text-base font-semibold text-neutral-100 mt-1">{domain.domainName}</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Nameservers</p>
                {domain.nameServers.map((ns: string, idx: number) => (
                  <div
                    key={idx}
                    className="group relative bg-[#262626] border border-neutral-700 hover:border-neutral-600 rounded-lg px-4 py-3.5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-neutral-200 flex-1">{ns}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ns);
                          toast.success('Copied to clipboard!');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-light text-neutral-300 bg-[#404040] hover:bg-neutral-600 rounded-md transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {domain.nameServersStatus && (
                <div className="bg-[#262626] border border-neutral-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${domain.nameServersStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                      <p className="text-sm font-semibold text-neutral-200">Status</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded ${domain.nameServersStatus === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                      }`}>
                      {domain.nameServersStatus === 'active' ? <><CheckCircle size={12} /> Active</> : <><Clock size={12} /> Pending</>}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">i</div>
                  <div>
                    <p className="text-xs font-semibold text-blue-300 mb-1">Next Steps</p>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      Update these nameservers at your domain registrar (e.g., GoDaddy, Namecheap). Changes may take up to 24-48 hours to propagate.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDnsModal(false)}
                className="w-full px-4 py-3 bg-white hover:bg-neutral-200 text-black text-sm font-semibold rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
