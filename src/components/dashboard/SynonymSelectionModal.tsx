'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { domainsAPI } from '@/lib/dashboard';
import CustomLoader from '@/components/CustomLoader';

const MAX_SELECTIONS = 3;

export function SynonymSelectionModal({ domainId, onClose, onSuccess, setGlobalLoading }: any) {
  const [selectedMeanings, setSelectedMeanings] = useState<Array<{ key: string; context: string }>>([]);
  const [userDescription, setUserDescription] = useState('');

  const { data: synonymsData, isLoading, error } = useQuery({
    queryKey: ['synonyms', domainId],
    queryFn: async () => {
      const response = await domainsAPI.getSynonyms(domainId);
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { selectedMeaning?: string; userDescription?: string }) =>
      domainsAPI.update(domainId, data),
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
    const updateData: any = {};

    if (selectedMeanings.length > 0) {
      const combinedContext = selectedMeanings.map(({ key }) => key).join(', ');
      updateData.selectedMeaning = combinedContext;
    }

    if (userDescription.trim()) {
      updateData.userDescription = userDescription.trim();
    }

    if (Object.keys(updateData).length > 0) {
      console.log('📝 Saving context:', updateData);
      updateMutation.mutate(updateData);
    } else {
      onSuccess();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <CustomLoader />
            <p className="text-sm text-neutral-400">Let's get you ready with our recommended contexts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h2 className="text-xl font-light text-neutral-100 mb-4">Could not find meanings</h2>
          <p className="text-neutral-400 text-sm mb-6">
            We couldn't find different meanings for your domain. You can continue without context selection.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#262626] hover:bg-[#404040] text-neutral-200 rounded-md font-light border border-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-md font-light transition-colors"
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
  const hasMeanings = meaningEntries.length > 1;

  const handleMeaningToggle = (meaning: string, exampleSentence: string) => {
    const isSelected = selectedMeanings.some(m => m.key === meaning);

    if (isSelected) {
      setSelectedMeanings(prev => prev.filter(m => m.key !== meaning));
    } else {
      if (selectedMeanings.length < MAX_SELECTIONS) {
        setSelectedMeanings(prev => [...prev, { key: meaning, context: exampleSentence }]);
      } else {
        toast.error(`You can select up to ${MAX_SELECTIONS} contexts only`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-4 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
              {hasMeanings ? 'Choose Your Domain Context' : 'Describe Your Domain'}
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              {hasMeanings
                ? `"${synonymsData?.word}" can mean different things`
                : 'Help AI understand your website better'}
            </p>
          </div>
          {selectedMeanings.length > 0 && (
            <div className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-bold whitespace-nowrap bg-[#404040] text-neutral-100">
              {selectedMeanings.length}/{MAX_SELECTIONS}
            </div>
          )}
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-semibold text-neutral-300 mb-2">
            Describe your domain <span className="text-neutral-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            placeholder="E.g., A blog about chocolate recipes and baking tips..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#262626] border border-neutral-700 rounded-lg focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 resize-none text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-400 transition-colors"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-neutral-400 mt-1.5">{userDescription.length}/500 characters</p>
        </div>

        {hasMeanings && (
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-neutral-300 mb-2 sm:mb-3">
              Select contexts (up to {MAX_SELECTIONS}) or skip
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 p-3 sm:p-4 pt-12 bg-[#262626]/50 rounded-lg border border-neutral-700 min-h-[120px] relative">
              {meaningEntries.map(([meaning, exampleSentence]: [string, any]) => {
                const isSelected = selectedMeanings.some(m => m.key === meaning);
                const isDisabled = selectedMeanings.length >= MAX_SELECTIONS && !isSelected;
                return (
                  <div key={meaning} className="relative">
                    <button
                      onClick={() => handleMeaningToggle(meaning, exampleSentence)}
                      disabled={isDisabled}
                      className={`peer px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border transition-all duration-200 text-[10px] sm:text-xs font-bold whitespace-nowrap uppercase ${isSelected
                        ? 'bg-white border-white text-black scale-105'
                        : isDisabled
                          ? 'bg-[#262626] border-neutral-700 text-neutral-400 cursor-not-allowed opacity-50'
                          : 'bg-[#262626] border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:scale-105'
                        }`}
                    >
                      {isSelected && '✓ '}
                      {meaning}
                    </button>
                    <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] px-3 py-2.5 bg-[#404040] text-neutral-100 text-xs rounded-lg opacity-0 peer-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[60] shadow-xl min-w-max max-w-[280px] border border-neutral-600">
                      <div className="italic normal-case text-center leading-relaxed">"{exampleSentence}"</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-neutral-700"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="relative">
                <button
                  onClick={() => setSelectedMeanings([])}
                  className={`peer px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border transition-all duration-200 text-[10px] sm:text-xs font-bold whitespace-nowrap uppercase ${selectedMeanings.length === 0
                    ? 'bg-white border-white text-black scale-105'
                    : 'bg-[#262626] border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:scale-105'
                    }`}
                >
                  {selectedMeanings.length === 0 && '✓ '}
                  SKIP & LET AI DECIDE
                </button>
                <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] px-3 py-2.5 bg-[#404040] text-neutral-100 text-xs rounded-lg opacity-0 peer-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[60] shadow-xl whitespace-nowrap border border-neutral-600">
                  <div className="normal-case">Let AI decide based on general knowledge</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-neutral-700"></div>
                  </div>
                </div>
              </div>
            </div>
            {selectedMeanings.length > 0 && (
              <div className="mt-2 sm:mt-3">
                <p className="text-[10px] sm:text-xs font-light text-neutral-400 mb-1.5 sm:mb-2">Selected contexts:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedMeanings.map(({ key, context }) => (
                    <div
                      key={key}
                      title={`"${context}"`}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#404040] text-neutral-100 rounded-full text-[10px] sm:text-xs font-bold uppercase flex items-center gap-1 sm:gap-1.5 hover:bg-neutral-600 transition-colors"
                    >
                      {key}
                      <button
                        onClick={() => handleMeaningToggle(key, context)}
                        className="hover:bg-neutral-500 rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-[10px] sm:text-xs text-center text-neutral-400 border border-neutral-700 rounded-lg p-2 sm:p-3 mb-4 sm:mb-6 bg-[#262626]/30">
          💡 This context helps AI generate more relevant and personalized content for your website
        </div>

        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-neutral-600 text-neutral-300 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#262626] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={updateMutation.isPending}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-neutral-200 text-black rounded-lg text-sm sm:text-base font-semibold transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : `Continue ${selectedMeanings.length > 0 ? `(${selectedMeanings.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
