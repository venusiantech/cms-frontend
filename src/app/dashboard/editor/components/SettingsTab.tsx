'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, X, Instagram, Facebook, Twitter, Layout, Megaphone, MessageSquare, Share2, ArrowLeft, Globe } from 'lucide-react';
import { websitesAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import CustomLoader from '@/components/CustomLoader';

interface SettingsTabProps {
  domain: any;
  domainId: string;
  queryClient: any;
}

type SettingCategory = 'templates' | 'ads' | 'contact' | 'social' | 'metadata' | null;

export default function SettingsTab({ domain, domainId, queryClient }: SettingsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<SettingCategory>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(domain.website.templateKey);
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<any>(null);

  // Social Media State
  const [instagramUrl, setInstagramUrl] = useState(domain.website.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(domain.website.facebookUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(domain.website.twitterUrl || '');
  const [isUpdatingSocial, setIsUpdatingSocial] = useState(false);

  // Metadata State
  const [metaTitle, setMetaTitle] = useState(domain.website.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(domain.website.metaDescription || '');
  const [metaImage, setMetaImage] = useState(domain.website.metaImage || '');
  const [isUpdatingMetadata, setIsUpdatingMetadata] = useState(false);

  const settingCategories = [
    {
      id: 'templates' as SettingCategory,
      name: 'Templates',
      description: 'Choose website design',
      icon: Layout,
      color: 'bg-gray-100 text-[#111827]',
    },
    {
      id: 'metadata' as SettingCategory,
      name: 'Metadata',
      description: 'SEO & social sharing',
      icon: Globe,
      color: 'bg-gray-100 text-[#111827]',
    },
    {
      id: 'ads' as SettingCategory,
      name: 'Ads Settings',
      description: 'Manage advertisements',
      icon: Megaphone,
      color: 'bg-gray-100 text-[#111827]',
    },
    {
      id: 'contact' as SettingCategory,
      name: 'Contact Form',
      description: 'Toggle contact form',
      icon: MessageSquare,
      color: 'bg-gray-100 text-[#111827]',
    },
    {
      id: 'social' as SettingCategory,
      name: 'Social Media',
      description: 'Add social links',
      icon: Share2,
      color: 'bg-gray-100 text-[#111827]',
    },
  ];

  // Fetch available templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await websitesAPI.getTemplates();
      return response.data;
    },
  });

  const handleTemplateClick = (template: any) => {
    setSelectedTemplateDetails(template);
    setShowTemplateModal(true);
  };

  const handleTemplateSelect = async () => {
    if (!selectedTemplateDetails || selectedTemplateDetails.key === selectedTemplate) {
      setShowTemplateModal(false);
      return;
    }

    setIsUpdatingTemplate(true);
    try {
      await websitesAPI.updateTemplate(domain.website.id, { templateKey: selectedTemplateDetails.key });
      setSelectedTemplate(selectedTemplateDetails.key);
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('Template updated successfully! 🎨');
      setShowTemplateModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update template');
    } finally {
      setIsUpdatingTemplate(false);
    }
  };

  const handleSocialMediaUpdate = async () => {
    setIsUpdatingSocial(true);
    try {
      await websitesAPI.updateSocialMedia(domain.website.id, {
        instagramUrl: instagramUrl.trim() || undefined,
        facebookUrl: facebookUrl.trim() || undefined,
        twitterUrl: twitterUrl.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('Social media links updated successfully! 🎉');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update social media links');
    } finally {
      setIsUpdatingSocial(false);
    }
  };

  const handleMetadataUpdate = async () => {
    setIsUpdatingMetadata(true);
    try {
      await websitesAPI.updateMetadata(domain.website.id, {
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        metaImage: metaImage.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('Website metadata updated! 🎉');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update metadata');
    } finally {
      setIsUpdatingMetadata(false);
    }
  };

  // If no category selected, show grid
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {settingCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#111827] transition-all duration-200 text-center group"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Category-specific content
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setSelectedCategory(null)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Settings</span>
      </button>

      <div className="">
        {/* Template Selection */}
        {selectedCategory === 'templates' && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="mb-4">
                <p className="font-semibold text-gray-900 mb-1">Website Template</p>
              </div>

              {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <CustomLoader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates?.map((template: any) => (
                  <button
                    key={template.key}
                    onClick={() => handleTemplateClick(template)}
                    className={`group relative border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedTemplate === template.key
                        ? 'border-gray-900 ring-2 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {/* Preview Image */}
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-full object-fill"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400/6366f1/white?text=' + encodeURIComponent(template.name);
                        }}
                      />
                      {selectedTemplate === template.key && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">
                          Active
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          View Details
                        </span>
                      </div>
                    </div>
                    
                    {/* Template Name */}
                    <div className="p-3 bg-white">
                      <h4 className="font-medium text-gray-900 text-sm text-center">{template.name}</h4>
                    </div>
                  </button>
                ))}
              </div>
            )}
            </div>

            {/* Template Details Modal */}
            {showTemplateModal && selectedTemplateDetails && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-7xl w-full shadow-2xl animate-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-white border-b border-gray-100">
                <div>
                  <h3 className="text-lg sm:text-2xl font-semibold text-gray-900">{selectedTemplateDetails.name}</h3>
                  {selectedTemplate === selectedTemplateDetails.key && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-600 mt-1 font-medium">
                      <CheckCircle2 size={14} />
                      Currently Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={22} className="text-gray-400" />
                </button>
              </div>

              {/* Modal Content - Side by Side Layout on desktop, stacked on mobile */}
              <div className="flex flex-col lg:flex-row overflow-auto" style={{ minHeight: '400px', maxHeight: '650px' }}>
                {/* Left: Preview Image + Other Templates */}
                <div className="flex-1 bg-gray-50 p-4 sm:p-6 flex flex-col gap-3">
                  {/* Main Preview - Takes most space */}
                  <div className="rounded-lg overflow-hidden bg-white shadow-sm" style={{ minHeight: '300px', height: 'calc(100% - 100px)' }}>
                    <img
                      src={selectedTemplateDetails.previewImage}
                      alt={selectedTemplateDetails.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/800x600/6366f1/white?text=' + encodeURIComponent(selectedTemplateDetails.name);
                      }}
                    />
                  </div>

                  {/* Other Templates Thumbnails - Small strip at bottom */}
                  {templates && templates.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2" style={{ minHeight: '85px' }}>
                      {templates
                        ?.filter((t: any) => t.key !== selectedTemplateDetails.key)
                        .map((template: any) => (
                          <button
                            key={template.key}
                            onClick={() => setSelectedTemplateDetails(template)}
                            className="rounded-md overflow-hidden border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 bg-white hover:shadow-md flex-shrink-0"
                            style={{ width: '120px' }}
                          >
                            <div style={{ height: '60px' }}>
                              <img
                                src={template.previewImage}
                                alt={template.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://placehold.co/400x300/6366f1/white?text=' + encodeURIComponent(template.name);
                                }}
                              />
                            </div>
                            <div className="px-2 py-1 bg-white">
                              <p className="text-xs font-medium text-gray-900 text-center truncate">{template.name}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Right: Template Details */}
                <div className="w-full lg:w-96 flex flex-col bg-white">
                  <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
                    {/* Description */}
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-3">About This Template</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{selectedTemplateDetails.description}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-4">Features</h4>
                      <div className="space-y-3">
                        {selectedTemplateDetails.features.map((feature: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            </div>
                            <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={handleTemplateSelect}
                      disabled={isUpdatingTemplate || selectedTemplate === selectedTemplateDetails.key}
                      className={`w-full px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm ${
                        selectedTemplate === selectedTemplateDetails.key
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isUpdatingTemplate ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Applying...
                        </span>
                      ) : selectedTemplate === selectedTemplateDetails.key ? (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle2 size={18} />
                          Already Selected
                        </span>
                      ) : (
                        'Select Template'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
              </div>
            )}
          </>
        )}

        {/* Ads Setting */}
        {selectedCategory === 'ads' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <label className="flex items-start gap-3 cursor-pointer flex-1">
              <input
                  type="checkbox"
                checked={domain.website.adsEnabled}
                onChange={async (e) => {
                  const newValue = e.target.checked;
                  try {
                    await websitesAPI.updateAds(domain.website.id, {
                      adsEnabled: newValue,
                    });
                    queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
                    toast.success(newValue ? 'Ads enabled' : 'Ads disabled');
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to update ads settings');
                  }
                }}
                className="w-5 h-5 text-gray-900 rounded mt-0.5 focus:ring-2 focus:ring-gray-900"
              />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Enable Ads</p>
                <p className="text-sm text-gray-600">Show advertisements on your website</p>
              </div>
              </label>
              {domain.website.adsApproved ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Approved
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Pending
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact Form Setting */}
        {selectedCategory === 'contact' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={domain.website.contactFormEnabled}
                onChange={async (e) => {
                  const newValue = e.target.checked;
                  try {
                    await websitesAPI.updateContactForm(domain.website.id, {
                      contactFormEnabled: newValue,
                    });
                    queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
                    toast.success(newValue ? 'Contact form enabled' : 'Contact form disabled');
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to update contact form settings');
                  }
                }}
                className="w-5 h-5 text-gray-900 rounded mt-0.5 focus:ring-2 focus:ring-gray-900"
              />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Enable Contact Form</p>
                <p className="text-sm text-gray-600">Show "Contact Us" link in your website</p>
              </div>
            </label>
          </div>
        )}

        {/* Social Media Links */}
        {selectedCategory === 'social' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="mb-4">
              <p className="font-semibold text-gray-900 mb-1">Social Media Links</p>
              <p className="text-sm text-gray-600">Add your social media profiles to appear in your website footer</p>
            </div>

            <div className="space-y-4">
              {/* Instagram */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Instagram size={18} className="text-pink-500" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Facebook size={18} className="text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Twitter size={18} className="text-sky-500" />
                  Twitter / X
                </label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSocialMediaUpdate}
                disabled={isUpdatingSocial}
                className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingSocial ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  'Save Social Media Links'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Metadata Settings */}
        {selectedCategory === 'metadata' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-5">
              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={`${domain.domainName.split('.')[0].charAt(0).toUpperCase() + domain.domainName.split('.')[0].slice(1)} - Your Source for Quality Content`}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  This appears as the title when your website is shared (50-60 characters recommended)
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Discover amazing content. Your trusted source for news, insights, and updates."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
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
                  Preview Image URL
                </label>
                <input
                  type="url"
                  value={metaImage}
                  onChange={(e) => setMetaImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Image shown in social media previews (1200x630px recommended)
                </p>
              </div>

              {/* Social Media Preview Card */}
              {(metaTitle || metaDescription || metaImage) && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-3">Preview:</p>
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

              {/* Save Button */}
              <button
                onClick={handleMetadataUpdate}
                disabled={isUpdatingMetadata}
                className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}
      </div>
    </div>
  );
}
