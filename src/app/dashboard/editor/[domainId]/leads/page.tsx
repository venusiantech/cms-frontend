'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { domainsAPI } from '@/lib/api';
import { Mail, ArrowLeft } from 'lucide-react';
import CustomLoader from '@/components/CustomLoader';

export default function DomainLeadsPage() {
  const params = useParams();
  const router = useRouter();
  const domainId = params.domainId as string;

  // Fetch domain to get website ID
  const { data: domain, isLoading: isDomainLoading } = useQuery({
    queryKey: ['domain', domainId],
    queryFn: async () => {
      const response = await domainsAPI.getOne(domainId);
      return response.data;
    },
  });

  // Fetch leads for this website
  const { data: leads, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['leads', domainId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const allLeads = await response.json();
      
      // Filter leads for this specific website
      if (domain?.website?.id) {
        return allLeads.filter((lead: any) => lead.websiteId === domain.website.id);
      }
      return [];
    },
    enabled: !!domain?.website?.id,
  });

  const isLoading = isDomainLoading || isLeadsLoading;

  if (!domainId || domainId === 'undefined') {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Invalid domain</p>
        <button onClick={() => router.push('/dashboard')} className="text-gray-900 hover:underline">
          ← Back to dashboard
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <CustomLoader />
          <p className="text-sm text-gray-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/dashboard/editor/${domainId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Editor</span>
        </button>
        <h1 className="text-3xl font-medium text-gray-900">Contact Form Leads</h1>
        <p className="text-gray-600 mt-2">
          Messages from visitors to {domain?.domainName}
        </p>
      </div>

      {/* Leads List */}
      {leads && leads.length > 0 ? (
        <div className="space-y-4">
          {leads.map((lead: any) => (
            <div key={lead.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                  {lead.company && (
                    <p className="text-xs text-gray-500 mt-1">{lead.company}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Mail size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads yet</h3>
          <p className="text-gray-600">
            Contacts will appear here when visitors submit the form on your website
          </p>
        </div>
      )}
    </div>
  );
}
