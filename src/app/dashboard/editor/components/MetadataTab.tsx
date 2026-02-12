'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { websitesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface MetadataTabProps {
  domain: any;
  domainId: string;
  queryClient: any;
}

export default function MetadataTab({ domain, domainId, queryClient }: MetadataTabProps) {
  const [metaTitle, setMetaTitle] = useState(domain.website.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(domain.website.metaDescription || '');
  const [metaImage, setMetaImage] = useState(domain.website.metaImage || '');
  const [isUpdatingMetadata, setIsUpdatingMetadata] = useState(false);

  const handleMetadataUpdate = async () => {
    setIsUpdatingMetadata(true);
    try {
      await websitesAPI.updateMetadata(domain.website.id, {
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaImage: metaImage || null,
      });
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('Website metadata updated! 🎉');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update metadata');
    } finally {
      setIsUpdatingMetadata(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Social Sharing Preview</h3>
        <p className="text-sm text-gray-600">Customize how your website appears when shared on social media and messaging apps</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="space-y-5">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website Title *
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={`${domain.domainName.split('.')[0].charAt(0).toUpperCase() + domain.domainName.split('.')[0].slice(1)} - Your Source for Quality Content`}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              This appears as the title when your website is shared (50-60 characters recommended)
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website Description *
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Discover amazing content. Your trusted source for news, insights, and updates."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-gray-500">
                Brief description shown in social media previews
              </p>
              <span className={`text-xs font-medium ${
                metaDescription.length > 160 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {metaDescription.length}/160
              </span>
            </div>
          </div>

          {/* Meta Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview Image URL *
            </label>
            <input
              type="url"
              value={metaImage}
              onChange={(e) => setMetaImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Image shown in social media previews (1200x630px recommended for best results)
            </p>
            
          </div>

          {/* Social Media Preview Card */}
          {(metaTitle || metaDescription || metaImage) && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-3">How it will look when shared:</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                {metaImage && (
                  <img
                    src={metaImage}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{domain.domainName}</p>
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {metaTitle || `${domain.domainName.split('.')[0].charAt(0).toUpperCase() + domain.domainName.split('.')[0].slice(1)}`}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {metaDescription || 'Discover amazing content'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Update Button */}
          <div className="pt-2">
            <button
              onClick={handleMetadataUpdate}
              disabled={isUpdatingMetadata}
              className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
            >
              {isUpdatingMetadata ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                'Update Metadata'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
