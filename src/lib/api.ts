import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API Functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
};

export const domainsAPI = {
  getAll: () => api.get('/domains'),
  getOne: (id: string) => api.get(`/domains/${id}`),
  create: (domainName: string) => api.post('/domains', { domainName }),
  update: (id: string, data: any) => api.put(`/domains/${id}`, data),
  delete: (id: string) => api.delete(`/domains/${id}`),
  getSynonyms: (id: string) => api.get(`/domains/${id}/synonyms`),
  checkDnsStatus: (id: string) => api.get(`/domains/${id}/dns-status`),
  deployWorkers: (id: string) => api.post(`/domains/${id}/deploy-workers`),
  retryCloudflare: (id: string) => api.post(`/domains/${id}/retry-cloudflare`),
  /** GET /domains/search?q=... — empty q returns 400 */
  search: (q: string) => api.get('/domains/search', { params: { q } }),
};

export const websitesAPI = {
  suggestTitles: (domainId: string) =>
    api.post<{ titles: string[] }>('/websites/suggest-titles', { domainId }),
  generate: (domainId: string, templateKey: string, contactFormEnabled?: boolean, selectedTitles?: string[]) =>
    api.post('/websites/generate', { domainId, templateKey, contactFormEnabled, selectedTitles }),
  checkJobStatus: (jobId: string) =>
    api.get(`/websites/jobs/${jobId}`),
  cancelJob: (jobId: string) =>
    api.delete(`/websites/jobs/${jobId}`),
  clearPendingJobs: () =>
    api.post('/websites/jobs/clear-pending'),
  getQueueStats: () =>
    api.get('/websites/jobs/stats'),
  updateAds: (websiteId: string, data: any) =>
    api.put(`/websites/${websiteId}/ads`, data),
  updateContactForm: (websiteId: string, data: { contactFormEnabled: boolean }) =>
    api.put(`/websites/${websiteId}/contact-form`, data),
  generateMoreBlogs: (websiteId: string, quantity: number = 3) =>
    api.post(`/websites/${websiteId}/generate-more-blogs`, { quantity }),
  // Template APIs
  getTemplates: () =>
    api.get('/websites/templates'),
  updateTemplate: (websiteId: string, data: { templateKey: string }) =>
    api.put(`/websites/${websiteId}/template`, data),
  // Metadata APIs
  updateMetadata: (websiteId: string, data: { 
    metaTitle?: string; 
    metaDescription?: string; 
    metaImage?: string;
    metaKeywords?: string;
    metaAuthor?: string;
  }) =>
    api.put(`/websites/${websiteId}/metadata`, data),
  // Social Media APIs
  updateSocialMedia: (websiteId: string, data: { instagramUrl?: string; facebookUrl?: string; twitterUrl?: string }) =>
    api.put(`/websites/${websiteId}/social-media`, data),
  // Contact Info APIs
  updateContactInfo: (websiteId: string, data: { contactEmail?: string; contactPhone?: string }) =>
    api.put(`/websites/${websiteId}/contact-info`, data),
  
  // Google Analytics API
  updateGoogleAnalytics: (websiteId: string, data: { googleAnalyticsId?: string }) =>
    api.put(`/websites/${websiteId}/google-analytics`, data),

  // Logo display mode
  updateLogoDisplayMode: (websiteId: string, logoDisplayMode: 'logo_only' | 'text_only' | 'both') =>
    api.put(`/websites/${websiteId}/logo-display-mode`, { logoDisplayMode }),

  // Logo APIs
  uploadLogo: (websiteId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post(`/websites/${websiteId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteLogo: (websiteId: string) => api.delete(`/websites/${websiteId}/logo`),
};

export const contentAPI = {
  update: (blockId: string, content: any) =>
    api.put(`/content-blocks/${blockId}`, { content }),
  regenerate: (blockId: string) =>
    api.post(`/content-blocks/${blockId}/regenerate`),
  regenerateTitle: (sectionId: string) =>
    api.post(`/content-blocks/${sectionId}/regenerate-title`),
  regenerateContent: (sectionId: string) =>
    api.post(`/content-blocks/${sectionId}/regenerate-content`),
  regenerateImage: (sectionId: string) =>
    api.post(`/content-blocks/${sectionId}/regenerate-image`),
  deleteSection: (sectionId: string) =>
    api.delete(`/content-blocks/section/${sectionId}`),
  reorderSection: (sectionId: string, direction: 'up' | 'down') =>
    api.post(`/content-blocks/section/${sectionId}/reorder`, { direction }),
};

export const leadsAPI = {
  getAll: () => api.get('/leads'),
  create: (domain: string, data: any) =>
    api.post(`/leads?domain=${domain}`, data),
};

export const publicAPI = {
  getSiteByDomain: (domain: string) =>
    api.get(`/public/site?domain=${domain}`),
  submitContactForm: (data: { domain: string; name: string; email: string; company?: string; message: string }) =>
    api.post('/public/contact', data),
};

export const usersAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: {
    name?: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    dateOfBirth?: string;
    emailNotificationsEnabled?: boolean;
    notificationEmails?: string[];
  }) => api.put('/users/me', data),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export const stripeAPI = {
  getPlans: () => api.get('/stripe/plans'),
  getSubscription: () => api.get('/stripe/subscription'),
  subscribe: (planId: string) => api.post('/stripe/subscribe', { planId }),
  portal: () => api.post('/stripe/portal'),
  requestCustomPlan: (message: string) => api.post('/stripe/custom-plan-request', { message }),
  getCustomPlanRequests: () => api.get('/stripe/custom-plan-request'),
};

export const bulkUploadAPI = {
  uploadCsv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/bulk-upload/domains', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  generateWebsites: (domainIds: string[]) =>
    api.post('/bulk-upload/generate-websites', { domainIds }),
  updateDomain: (
    id: string,
    data: { selectedMeaning?: string; userDescription?: string }
  ) =>
    api.patch(`/bulk-upload/domains/${id}`, data),
  getInactiveDomains: () =>
    api.get('/bulk-upload/inactive-domains'),
};