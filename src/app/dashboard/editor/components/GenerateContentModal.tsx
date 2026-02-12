'use client';

import { useState } from 'react';
import { X, Plus, FileText, Loader2 } from 'lucide-react';

interface GenerateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (type: string, quantity: number) => void;
  isGenerating: boolean;
}

export default function GenerateContentModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: GenerateContentModalProps) {
  const [contentType, setContentType] = useState('blog');
  const [quantity, setQuantity] = useState(3);

  if (!isOpen) return null;

  const handleGenerate = () => {
    onGenerate(contentType, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Plus size={20} className="text-gray-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Generate Content</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-5">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Content Type
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setContentType('blog')}
                  disabled={isGenerating}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                    contentType === 'blog'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className={`p-2 rounded-lg ${contentType === 'blog' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <FileText size={20} className={contentType === 'blog' ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Blog Posts</div>
                    <div className="text-xs text-gray-500">AI-generated articles with images</div>
                  </div>
                </button>

                {/* Future content types can be added here */}
                {/* <button className="w-full p-4 rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Image size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-400">Gallery Images</div>
                      <div className="text-xs text-gray-400">Coming soon</div>
                    </div>
                  </div>
                </button> */}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How many would you like to generate?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuantity(num)}
                    disabled={isGenerating}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      quantity === num
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="mt-3">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50"
                  placeholder="Or enter custom number (1-20)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Estimated cost: ${(quantity * 0.08).toFixed(2)} (approx. $0.08 per blog)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Generate {quantity} {contentType}(s)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
