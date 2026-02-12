'use client';

import { Plus, RefreshCw, Edit3 } from 'lucide-react';

interface BlogsTabProps {
  blogs: any[];
  domain: any;
  generateMoreBlogsMutation: any;
  regenerateTitleMutation: any;
  regenerateContentMutation: any;
  regenerateImageMutation: any;
  deleteSectionMutation: any;
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
  onEditBlog 
}: BlogsTabProps) {
  return (
    <div className="space-y-6">
      {/* Generate More Button */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Generate More Content</h3>
          <p className="text-sm text-gray-600">Add 3 more AI-generated blog posts to your site</p>
        </div>
        <button
          onClick={() => generateMoreBlogsMutation.mutate(domain.website.id)}
          disabled={generateMoreBlogsMutation.isPending}
          className="w-full sm:w-auto px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
        >
          {generateMoreBlogsMutation.isPending ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus size={16} />
              Generate 3 More
            </>
          )}
        </button>
      </div>

      {/* Blogs List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Blogs ({blogs.length})</h3>
        <div className="space-y-3">
          {blogs.map((blog: any, index: number) => (
            <div
              key={blog.id}
              className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
                blog.isHero
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    {blog.isHero && (
                      <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-semibold rounded">
                        HERO
                      </span>
                    )}
                    <span className="text-xs text-gray-500">Blog #{index + 1}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {blog.title}
                  </h4>
                  {blog.isHero && (
                    <p className="text-xs text-yellow-700 mt-2">
                      Hero blog cannot be deleted
                    </p>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => onEditBlog(blog)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No blogs yet. Generate your first blogs!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
