'use client';

import { useState } from 'react';
import { Plus, RefreshCw, Edit3, ChevronUp, ChevronDown, CalendarDays } from 'lucide-react';
import GenerateContentModal from './GenerateContentModal';
import ScheduleModal from './ScheduleModal';

interface BlogsTabProps {
  blogs: any[];
  domain: any;
  generateMoreBlogsMutation: any;
  regenerateTitleMutation: any;
  regenerateContentMutation: any;
  regenerateImageMutation: any;
  deleteSectionMutation: any;
  reorderSectionMutation?: any;
  onEditBlog: (blog: any) => void;
}

export default function BlogsTab({ 
  blogs, 
  domain, 
  generateMoreBlogsMutation, 
  regenerateTitleMutation,
  regenerateContentMutation,
  regenerateImageMutation,
  deleteSectionMutation,
  reorderSectionMutation,
  onEditBlog 
}: BlogsTabProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleGenerate = (type: string, quantity: number) => {
    generateMoreBlogsMutation.mutate({ 
      websiteId: domain.website.id, 
      quantity 
    }, {
      onSuccess: () => {
        setShowGenerateModal(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Generate + Schedule Content Buttons */}
      <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-neutral-100 mb-1">Content</h3>
          <p className="text-sm font-light text-neutral-400">Generate or schedule AI-powered blog posts</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          {/* Schedule Content */}
          {domain?.website?.id && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <CalendarDays size={16} />
              Schedule
            </button>
          )}
          {/* Generate Content */}
          <button
            onClick={() => setShowGenerateModal(true)}
            disabled={generateMoreBlogsMutation.isPending}
            className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {generateMoreBlogsMutation.isPending ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generate Content Modal */}
      <GenerateContentModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerate}
        isGenerating={generateMoreBlogsMutation.isPending}
        domainId={domain.id}
      />

      {/* Schedule Content Modal */}
      {domain?.website?.id && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          websiteId={domain.website.id}
        />
      )}

      {/* Blogs List */}
      <div>
        <h3 className="text-lg text-neutral-100 mb-4">All Blogs ({blogs.length})</h3>
        <div className="space-y-3">
          {blogs.map((blog: any, index: number) => (
            <div
              key={blog.id}
              className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
                blog.isHero
                  ? 'border-yellow-600/50 bg-yellow-900/20'
                  : 'border-neutral-700 bg-[#0a0a0a] hover:border-neutral-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => reorderSectionMutation?.mutate({ sectionId: blog.id, direction: 'up' })}
                      disabled={index === 0 || !reorderSectionMutation}
                      className="p-1 hover:bg-[#262626] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ChevronUp size={16} className="text-neutral-400" />
                    </button>
                    <button
                      onClick={() => reorderSectionMutation?.mutate({ sectionId: blog.id, direction: 'down' })}
                      disabled={index === blogs.length - 1 || !reorderSectionMutation}
                      className="p-1 hover:bg-[#262626] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown size={16} className="text-neutral-400" />
                    </button>
                  </div>

                  {/* Blog Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {blog.isHero && (
                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded">
                          HERO
                        </span>
                      )}
                      <span className="text-xs text-neutral-400">Blog #{index + 1}</span>
                    </div>
                    <h4 className="text-neutral-100 mb-1 line-clamp-2">
                      {blog.title}
                    </h4>
                    {blog.isHero && (
                      <p className="text-xs font-light text-yellow-400/90 mt-2">
                        Hero blog cannot be deleted
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => onEditBlog(blog)}
                  className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="text-center py-12 text-neutral-400">
              <p>No blogs yet. Generate your first blogs!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
