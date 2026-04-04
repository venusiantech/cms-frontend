'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, RefreshCw, ChevronRight } from 'lucide-react';
import { leadsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import CustomLoader from '@/components/CustomLoader';

interface LeadsTabProps {
  domain: any;
}

export default function LeadsTab({ domain }: LeadsTabProps) {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: allLeads, isLoading } = useQuery({
    queryKey: ['leads', domain.website.id],
    queryFn: async () => {
      const response = await leadsAPI.getAll();
      return response.data;
    },
    refetchInterval: 5000,
  });

  const leads = allLeads?.filter((lead: any) => lead.websiteId === domain.website.id) || [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['leads', domain.website.id] });
    toast.success('Refreshing leads...');
  };

  const toggleLead = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
        <div>
          <h3 className="text-lg text-neutral-100 mb-1">Contact Form Leads</h3>
          <p className="text-sm font-light text-neutral-400">Messages from visitors to your website</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="w-full sm:w-auto px-3 py-2 text-sm font-light text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
          <p className="text-sm text-neutral-400">Loading leads...</p>
        </div>
      ) : leads && leads.length > 0 ? (
        <div className="divide-y divide-neutral-800 w-full">
          {leads.map((lead: any) => {
            const open = expandedId === lead.id;
            return (
              <div key={lead.id} className="w-full">
                <button
                  type="button"
                  onClick={() => toggleLead(lead.id)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-3 py-3 px-1 -mx-1 rounded-lg text-left hover:bg-neutral-800/50 transition-colors group"
                >
                  <span className="text-sm text-neutral-200 truncate break-all flex-1 min-w-0">
                    {lead.email}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`flex-shrink-0 text-neutral-500 transition-transform duration-200 ${
                      open ? 'rotate-90 text-neutral-300' : 'group-hover:text-neutral-400'
                    }`}
                    aria-hidden
                  />
                </button>
                {open && (
                  <div className="pb-4 pt-0 pl-1 space-y-4 border-t border-neutral-800/80 mt-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pt-3">
                      <div className="space-y-1 min-w-0">
                        <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">Name</p>
                        <p className="text-sm font-medium text-neutral-100">{lead.name}</p>
                        {lead.company && (
                          <>
                            <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mt-3">
                              Company
                            </p>
                            <p className="text-sm text-neutral-300">{lead.company}</p>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 whitespace-nowrap sm:text-right">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-1.5">
                        Message
                      </p>
                      <p className="text-sm text-neutral-300 whitespace-pre-wrap break-words leading-relaxed">
                        {lead.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-400">
          <Mail size={48} className="mx-auto text-neutral-600 mb-3" />
          <p>No leads yet</p>
          <p className="text-sm mt-1">Contacts will appear here when visitors submit the form</p>
        </div>
      )}
    </div>
  );
}
