'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, RefreshCw } from 'lucide-react';
import { leadsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import CustomLoader from '@/components/CustomLoader';

interface LeadsTabProps {
  domain: any;
}

export default function LeadsTab({ domain }: LeadsTabProps) {
  const queryClient = useQueryClient();
  const { data: allLeads, isLoading } = useQuery({
    queryKey: ['leads', domain.website.id],
    queryFn: async () => {
      const response = await leadsAPI.getAll();
      return response.data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds to get new leads
  });

  // Filter leads for this specific website
  const leads = allLeads?.filter((lead: any) => lead.websiteId === domain.website.id) || [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['leads', domain.website.id] });
    toast.success('Refreshing leads...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Form Leads</h3>
          <p className="text-sm text-gray-600">Messages from visitors to your website</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="w-full sm:w-auto px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-3">
            <CustomLoader />
          </div>
          <p className="text-sm text-gray-500">Loading leads...</p>
        </div>
      ) : leads && leads.length > 0 ? (
        <div className="space-y-3">
          {leads.map((lead: any) => (
            <div key={lead.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-3 mb-3">
                <div className="w-full sm:w-auto">
                  <h4 className="font-medium text-gray-900">{lead.name}</h4>
                  <p className="text-sm text-gray-600 break-all">{lead.email}</p>
                  {lead.company && (
                    <p className="text-xs text-gray-500 mt-1">{lead.company}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{lead.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Mail size={48} className="mx-auto text-gray-300 mb-3" />
          <p>No leads yet</p>
          <p className="text-sm mt-1">Contacts will appear here when visitors submit the form</p>
        </div>
      )}
    </div>
  );
}
