'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { domainsAPI } from '@/lib/dashboard';
import { Globe, Search, Sparkles, ChevronDown, Upload, FileText, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomLoader from '@/components/CustomLoader';
import {
  DomainCard,
  AddDomainModal,
  SynonymSelectionModal,
  GenerateWebsiteModal,
  CsvUploadModal,
} from '@/components/dashboard';
import type { UploadResult } from '@/components/dashboard';
import { bulkUploadAPI } from '@/lib/api';

const CSV_RESULT_STORAGE_KEY = 'csvUploadResult';

const SEARCH_DEBOUNCE_MS = 600;

export default function DomainsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showSynonymSelection, setShowSynonymSelection] = useState<string | null>(null);
  const [showGenerateWebsite, setShowGenerateWebsite] = useState<{ domainId: string; setJobId: any } | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [showDropdown, setShowDropdown] = useState(false);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [isFetchingInactive, setIsFetchingInactive] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpenInactiveBulk = async () => {
    setIsFetchingInactive(true);
    try {
      const res = await bulkUploadAPI.getInactiveDomains();
      const list = Array.isArray(res.data) ? res.data : (res.data as { domains?: unknown[] })?.domains ?? [];
      if (list.length === 0) {
        toast('No inactive bulk-uploaded domains', {
          icon: '📋',
          style: { background: '#262626', color: '#fafafa' },
        });
        return;
      }
      const result: UploadResult = {
        saved: list as UploadResult['saved'],
        savedCount: list.length,
        skippedCount: 0,
        total: list.length,
        skipped: [],
      };
      sessionStorage.setItem(CSV_RESULT_STORAGE_KEY, JSON.stringify(result));
      router.push('/dashboard/preview-editor');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load inactive domains');
    } finally {
      setIsFetchingInactive(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  useEffect(() => {
    if (!domains || domains.length === 0) return;

    const pendingDomains = domains.filter(
      (domain: any) => domain.nameServersStatus === 'pending' && domain.nameServers && domain.nameServers.length > 0
    );

    if (pendingDomains.length === 0) return;

    const checkAllPendingDns = async () => {
      for (const domain of pendingDomains) {
        try {
          const response = await domainsAPI.checkDnsStatus(domain.id);
          const newStatus = response.data.nameServersStatus;

          if (newStatus === 'active') {
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
    return () => clearInterval(intervalId);
  }, [domains, queryClient]);

  return (
    <div className="px-4 lg:px-6">
      {isGlobalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <div className="relative z-10">
            <CustomLoader />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search domains..."
              className="w-full h-11 pl-9 bg-[#0a0a0a] border border-neutral-700 rounded-md text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
              aria-label="Search domains"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenInactiveBulk}
            disabled={isFetchingInactive}
            className="h-12 w-12 bg-[#0a0a0a] text-white flex-shrink-0 flex items-center justify-center border border-neutral-700 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-[#262626] hover:border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="View inactive bulk-uploaded domains"
          >
            {isFetchingInactive ? (
              <span className="size-4 border-3 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText size={18} />
            )}
          </button>
          <div className="h-12 bg-[#0a0a0a] border border-neutral-700 rounded-md p-1 flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`h-full px-3 rounded text-sm transition-colors flex items-center justify-center ${viewMode === 'card'
                ? 'bg-[#262626] text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200'
                }`}
              title="Card view"
              aria-label="Switch to card view"
              aria-pressed={viewMode === 'card'}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`h-full px-3 rounded text-sm transition-colors flex items-center justify-center ${viewMode === 'list'
                ? 'bg-[#262626] text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200'
                }`}
              title="List view"
              aria-label="Switch to list view"
              aria-pressed={viewMode === 'list'}
            >
              <List size={16} />
            </button>
          </div>
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="h-12 px-4 bg-white text-black hover:bg-neutral-200 rounded-md text-sm font-light flex items-center gap-2 transition-colors"
            >
              Add New...
              <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1.5 w-48 bg-[#0a0a0a] border border-neutral-700 rounded-lg shadow-2xl z-20 py-1 overflow-hidden">
                <button
                  onClick={() => { setShowDropdown(false); setShowAddDomain(true); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-neutral-200 hover:bg-[#262626] transition-colors text-left"
                >
                  <Globe size={14} className="text-neutral-500 flex-shrink-0" />
                  Add a Domain
                </button>
                <button
                  onClick={() => { setShowDropdown(false); setShowCsvUpload(true); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-neutral-200 hover:bg-[#262626] transition-colors text-left"
                >
                  <Upload size={14} className="text-neutral-500 flex-shrink-0" />
                  Upload CSV
                </button>
              </div>
            )}
          </div>
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
        <div className={viewMode === 'card'
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'rounded-lg border border-neutral-800 divide-y divide-neutral-800 overflow-hidden'
        }>
          {domains.map((domain: any, index: number) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              index={index}
              viewMode={viewMode}
              onGenerateWebsite={(setJobId: any) => {
                setShowGenerateWebsite({ domainId: domain.id, setJobId });
              }}
              setGlobalLoading={setIsGlobalLoading}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-[#262626] rounded-2xl flex items-center justify-center mb-6 border border-neutral-700">
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

      {showCsvUpload && (
        <CsvUploadModal
          onClose={() => setShowCsvUpload(false)}
          onSuccess={(uploadResult) => {
            setShowCsvUpload(false);
            try {
              sessionStorage.setItem(CSV_RESULT_STORAGE_KEY, JSON.stringify(uploadResult));
            } catch {
              // ignore
            }
            router.push('/dashboard/preview-editor');
          }}
        />
      )}
    </div>
  );
}
