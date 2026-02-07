'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { domainsAPI, websitesAPI } from '@/lib/api';
import { Plus, Globe, Trash2, ExternalLink, CheckCircle, Clock, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useJobStatus } from '@/hooks/useJobStatus';
import CustomLoader from '@/components/CustomLoader';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showSynonymSelection, setShowSynonymSelection] = useState<string | null>(null);
  const [showGenerateWebsite, setShowGenerateWebsite] = useState<{ domainId: string; setJobId: any } | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  // Fetch domains
  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const response = await domainsAPI.getAll();
      return response.data;
    },
  });

  return (
    <div className="relative">
      {/* Full-Screen Loading Overlay - ONLY for operations (not initial load) */}
      {isGlobalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Backdrop */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md"></div>
          
          {/* Loader */}
          <div className="relative z-10">
            <CustomLoader />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Domains</h1>
            <p className="text-gray-600 text-sm">
              {domains?.length || 0} {domains?.length === 1 ? 'domain' : 'domains'} • Manage your websites
            </p>
          </div>
          <button
            onClick={() => setShowAddDomain(true)}
            className="group px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-medium">Add Domain</span>
          </button>
        </div>
      </div>

      {/* Initial Loading State - Inline */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <CustomLoader />
            <p className="text-sm text-gray-500">Loading your domains...</p>
          </div>
        </div>
      ) : domains && domains.length > 0 ? (
        /* Domains Grid - 3 per row */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {domains.map((domain: any, index: number) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              index={index}
              onGenerateWebsite={(setJobId: any) => {
                // Store setJobId callback to pass to modal
                setShowGenerateWebsite({ domainId: domain.id, setJobId });
              }}
              setGlobalLoading={setIsGlobalLoading}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <Globe size={36} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-medium text-gray-900 mb-2">No domains yet</h3>
          <p className="text-gray-600 mb-8 text-center max-w-md text-sm">
            Get started by adding your first domain and create a beautiful AI-powered website in minutes
          </p>
          <button
            onClick={() => setShowAddDomain(true)}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Sparkles size={18} />
            <span className="font-medium">Add Your First Domain</span>
          </button>
        </div>
      )}

      {/* Add Domain Modal */}
      {showAddDomain && (
        <AddDomainModal
          onClose={() => setShowAddDomain(false)}
          onSuccess={(domainId: string) => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            setShowAddDomain(false);
            // Show synonym selection after domain creation
            setShowSynonymSelection(domainId);
          }}
          setGlobalLoading={setIsGlobalLoading}
        />
      )}

      {/* Synonym Selection Modal */}
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

      {/* Generate Website Modal */}
      {showGenerateWebsite && (
        <GenerateWebsiteModal
          domainId={showGenerateWebsite.domainId}
          onClose={() => setShowGenerateWebsite(null)}
          onJobStarted={(jobId: string) => {
            // Pass job ID to the domain card and close modal
            showGenerateWebsite.setJobId(jobId);
            setShowGenerateWebsite(null);
          }}
          setGlobalLoading={setIsGlobalLoading}
        />
      )}
    </div>
  );
}

function DomainCard({ domain, index, onGenerateWebsite, setGlobalLoading }: any) {
  const queryClient = useQueryClient();
  const [generationJobId, setGenerationJobId] = useState<string | null>(null);

  // Poll for job status if there's a job ID
  const { status, progress, isCompleted, isFailed } = useJobStatus(
    generationJobId,
    (result) => {
      // Job completed successfully
      console.log('✅ Website generation completed:', result);
      toast.success('Website generated successfully! 🎉', { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setGenerationJobId(null);
    },
    (error) => {
      // Job failed
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

  // Check if this domain is generating
  const isGenerating = !!generationJobId && !isCompleted && !isFailed;

  return (
    <div 
      className="group bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Globe size={24} className="text-gray-700" />
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-900 mb-1">{domain.domainName}</h3>
            {isGenerating ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin"></div>
                Generating {progress}%
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  domain.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {domain.status === 'ACTIVE' ? <CheckCircle size={12} /> : <Clock size={12} />}
                {domain.status}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (confirm(`Delete "${domain.domainName}"? This cannot be undone.`)) {
              deleteMutation.mutate();
            }
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all duration-200"
          title="Delete domain"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {domain.website ? (
        <div className="space-y-4">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1 font-medium">Subdomain</p>
              <p className="text-sm font-medium text-gray-900 truncate">{domain.website.subdomain}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1 font-medium">Status</p>
              <p className="text-sm font-semibold text-green-600 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Live
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/dashboard/editor/${domain.id}`}
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium group/btn"
            >
              <span>Manage</span>
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href={`http://${domain.website.subdomain}.local:3000`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center border border-gray-200 hover:border-gray-300"
              title="View site"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      ) : isGenerating ? (
        // Show progress bar when generating
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                {status?.status === 'waiting' ? 'Queued for generation...' : 'Generating website...'}
              </span>
              <span className="text-sm font-semibold text-blue-700">{progress}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-blue-700 mt-2">
              This usually takes 2-3 minutes. Feel free to continue using the dashboard!
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onGenerateWebsite(setGenerationJobId)}
          className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border border-gray-200 hover:border-gray-300"
        >
          <Sparkles size={16} />
          Generate Website
        </button>
      )}
    </div>
  );
}

function AddDomainModal({ onClose, onSuccess, setGlobalLoading }: any) {
  const [domainName, setDomainName] = useState('');

  const mutation = useMutation({
    mutationFn: () => domainsAPI.create(domainName),
    onMutate: () => {
      setGlobalLoading(true);
    },
    onSuccess: (response) => {
      toast.success(`Domain "${domainName}" added successfully!`);
      setGlobalLoading(false);
      // Pass domain ID to show synonym selection
      onSuccess(response.data.id);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add domain');
      setGlobalLoading(false);
    },
  });

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Add Domain</h2>
        <p className="text-gray-600 text-sm mb-6">Enter your domain name to get started</p>
        <input
          type="text"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="example.com"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 mb-6"
          autoFocus
        />
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 font-medium border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !domainName}
            className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {mutation.isPending ? 'Adding...' : 'Add Domain'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SynonymSelectionModal({ domainId, onClose, onSuccess, setGlobalLoading }: any) {
  const [selectedMeanings, setSelectedMeanings] = useState<Array<{ key: string; context: string }>>([]);
  const [skipSelection, setSkipSelection] = useState(false);
  const MAX_SELECTIONS = 3;

  // Fetch synonyms for the domain
  const { data: synonymsData, isLoading, error } = useQuery({
    queryKey: ['synonyms', domainId],
    queryFn: async () => {
      const response = await domainsAPI.getSynonyms(domainId);
      return response.data;
    },
  });

  // Update domain with selected meaning
  const updateMutation = useMutation({
    mutationFn: (meaning: string) => domainsAPI.update(domainId, { selectedMeaning: meaning }),
    onMutate: () => {
      setGlobalLoading(true);
    },
    onSuccess: () => {
      toast.success('Domain context saved!');
      setGlobalLoading(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save context');
      setGlobalLoading(false);
    },
  });

  const handleContinue = () => {
    if (skipSelection || selectedMeanings.length === 0) {
      // Skip meaning selection - just close
      onSuccess();
    } else {
      // Combine selected meaning keys only (no descriptions)
      const combinedContext = selectedMeanings.map(({ key }) => key).join(', ');
      
      console.log('📝 Saving context:', combinedContext); // Debug log
      
      // Update domain with meaning keys only
      updateMutation.mutate(combinedContext);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <CustomLoader />
            <p className="text-sm text-gray-600">Finding different meanings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Could not find meanings</h2>
          <p className="text-gray-600 text-sm mb-6">
            We couldn't find different meanings for your domain. You can continue without context selection.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 font-medium border border-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const meanings = synonymsData?.meanings || {};
  const meaningEntries = Object.entries(meanings);
  const hasMeanings = meaningEntries.length > 1; // Show selection only if multiple meanings exist

  if (!hasMeanings) {
    // No multiple meanings, just continue
    if (meaningEntries.length === 0) {
      toast('No multiple meanings found. Proceeding with default context.', { 
        icon: 'ℹ️',
        duration: 3000 
      });
    }
    setTimeout(() => onSuccess(), 100);
    return null;
  }

  const handleMeaningToggle = (meaning: string, exampleSentence: string) => {
    const isSelected = selectedMeanings.some(m => m.key === meaning);
    
    if (isSelected) {
      // Remove if already selected
      setSelectedMeanings(prev => prev.filter(m => m.key !== meaning));
    } else {
      // Add if not at max limit
      if (selectedMeanings.length < MAX_SELECTIONS) {
        setSelectedMeanings(prev => [...prev, { key: meaning, context: exampleSentence }]);
        setSkipSelection(false);
      } else {
        toast.error(`You can select up to ${MAX_SELECTIONS} contexts only`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Choose Your Domain Context</h2>
            <p className="text-gray-600 text-sm mt-2">
              "{synonymsData?.word}" can mean different things. Select up to {MAX_SELECTIONS} contexts that describe your website.
            </p>
          </div>
          {selectedMeanings.length > 0 && (
            <div className="bg-gray-900 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {selectedMeanings.length}/{MAX_SELECTIONS}
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6 mt-6">
          {meaningEntries.map(([meaning, exampleSentence]: [string, any]) => {
            const isSelected = selectedMeanings.some(m => m.key === meaning);
            return (
              <label
                key={meaning}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${selectedMeanings.length >= MAX_SELECTIONS && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleMeaningToggle(meaning, exampleSentence)}
                  disabled={selectedMeanings.length >= MAX_SELECTIONS && !isSelected}
                  className="w-4 h-4 text-gray-900 rounded mt-0.5 focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1 capitalize">{meaning}</p>
                  <p className="text-sm text-gray-600 italic">
                    "{exampleSentence}"
                  </p>
                </div>
              </label>
            );
          })}
          
          <label
            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              skipSelection
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={skipSelection}
              onChange={(e) => {
                setSkipSelection(e.target.checked);
                if (e.target.checked) {
                  setSelectedMeanings([]);
                }
              }}
              className="w-4 h-4 text-gray-900 rounded mt-0.5 focus:ring-2 focus:ring-gray-900"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">Skip context selection</p>
              <p className="text-sm text-gray-600">
                Let AI decide based on general knowledge
              </p>
            </div>
          </label>
        </div>

        {/* Selected contexts preview */}
        {selectedMeanings.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-900 mb-2">Selected contexts:</p>
            <div className="flex flex-wrap gap-2">
              {selectedMeanings.map(({ key }) => (
                <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-300 text-blue-900 rounded-full text-xs font-medium">
                  {key}
                  <button
                    onClick={() => handleMeaningToggle(key, '')}
                    className="hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 font-medium border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={(selectedMeanings.length === 0 && !skipSelection) || updateMutation.isPending}
            className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {updateMutation.isPending ? 'Saving...' : `Continue ${selectedMeanings.length > 0 ? `(${selectedMeanings.length} selected)` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function GenerateWebsiteModal({ domainId, onClose, onJobStarted, setGlobalLoading }: any) {
  const [contactFormEnabled, setContactFormEnabled] = useState(true);

  const mutation = useMutation({
    mutationFn: () => websitesAPI.generate(domainId, 'modernNews', contactFormEnabled),
    onSuccess: (response) => {
      const newJobId = response.data.jobId;
      console.log('✅ Job started with ID:', newJobId);
      toast.success('Website generation started! 🚀');
      
      // Pass job ID to parent and close modal immediately
      onJobStarted(newJobId);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start generation');
    },
  });

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 relative z-[61]">
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Generate Website</h2>
          <p className="text-gray-600 text-sm">
            Create a professional news-style website with AI-powered content
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
          <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-gray-700" />
            What will be generated
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Home page with 3 AI-generated blog posts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Professional news magazine layout</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>SEO-optimized content & images</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Fully responsive design</span>
            </li>
          </ul>
        </div>

        {/* Contact Form Toggle */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={contactFormEnabled}
              onChange={(e) => setContactFormEnabled(e.target.checked)}
              disabled={mutation.isPending}
              className="w-4 h-4 text-gray-900 rounded mt-0.5 focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm mb-1">Enable Contact Form</p>
              <p className="text-xs text-gray-600">Allow visitors to contact you through your website</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            disabled={mutation.isPending}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Starting...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Website
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
