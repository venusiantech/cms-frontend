'use client';

import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, X, Instagram, Facebook, Twitter, Layout, Megaphone, MessageSquare, Share2, ArrowLeft, Globe, Mail, Phone, Loader2, Save, BarChart3, ImageIcon, Trash2, Upload } from 'lucide-react';
import { websitesAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import CustomLoader from '@/components/CustomLoader';

interface SettingsTabProps {
  domain: any;
  domainId: string;
  queryClient: any;
}

type SettingCategory = 'templates' | 'ads' | 'contact' | 'social' | 'metadata' | 'analytics' | 'logo' | null;

export default function SettingsTab({ domain, domainId, queryClient }: SettingsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<SettingCategory>(null);

  // Logo state
  const [logoPreview, setLogoPreview] = useState<string | null>(domain.website.websiteLogo || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);
  const [logoDisplayMode, setLogoDisplayMode] = useState<'logo_only' | 'text_only' | 'both'>(
    domain.website.logoDisplayMode || 'logo_only'
  );
  const [isSavingMode, setIsSavingMode] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(domain.website.templateKey);
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<any>(null);

  // Social Media State
  const [instagramUrl, setInstagramUrl] = useState(domain.website.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(domain.website.facebookUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(domain.website.twitterUrl || '');
  const [isUpdatingSocial, setIsUpdatingSocial] = useState(false);

  // Contact Info State
  const [contactEmail, setContactEmail] = useState(domain.website.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(domain.website.contactPhone || '');
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);

  // Metadata State
  const [metaTitle, setMetaTitle] = useState(domain.website.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(domain.website.metaDescription || '');
  const [metaImage, setMetaImage] = useState(domain.website.metaImage || '');
  const [metaKeywords, setMetaKeywords] = useState(domain.website.metaKeywords || '');
  const [metaAuthor, setMetaAuthor] = useState(domain.website.metaAuthor || '');
  const [isUpdatingMetadata, setIsUpdatingMetadata] = useState(false);

  // Google Analytics State
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(domain.website.googleAnalyticsId || '');
  const [isUpdatingAnalytics, setIsUpdatingAnalytics] = useState(false);

  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await websitesAPI.uploadLogo(domain.website.id, file);
      const newUrl = res.data.websiteLogo;
      setLogoPreview(newUrl);
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('Logo uploaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleLogoDelete = async () => {
    setIsDeletingLogo(true);
    try {
      await websitesAPI.deleteLogo(domain.website.id);
      setLogoPreview(null);
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('Logo removed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove logo');
    } finally {
      setIsDeletingLogo(false);
    }
  };

  const settingCategories = [
    {
      id: 'logo' as SettingCategory,
      name: 'Logo',
      description: 'Upload your website logo',
      icon: ImageIcon,
      color: 'bg-[#262626] text-neutral-100',
    },
    {
      id: 'templates' as SettingCategory,
      name: 'Templates',
      description: 'Choose website design',
      icon: Layout,
      color: 'bg-[#262626] text-neutral-100',
    },
    {
      id: 'metadata' as SettingCategory,
      name: 'Metadata',
      description: 'SEO & social sharing',
      icon: Globe,
      color: 'bg-[#262626] text-neutral-100',
    },
    {
      id: 'ads' as SettingCategory,
      name: 'Ads Settings',
      description: 'Manage advertisements',
      icon: Megaphone,
      color: 'bg-[#262626] text-neutral-100',
    },
    {
      id: 'contact' as SettingCategory,
      name: 'Contact Form',
      description: 'Toggle contact form',
      icon: MessageSquare,
      color: 'bg-[#262626] text-neutral-100',
    },
    {
      id: 'social' as SettingCategory,
      name: 'Social Media',
      description: 'Add social links',
      icon: Share2,
      color: 'bg-[#262626] text-neutral-100',
    },
    {
      id: 'analytics' as SettingCategory,
      name: 'Analytics',
      description: 'Google Analytics tracking',
      icon: BarChart3,
      color: 'bg-[#262626] text-neutral-100',
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
        metaKeywords: metaKeywords.trim() || undefined,
        metaAuthor: metaAuthor.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      toast.success('SEO metadata updated successfully! 🎉');
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
                className="bg-[#0a0a0a] border-1 border-neutral-700 rounded-xl p-6 hover:shadow-lg hover:border-neutral-600 transition-all duration-200 text-center group"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={32} />
                </div>
                <h3 className="font-medium text-neutral-100 text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-neutral-400">{category.description}</p>
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
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-100 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="">Back to Settings</span>
      </button>

      <div className="">
        {/* Logo Upload */}
        {selectedCategory === 'logo' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg text-neutral-100 mb-1">Website Logo</h3>
              <p className="text-sm text-neutral-400">Upload a logo to display in the header of your website. Replaces the domain name text.</p>
            </div>

            <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5 space-y-5">
              {/* Current logo preview */}
              {logoPreview ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="border border-neutral-700 rounded-lg p-4 bg-[#262626] w-full flex items-center justify-center" style={{ minHeight: '120px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview}
                      alt="Website logo"
                      className="max-h-24 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-[#262626] transition-colors text-sm  disabled:opacity-50"
                    >
                      {isUploadingLogo ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      Replace Logo
                    </button>
                    <button
                      onClick={handleLogoDelete}
                      disabled={isDeletingLogo}
                      className="flex items-center gap-2 px-4 py-2.5 border border-red-700/50 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors text-sm  disabled:opacity-50"
                    >
                      {isDeletingLogo ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-600 rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-neutral-500 hover:bg-[#262626] transition-all"
                >
                  {isUploadingLogo ? (
                    <>
                      <Loader2 size={32} className="animate-spin text-neutral-400" />
                      <p className="text-sm text-neutral-400">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-[#262626] rounded-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-neutral-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-neutral-300">Click to upload logo</p>
                        <p className="text-xs text-neutral-400 mt-1">PNG, JPG, SVG or WebP — max 5 MB</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleLogoUpload(file);
                    e.target.value = '';
                  }
                }}
              />

              {/* Display mode radio buttons */}
              <div className="border-t border-neutral-700 pt-4">
                <p className="text-sm font-medium text-neutral-100 mb-3">Header Display</p>
                <div className="space-y-2">
                  {([
                    { value: 'logo_only', label: 'Logo only', desc: 'Show only the logo image' },
                    { value: 'text_only', label: 'Text only', desc: 'Show only the site name text' },
                    { value: 'both',      label: 'Both',      desc: 'Show logo and site name together' },
                  ] as const).map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        logoDisplayMode === opt.value
                          ? 'border-neutral-400 bg-[#262626]'
                          : 'border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="logoDisplayMode"
                        value={opt.value}
                        checked={logoDisplayMode === opt.value}
                        onChange={() => setLogoDisplayMode(opt.value)}
                        className="mt-0.5 accent-neutral-400"
                      />
                      <div>
                        <p className="text-sm font-light text-neutral-100">{opt.label}</p>
                        <p className="text-xs font-light text-neutral-400">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    setIsSavingMode(true);
                    try {
                      await websitesAPI.updateLogoDisplayMode(domain.website.id, logoDisplayMode);
                      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
                      toast.success('Display mode updated!');
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to update display mode');
                    } finally {
                      setIsSavingMode(false);
                    }
                  }}
                  disabled={isSavingMode}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-lg text-sm  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingMode ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSavingMode ? 'Saving...' : 'Save Display Mode'}
                </button>
              </div>

              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
                <p className="text-xs font-light text-blue-200">
                  💡 <strong>Tip:</strong> Use a transparent PNG or SVG for the best results. Recommended dimensions: at least 200px wide, up to 400px.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Template Selection */}
        {selectedCategory === 'templates' && (
          <>
            <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-4 sm:p-5">
              <div className="mb-4">
                <p className="font-medium text-neutral-100 mb-1">Website Template</p>
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
                        ? 'border-neutral-400 ring-2 ring-neutral-400'
                        : 'border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    {/* Preview Image */}
                    <div className="aspect-video bg-[#262626] relative">
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-full object-fill"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400/6366f1/white?text=' + encodeURIComponent(template.name);
                        }}
                      />
                      {selectedTemplate === template.key && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-neutral-600 text-neutral-100 text-xs  rounded">
                          Active
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm ">
                          View Details
                        </span>
                      </div>
                    </div>
                    
                    {/* Template Name */}
                    <div className="p-3 bg-[#262626]">
                      <h4 className=" text-neutral-100 text-sm text-center">{template.name}</h4>
                    </div>
                  </button>
                ))}
              </div>
            )}
            </div>

            {/* Template Details Modal */}
            {showTemplateModal && selectedTemplateDetails && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-[#0a0a0a] rounded-xl border border-neutral-700 max-w-7xl w-full shadow-2xl animate-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-[#0a0a0a] border-b border-neutral-700">
                <div>
                  <h3 className="text-lg sm:text-2xl font-medium text-neutral-100">{selectedTemplateDetails.name}</h3>
                  {selectedTemplate === selectedTemplateDetails.key && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-600 mt-1 ">
                      <CheckCircle2 size={14} />
                      Currently Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 hover:bg-[#262626] rounded-full transition-colors"
                >
                  <X size={22} className="text-neutral-400" />
                </button>
              </div>

              {/* Modal Content - Side by Side Layout on desktop, stacked on mobile */}
              <div className="flex flex-col lg:flex-row overflow-auto" style={{ minHeight: '400px', maxHeight: '650px' }}>
                {/* Left: Preview Image + Other Templates */}
                <div className="flex-1 bg-[#262626] p-4 sm:p-6 flex flex-col gap-3">
                  {/* Main Preview - Takes most space */}
                  <div className="rounded-lg overflow-hidden bg-[#262626] shadow-sm" style={{ minHeight: '300px', height: 'calc(100% - 100px)' }}>
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
                            className="rounded-md overflow-hidden border-2 border-neutral-700 hover:border-neutral-400 transition-all duration-200 bg-[#262626] hover:shadow-md flex-shrink-0"
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
                            <div className="px-2 py-1 bg-[#262626]">
                              <p className="text-xs  text-neutral-100 text-center truncate">{template.name}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Right: Template Details */}
                <div className="w-full lg:w-96 flex flex-col bg-[#0a0a0a]">
                  <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
                    {/* Description */}
                    <div>
                      <h4 className="text-base font-medium text-neutral-100 mb-3">About This Template</h4>
                      <p className="text-sm text-neutral-400 leading-relaxed">{selectedTemplateDetails.description}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-base font-medium text-neutral-100 mb-4">Features</h4>
                      <div className="space-y-3">
                        {selectedTemplateDetails.features.map((feature: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            </div>
                            <span className="text-sm text-neutral-300 leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-neutral-700 bg-[#262626]">
                    <button
                      onClick={handleTemplateSelect}
                      disabled={isUpdatingTemplate || selectedTemplate === selectedTemplateDetails.key}
                      className={`w-full px-6 py-3 rounded-lg transition-all duration-200  shadow-sm ${
                        selectedTemplate === selectedTemplateDetails.key
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-white hover:bg-neutral-200 text-black disabled:opacity-50 disabled:cursor-not-allowed'
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
          <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5">
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
                className="w-5 h-5 text-neutral-100 rounded mt-0.5 focus:ring-2 focus:ring-neutral-500"
              />
              <div>
                <p className="font-medium text-neutral-100 mb-1">Enable Ads</p>
                <p className="text-sm text-neutral-400">Show advertisements on your website</p>
              </div>
              </label>
              {domain.website.adsApproved ? (
                <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs  border border-green-700/50">
                  Approved
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-xs  border border-yellow-700/50">
                  Pending
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact Form Setting */}
        {selectedCategory === 'contact' && (
          <div className="space-y-6">
            {/* Toggle Contact Form */}
            <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5">
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
                  className="w-5 h-5 text-neutral-100 rounded mt-0.5 focus:ring-2 focus:ring-neutral-500"
                />
                <div>
                  <p className="font-medium text-neutral-100 mb-1">Enable Contact Form</p>
                  <p className="text-sm text-neutral-400">Show "Contact Us" link in your website</p>
                </div>
              </label>
            </div>

            {/* Contact Information */}
            <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5">
              <div className="mb-4">
                <p className="font-medium text-neutral-100 mb-1">Contact Information</p>
                <p className="text-sm text-neutral-400">Add your contact details to display on your website</p>
              </div>

              <div className="space-y-4">
                {/* Contact Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm  text-neutral-300 mb-2">
                    <Mail size={18} className="text-neutral-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm  text-neutral-300 mb-2">
                    <Phone size={18} className="text-neutral-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={async () => {
                  setIsUpdatingContact(true);
                  try {
                    await websitesAPI.updateContactInfo(domain.website.id, {
                      contactEmail: contactEmail || undefined,
                      contactPhone: contactPhone || undefined,
                    });
                    queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
                    toast.success('Contact information updated successfully');
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to update contact information');
                  } finally {
                    setIsUpdatingContact(false);
                  }
                }}
                disabled={isUpdatingContact}
                className="w-full mt-4 px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdatingContact ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Contact Info
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Social Media Links */}
        {selectedCategory === 'social' && (
          <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5">
            <div className="mb-4">
              <p className="font-medium text-neutral-100 mb-1">Social Media Links</p>
              <p className="text-sm text-neutral-400">Add your social media profiles to appear in your website footer</p>
            </div>

            <div className="space-y-4">
              {/* Instagram */}
              <div>
                <label className="flex items-center gap-2 text-sm  text-neutral-300 mb-2">
                  <Instagram size={18} className="text-pink-500" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="flex items-center gap-2 text-sm  text-neutral-300 mb-2">
                  <Facebook size={18} className="text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="flex items-center gap-2 text-sm  text-neutral-300 mb-2">
                  <Twitter size={18} className="text-sky-500" />
                  Twitter / X
                </label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSocialMediaUpdate}
                disabled={isUpdatingSocial}
                className="w-full px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-lg  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-100 mb-1">SEO & Social Sharing Settings</h3>
              <p className="text-sm text-neutral-400">Optimize your website for search engines and social media platforms</p>
            </div>

            <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5">
              <div className="space-y-5">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm  text-neutral-300 mb-2">
                    SEO Title *
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={`${domain.domainName.split('.')[0].charAt(0).toUpperCase() + domain.domainName.split('.')[0].slice(1)} - Your Source for Quality Content`}
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-neutral-400">
                      Appears in search results and browser tabs (50-60 characters recommended)
                    </p>
                    <span className={`text-xs  ${
                      metaTitle.length > 60 ? 'text-red-600' : 'text-neutral-400'
                    }`}>
                      {metaTitle.length}/60
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm  text-neutral-300 mb-2">
                    SEO Description *
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Discover amazing content. Your trusted source for news, insights, and updates."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-neutral-400">
                      Brief description shown in search results and social media
                    </p>
                    <span className={`text-xs  ${
                      metaDescription.length > 160 ? 'text-red-600' : 'text-neutral-400'
                    }`}>
                      {metaDescription.length}/160
                    </span>
                  </div>
                </div>

                {/* Meta Image */}
                <div>
                  <label className="block text-sm  text-neutral-300 mb-2">
                    Preview Image URL *
                  </label>
                  <input
                    type="url"
                    value={metaImage}
                    onChange={(e) => setMetaImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-neutral-400 mt-1.5">
                    Image shown in social media previews (1200x630px recommended for best results)
                  </p>
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-sm  text-neutral-300 mb-2">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-neutral-400 mt-1.5">
                    Comma-separated keywords that describe your website content (helps with SEO)
                  </p>
                </div>

                {/* Meta Author */}
                <div>
                  <label className="block text-sm  text-neutral-300 mb-2">
                    Author / Owner Name
                  </label>
                  <input
                    type="text"
                    value={metaAuthor}
                    onChange={(e) => setMetaAuthor(e.target.value)}
                    placeholder="Your Name or Company Name"
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-neutral-400 mt-1.5">
                    Website owner or author name (appears in search results and metadata)
                  </p>
                </div>

                {/* Social Media Preview Card */}
                {(metaTitle || metaDescription || metaImage) && (
                  <div className="pt-4 border-t border-neutral-700">
                    <p className="text-xs  text-neutral-300 mb-3">How it will look when shared:</p>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden bg-[#262626] shadow-sm">
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
                        <p className="text-xs text-neutral-400 mb-1">{domain.domainName}</p>
                        <h4 className="font-medium text-neutral-100 mb-1 line-clamp-2">
                          {metaTitle || `${domain.domainName.split('.')[0].charAt(0).toUpperCase() + domain.domainName.split('.')[0].slice(1)}`}
                        </h4>
                        <p className="text-sm text-neutral-400 line-clamp-2">
                          {metaDescription || 'Discover amazing content'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    onClick={handleMetadataUpdate}
                    disabled={isUpdatingMetadata}
                    className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed  text-sm shadow-sm"
                  >
                    {isUpdatingMetadata ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </span>
                    ) : (
                      'Update SEO Metadata'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Tips */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-5">
              <h4 className="text-sm font-medium text-blue-200 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                SEO Best Practices
              </h4>
              <ul className="space-y-2 text-sm text-blue-200/90">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span><strong>Title:</strong> Keep it under 60 characters, include main keywords</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span><strong>Description:</strong> 150-160 characters, compelling and descriptive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span><strong>Image:</strong> Use high-quality images (1200x630px for social media)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span><strong>Keywords:</strong> Choose 5-10 relevant keywords that match your content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Robots.txt:</strong> Automatically generated at <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">{domain.domainName}/robots.txt</code></span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Google Analytics Settings */}
        {selectedCategory === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-100 mb-1">Google Analytics Tracking</h3>
              <p className="text-sm text-neutral-400">Add Google Analytics to track your website visitors and behavior</p>
            </div>

            <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-5">
              <div className="space-y-5">
                {/* Google Analytics ID */}
                <div>
                  <label className="flex items-center gap-2 text-sm  text-neutral-300 mb-2">
                    <BarChart3 size={18} className="text-orange-500" />
                    Google Analytics Measurement ID
                  </label>
                  <input
                    type="text"
                    value={googleAnalyticsId}
                    onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-2.5 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-sm font-mono"
                  />
                  <p className="text-xs text-neutral-400 mt-1.5">
                    Enter your Google Analytics 4 (GA4) measurement ID (format: G-XXXXXXXXXX)
                  </p>
                </div>

                {/* Current Status */}
                {googleAnalyticsId && (
                  <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-200">Google Analytics Enabled</p>
                        <p className="text-xs text-green-300/90 mt-1">
                          Tracking ID: <code className="bg-[#262626] px-2 py-0.5 rounded font-mono text-neutral-200">{googleAnalyticsId}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={async () => {
                    setIsUpdatingAnalytics(true);
                    try {
                      await websitesAPI.updateGoogleAnalytics(domain.website.id, {
                        googleAnalyticsId: googleAnalyticsId || undefined,
                      });
                      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
                      toast.success('Google Analytics settings updated successfully');
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to update Google Analytics settings');
                    } finally {
                      setIsUpdatingAnalytics(false);
                    }
                  }}
                  disabled={isUpdatingAnalytics}
                  className="w-full px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdatingAnalytics ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Analytics Settings
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <h4 className="text-sm font-medium text-orange-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                How to Get Your Google Analytics ID
              </h4>
              <ol className="space-y-2 text-sm text-orange-800 list-decimal list-inside">
                <li>Visit <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline ">Google Analytics</a></li>
                <li>Sign in with your Google account</li>
                <li>Create a new property (or use existing)</li>
                <li>Select <strong>Web</strong> as the platform</li>
                <li>Copy the <strong>Measurement ID</strong> (starts with G-)</li>
                <li>Paste it above and click Save</li>
              </ol>
              <div className="mt-4 pt-4 border-t border-orange-300">
                <p className="text-xs text-orange-700">
                  <strong>Note:</strong> It may take 24-48 hours for data to start appearing in Google Analytics after setup.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
