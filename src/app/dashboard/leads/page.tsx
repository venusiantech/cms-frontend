'use client';

import { useQuery } from '@tanstack/react-query';
import { leadsAPI } from '@/lib/api';
import { Mail, Building2, Calendar } from 'lucide-react';

export default function LeadsPage() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await leadsAPI.getAll();
      return response.data;
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-gray-600 mt-1">
          Contact form submissions from your websites
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : leads && leads.length > 0 ? (
        <div className="space-y-4">
          {leads.map((lead: any) => (
            <div key={lead.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{lead.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail size={16} />
                      {lead.email}
                    </span>
                    {lead.company && (
                      <span className="flex items-center gap-1">
                        <Building2 size={16} />
                        {lead.company}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{lead.message}</p>

              <div className="text-sm text-gray-600">
                <strong>From:</strong> {lead.website.domain.domainName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No leads yet</h3>
          <p className="text-gray-600">
            Leads will appear here when visitors submit contact forms
          </p>
        </div>
      )}
    </div>
  );
}

