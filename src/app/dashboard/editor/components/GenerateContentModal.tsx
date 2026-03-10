'use client';

import { useState, useEffect } from 'react';
import { X, Plus, FileText, Loader2, ArrowRight, Sparkles, Check } from 'lucide-react';
import { domainsAPI } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GenerateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (type: string, quantity: number) => void;
  isGenerating: boolean;
  domainId: string;
}

export default function GenerateContentModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  domainId,
}: GenerateContentModalProps) {
  const [contentType, setContentType] = useState('blog');
  const [quantity, setQuantity] = useState(3);
  const [userDescription, setUserDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [savedKeywords, setSavedKeywords] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch domain data
  const { data: domainData } = useQuery({
    queryKey: ['domain', domainId],
    queryFn: async () => {
      const response = await domainsAPI.getOne(domainId);
      return response.data;
    },
    enabled: isOpen && !!domainId,
  });

  // Initialize fields when data loads
  useEffect(() => {
    if (domainData) {
      setUserDescription(domainData.userDescription || '');
      const savedKeywordsStr = domainData.selectedMeaning || '';
      setKeywords('');
      // Parse saved keywords into array
      if (savedKeywordsStr) {
        const keywordsArray = savedKeywordsStr.split(',').map((k: string) => k.trim()).filter(Boolean);
        setSavedKeywords(keywordsArray);
      } else {
        setSavedKeywords([]);
      }
    }
  }, [domainData]);

  // Handler to add keyword
  const handleAddKeyword = () => {
    if (keywords.trim()) {
      const newKeywords = keywords.split(',').map(k => k.trim()).filter(Boolean);
      setSavedKeywords(prev => [...prev, ...newKeywords]);
      setKeywords('');
    }
  };

  // Handler to remove keyword
  const handleRemoveKeyword = (keywordToRemove: string) => {
    setSavedKeywords(prev => prev.filter(k => k !== keywordToRemove));
  };

  // Handler to add keyword on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSaveContext = async () => {
    setIsSaving(true);
    try {
      await domainsAPI.update(domainId, {
        userDescription: userDescription.trim() || undefined,
        selectedMeaning: savedKeywords.join(', ') || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('Context updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update context');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = () => {
    onGenerate(contentType, quantity);
  };

  if (!isOpen) return null;

  const originalKeywords = domainData?.selectedMeaning || '';
  const currentKeywords = savedKeywords.join(', ');
  const hasChanges = 
    userDescription !== (domainData?.userDescription || '') ||
    currentKeywords !== originalKeywords;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative bg-[#0a0a0a] rounded-2xl shadow-2xl border border-neutral-700 max-w-5xl w-full p-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-xl shadow-md">
                    <Sparkles size={26} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-100">Generate Content</h2>
                    <p className="text-sm text-neutral-500 mt-0.5">Powered by AI</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isGenerating}
                  className="p-2.5 hover:bg-[#262626] rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={22} className="text-neutral-400" />
                </button>
              </div>

              {/* Modal - Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN - Prompt & Keywords */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100 mb-5">Context & Keywords</h3>
                    
                    {/* Domain Description */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-neutral-300 mb-2.5">
                        Domain Description
                      </label>
                      <textarea
                        value={userDescription}
                        onChange={(e) => setUserDescription(e.target.value)}
                        placeholder="Describe what your domain is about..."
                        className="w-full px-4 py-3 bg-[#262626] border-2 border-neutral-600 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 resize-none text-sm"
                        rows={5}
                        maxLength={500}
                      />
                      <p className="text-xs text-neutral-500 mt-2">
                        {userDescription.length}/500 characters
                      </p>
                    </div>

                    {/* Keywords Input */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-neutral-300 mb-2.5">
                        Keywords
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Add keywords..."
                          className="flex-1 px-4 py-3 bg-[#262626] border-2 border-neutral-600 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all placeholder:text-neutral-500"
                        />
                        <button
                          onClick={handleAddKeyword}
                          disabled={!keywords.trim()}
                          className="px-5 py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">
                        Press Enter or click Add to save keywords
                      </p>
                      
                      {/* Display Saved Keywords as Chips */}
                      {savedKeywords.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2 p-3 bg-[#262626] rounded-xl border border-neutral-600">
                            <AnimatePresence mode="popLayout">
                              {savedKeywords.map((keyword) => (
                                <motion.div
                                  key={keyword}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="px-3 py-1.5 bg-neutral-600 text-neutral-100 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-neutral-500 transition-colors"
                                >
                                  {keyword}
                                  <button
                                    onClick={() => handleRemoveKeyword(keyword)}
                                    className="hover:bg-neutral-400 rounded-full p-0.5"
                                  >
                                    <X size={12} />
                                  </button>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Save Context Button - Always visible */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveContext}
                      disabled={isSaving || !hasChanges}
                      className="w-full py-3 bg-white hover:bg-neutral-200 text-black rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Save Context
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* RIGHT COLUMN - Content Generation */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100 mb-5">Content Generation</h3>
                    
                    {/* Content Type Selection */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-neutral-300 mb-2.5">
                        Content Type
                      </label>
                      <div className="p-4 rounded-xl border-2 border-neutral-600 bg-[#262626]/50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-neutral-600">
                            <FileText size={22} className="text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-100">Blog Posts</div>
                            <div className="text-xs text-neutral-500">AI-generated articles with images</div>
                          </div>
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setQuantity(Math.max(1, Math.min(20, val)));
                          }}
                          disabled={isGenerating}
                          className="w-20 px-3 py-2 bg-[#262626] border-2 border-neutral-600 rounded-lg text-center text-sm font-semibold text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Actions - Side by Side */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        disabled={isGenerating}
                        className="flex-1 px-4 py-2.5 border border-neutral-600 text-neutral-300 rounded-xl font-medium text-sm hover:bg-[#262626] transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex-1 px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-xl font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            {/* <Plus size={16} /> */}
                            Generate Content
                            <ArrowRight size={16} />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
