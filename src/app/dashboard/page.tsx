'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { domainsAPI } from '@/lib/dashboard';
import { Globe, Search, Sparkles, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomLoader from '@/components/CustomLoader';
import {
  DomainCard,
  AddDomainModal,
  SynonymSelectionModal,
  GenerateWebsiteModal,
} from '@/components/dashboard';

const SEARCH_DEBOUNCE_MS = 600;

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showSynonymSelection, setShowSynonymSelection] = useState<string | null>(null);
  const [showGenerateWebsite, setShowGenerateWebsite] = useState<{ domainId: string; setJobId: any } | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) {
        const response = await domainsAPI.getAll();
        return response.data;
      }
      const response = await domainsAPI.search(debouncedSearch);
      return response.data;
    },
  });

  // Auto-poll DNS status for all pending domains every 15 seconds
  useEffect(() => {
    if (!domains || domains.length === 0) return;

    const pendingDomains = domains.filter(
      (domain: any) => domain.nameServersStatus === 'pending' && domain.nameServers && domain.nameServers.length > 0
    );

    if (pendingDomains.length === 0) return;

    console.log(`🔄 Starting DNS status polling for ${pendingDomains.length} pending domain(s)`);

    const checkAllPendingDns = async () => {
      for (const domain of pendingDomains) {
        try {
          const response = await domainsAPI.checkDnsStatus(domain.id);
          const newStatus = response.data.nameServersStatus;

          if (newStatus === 'active') {
            console.log(`✅ DNS became active for ${domain.domainName}`);

            if (response.data.autoDeployed && response.data.deploymentSuccess) {
              toast.success(`${domain.domainName}: DNS active! Worker domains deployed! 🚀`, { duration: 5000 });
            } else {
              toast.success(`${domain.domainName}: DNS is now active! 🎉`, { duration: 4000 });
            }

            queryClient.invalidateQueries({ queryKey: ['domains'] });
          }
        } catch (error) {
          console.error(`Failed to check DNS for ${domain.domainName}:`, error);
        }
      }
    };

    checkAllPendingDns();

    const intervalId = setInterval(checkAllPendingDns, 15000);

    return () => {
      console.log('🛑 Stopping DNS status polling');
      clearInterval(intervalId);
    };
  }, [domains, queryClient]);

  return (
    <div className="px-4 lg:px-8">
      {isGlobalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <div className="relative z-10">
            <CustomLoader />
          </div>
        </div>
      )}

      <div className="mb-4">
        <h1 className="text-xl font-semibold text-neutral-100">Domains</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search domains..."
              className="w-full h-12 pl-9 pr-4 bg-[#0a0a0a] border border-neutral-700 rounded-md text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
              aria-label="Search domains"
            />
          </div>
          <button
            onClick={() => setShowAddDomain(true)}
            className="h-12 px-4 bg-white text-black hover:bg-neutral-200 rounded-md text-sm font-light flex items-center gap-2 transition-colors flex-shrink-0"
            title="Add Domain"
          >
            Add New...
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <CustomLoader />
            <p className="text-sm text-neutral-500">Loading your domains...</p>
          </div>
        </div>
      ) : domains && domains.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {domains.map((domain: any, index: number) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              index={index}
              onGenerateWebsite={(setJobId: any) => {
                setShowGenerateWebsite({ domainId: domain.id, setJobId });
              }}
              setGlobalLoading={setIsGlobalLoading}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 border border-neutral-700">
            <Globe size={36} className="text-neutral-500" />
          </div>
          <h3 className="text-2xl font-light text-neutral-100 mb-2">No domains yet</h3>
          <p className="text-neutral-400 mb-8 text-center max-w-md text-sm">
            Get started by adding your first domain and create a beautiful AI-powered website in minutes
          </p>
          <button
            onClick={() => setShowAddDomain(true)}
            className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-md text-sm font-light flex items-center gap-2 transition-colors"
          >
            <Sparkles size={18} />
            Add Your First Domain
          </button>
        </div>
      )}

      {showAddDomain && (
        <AddDomainModal
          onClose={() => setShowAddDomain(false)}
          onSuccess={(domainId: string) => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            setShowAddDomain(false);
            setShowSynonymSelection(domainId);
          }}
          setGlobalLoading={setIsGlobalLoading}
        />
      )}

      {showSynonymSelection && (
        <SynonymSelectionModal
          domainId={showSynonymSelection}
          onClose={() => setShowSynonymSelection(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            setShowSynonymSelection(null);
          }}
          setGlobalLoading={setIsGlobalLoading}
        />
      )}

      {showGenerateWebsite && (
        <GenerateWebsiteModal
          domainId={showGenerateWebsite.domainId}
          onClose={() => setShowGenerateWebsite(null)}
          onJobStarted={(jobId: string) => {
            showGenerateWebsite.setJobId(jobId);
            setShowGenerateWebsite(null);
          }}
          setGlobalLoading={setIsGlobalLoading}
        />
      )}
    </div>
  );
}
