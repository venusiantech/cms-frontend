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
};

export const websitesAPI = {
  generate: (domainId: string, templateKey: string, contactFormEnabled?: boolean) =>
    api.post('/websites/generate', { domainId, templateKey, contactFormEnabled }),
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
  updateMetadata: (websiteId: string, data: { metaTitle?: string; metaDescription?: string; metaImage?: string }) =>
    api.put(`/websites/${websiteId}/metadata`, data),
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

export const aiPromptsAPI = {
  getAll: (templateKey?: string) =>
    api.get('/ai-prompts', { params: { templateKey } }),
  create: (data: any) => api.post('/ai-prompts', data),
  update: (id: string, data: any) => api.put(`/ai-prompts/${id}`, data),
  delete: (id: string) => api.delete(`/ai-prompts/${id}`),
};

