'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { domainsAPI } from '@/lib/dashboard';

export function AddDomainModal({ onClose, onSuccess, setGlobalLoading }: any) {
  const [domainName, setDomainName] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateDomain = (domain: string): boolean => {
    if (!domain.trim()) {
      setValidationError('Domain name is required');
      return false;
    }

    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

    if (!domainRegex.test(domain)) {
      setValidationError('Invalid domain format. Must include a valid extension (e.g., example.com)');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateDomain(domainName)) {
      return;
    }
    mutation.mutate();
  };

  const mutation = useMutation({
    mutationFn: () => domainsAPI.create(domainName),
    onMutate: () => {
      setGlobalLoading(true);
    },
    onSuccess: (response) => {
      toast.success(`Domain "${domainName}" added successfully!`);
      setGlobalLoading(false);
      onSuccess(response.data.id);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add domain');
      setGlobalLoading(false);
    },
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-light text-neutral-100 mb-2">Add Domain</h2>
        <p className="text-neutral-400 text-sm mb-4 sm:mb-6 font-light">Enter the domain you want to add to your project.</p>
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            value={domainName}
            onChange={(e) => {
              setDomainName(e.target.value);
              setValidationError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="example.com"
            className={`w-full px-4 py-2.5 bg-[#262626] border rounded-md text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 transition-all ${validationError ? 'border-red-500/50' : 'border-neutral-700'
              }`}
            autoFocus
          />
          {validationError && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} />
              {validationError}
            </p>
          )}
          <p className="text-xs text-neutral-500 mt-2">Examples: chocolate.com, myblog.net, shop.io</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#262626] hover:bg-[#404040] text-neutral-200 rounded-md font-light border border-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending || !domainName}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-md font-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Adding...' : 'Add Domain'}
          </button>
        </div>
      </div>
    </div>
  );
}
