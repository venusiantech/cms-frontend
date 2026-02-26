'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, Maximize2, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { websitesAPI } from '@/lib/dashboard';

const TEMPLATE_OPTIONS = [
  { key: 'modernNews' as const, label: 'Modern News', image: '/templateA/assets/images/modernNews.png' },
  { key: 'templateA' as const, label: 'Template A', image: '/templateA/assets/images/TemplateA.png' },
];

export function GenerateWebsiteModal({ domainId, onClose, onJobStarted, setGlobalLoading }: any) {
  const [contactFormEnabled, setContactFormEnabled] = useState(true);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<'modernNews' | 'templateA'>('modernNews');
  const [enlargedTemplateKey, setEnlargedTemplateKey] = useState<'modernNews' | 'templateA' | null>(null);

  const mutation = useMutation({
    mutationFn: () => websitesAPI.generate(domainId, selectedTemplateKey, contactFormEnabled),
    onSuccess: (response) => {
      const newJobId = response.data.jobId;
      console.log('✅ Job started with ID:', newJobId);
      toast.success('Website generation started! 🚀');

      onJobStarted(newJobId);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start generation');
    },
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl relative z-[61] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-light text-neutral-100 mb-2">Generate Website</h2>
        </div>

        <div className="mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm font-semibold text-neutral-200 mb-3 sm:mb-4">Choose template</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {TEMPLATE_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                className={`relative rounded-lg border overflow-hidden transition-all duration-200 flex flex-col ${selectedTemplateKey === opt.key
                  ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-neutral-900'
                  : 'border-neutral-700 hover:border-neutral-600'
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedTemplateKey(opt.key)}
                  disabled={mutation.isPending}
                  className="text-left disabled:opacity-60 disabled:cursor-not-allowed flex flex-col flex-1 min-w-0"
                >
                  <div className="w-full h-36 sm:h-44 bg-neutral-800 flex-shrink-0 relative">
                    <img
                      src={opt.image}
                      alt={opt.label}
                      className="w-full h-full object-cover object-top"
                    />
                    {selectedTemplateKey === opt.key && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-black sm:w-[14px] sm:h-[14px]" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-3 bg-neutral-800 border-t border-neutral-700 flex-shrink-0 flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-light text-neutral-100">{opt.label === 'Template A' ? 'Merinda Blog' : 'Modern News'}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEnlargedTemplateKey(opt.key);
                  }}
                  disabled={mutation.isPending}
                  className="absolute bottom-10 sm:bottom-12 right-1.5 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 flex items-center justify-center transition-colors disabled:opacity-50"
                  title="Preview full size"
                >
                  <Maximize2 size={14} className="text-neutral-300 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {enlargedTemplateKey && (() => {
          const opt = TEMPLATE_OPTIONS.find((o) => o.key === enlargedTemplateKey);
          if (!opt) return null;
          return (
            <div
              className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/80"
              onClick={() => setEnlargedTemplateKey(null)}
            >
              <div
                className="relative bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-neutral-700 bg-neutral-800">
                  <span className="font-light text-sm sm:text-base text-neutral-100">{opt.label}</span>
                  <button
                    type="button"
                    onClick={() => setEnlargedTemplateKey(null)}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                    aria-label="Close preview"
                  >
                    <X size={18} className="text-neutral-400 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="p-2 sm:p-4 overflow-auto flex-1 min-h-0 bg-neutral-800">
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className="w-full h-auto max-h-[75vh] object-contain object-top rounded-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-neutral-700 bg-neutral-900">
                  <button
                    type="button"
                    onClick={() => setEnlargedTemplateKey(null)}
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-neutral-600 text-neutral-300 text-xs sm:text-sm font-light hover:bg-neutral-800"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTemplateKey(opt.key);
                      setEnlargedTemplateKey(null);
                    }}
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white text-black text-xs sm:text-sm font-light hover:bg-neutral-200"
                  >
                    Use this template
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer">
            <span className="relative inline-block w-10 sm:w-11 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0">
              <input
                type="checkbox"
                checked={contactFormEnabled}
                onChange={(e) => setContactFormEnabled(e.target.checked)}
                disabled={mutation.isPending}
                className="absolute w-0 h-0 opacity-0 peer"
              />
              <span className="block rounded-full bg-neutral-600 peer-checked:bg-white h-6 transition-colors duration-200" />
              <span className="absolute left-0 top-0 h-6 w-6 bg-neutral-200 border border-neutral-500 rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-[18px] sm:peer-checked:translate-x-5 peer-checked:bg-white peer-checked:border-neutral-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-light text-neutral-100 text-xs sm:text-sm mb-1">Enable Contact Form</p>
              <p className="text-xs text-neutral-400">Allow visitors to contact you through your website</p>
            </div>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-xs sm:text-sm font-light border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-white hover:bg-neutral-200 text-black rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-light flex items-center justify-center gap-2 transition-colors"
          >
            {mutation.isPending ? (
              <>
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-neutral-400/30 border-t-neutral-600 rounded-full animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Sparkles size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Generate Website</span>
                <span className="xs:hidden">Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
