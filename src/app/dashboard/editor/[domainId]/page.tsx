'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { domainsAPI, contentAPI, websitesAPI, leadsAPI } from '@/lib/api';
import { ArrowLeft, RefreshCw, Trash2, FileText, Image as ImageIcon, Type, Plus, Mail, Rocket, Settings as SettingsIcon, FileCode, ExternalLink, CheckCircle2, Edit3, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useJobStatus } from '@/hooks/useJobStatus';
import CustomLoader from '@/components/CustomLoader';
import { BlogsTab, LeadsTab, DeploymentTab, SettingsTab, TabButton } from '../components';

// Helper to get the correct site URL based on environment
function getSiteUrl(subdomain: string): string {
  // Use environment variable instead of window check to avoid hydration mismatch
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const isProduction = apiUrl.includes('railway.app') || apiUrl.includes('fastofy.com');
  
  if (isProduction) {
    return `https://${subdomain}.fastofy.com`;
  }
  return `http://${subdomain}.local:3000`;
}

// Helper to get display subdomain (without protocol/port)
function getDisplaySubdomain(subdomain: string): string {
  // Use environment variable instead of window check to avoid hydration mismatch
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const isProduction = apiUrl.includes('railway.app') || apiUrl.includes('fastofy.com');
  
  if (isProduction) {
    return `${subdomain}.fastofy.com`;
  }
  return `${subdomain}.local`;
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const domainId = params.domainId as string;
  const [activeTab, setActiveTab] = useState<'blogs' | 'leads' | 'deployment' | 'settings'>('blogs');
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [generateBlogsJobId, setGenerateBlogsJobId] = useState<string | null>(null);

  // Fetch domain with full website data
  const { data: domain, isLoading } = useQuery({
    queryKey: ['domain', domainId],
    queryFn: async () => {
      const response = await domainsAPI.getOne(domainId);
      return response.data;
    },
    enabled: !!domainId && domainId !== 'undefined',
  });

  // Poll for generate blogs job status
  const { status: blogJobStatus, progress: blogProgress } = useJobStatus(
    generateBlogsJobId,
    (result) => {
      // On completion
      console.log('Blogs generation completed:', result);
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      queryClient.refetchQueries({ queryKey: ['domain', domainId] });
      toast.success('3 new blogs generated successfully! 🎉', { id: 'generate-blogs' });
      setGenerateBlogsJobId(null);
    },
    (error) => {
      // On error
      console.error('Blogs generation failed:', error);
      toast.error(error || 'Failed to generate blogs', { id: 'generate-blogs' });
      setGenerateBlogsJobId(null);
    }
  );

  // Update toast with progress for blog generation
  useEffect(() => {
    if (generateBlogsJobId && blogJobStatus) {
      if (blogJobStatus.status === 'waiting') {
        toast.loading('Queued for generation...', { id: 'generate-blogs' });
      } else if (blogJobStatus.status === 'active') {
        toast.loading(`Generating blogs... ${blogProgress}%`, { id: 'generate-blogs' });
      } else if (blogJobStatus.status === 'completed' || blogJobStatus.status === 'failed') {
        toast.dismiss('generate-blogs');
      }
    }
  }, [generateBlogsJobId, blogJobStatus, blogProgress]);

  // Generate more blogs mutation
  const generateMoreBlogsMutation = useMutation({
    mutationFn: ({ websiteId, quantity }: { websiteId: string; quantity: number }) => {
      toast.loading(`Starting generation of ${quantity} blog(s)...`, { id: 'generate-blogs' });
      return websitesAPI.generateMoreBlogs(websiteId, quantity);
    },
    onSuccess: (response) => {
      const jobId = response.data.jobId;
      setGenerateBlogsJobId(jobId);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start generation', { id: 'generate-blogs' });
    },
  });

  // Regenerate title mutation
  const regenerateTitleMutation = useMutation({
    mutationFn: (sectionId: string) => {
      toast.loading('Generating title...', { id: 'regenerate-title' });
      return contentAPI.regenerateTitle(sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      queryClient.refetchQueries({ queryKey: ['domain', domainId] });
      toast.success('Title regenerated successfully! 🎯', { id: 'regenerate-title' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to regenerate title', { id: 'regenerate-title' });
    },
  });

  // Regenerate content mutation
  const regenerateContentMutation = useMutation({
    mutationFn: (sectionId: string) => {
      toast.loading('Generating blog content...', { id: 'regenerate-content' });
      return contentAPI.regenerateContent(sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      queryClient.refetchQueries({ queryKey: ['domain', domainId] });
      toast.success('Content regenerated successfully! 📝', { id: 'regenerate-content' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to regenerate content', { id: 'regenerate-content' });
    },
  });

  // Regenerate image mutation
  const regenerateImageMutation = useMutation({
    mutationFn: (sectionId: string) => {
      toast.loading('Generating image...', { id: 'regenerate-image' });
      return contentAPI.regenerateImage(sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      queryClient.refetchQueries({ queryKey: ['domain', domainId] });
      toast.success('Image regenerated successfully! 🖼️', { id: 'regenerate-image' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to regenerate image', { id: 'regenerate-image' });
    },
  });

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: string) => {
      toast.loading('Deleting blog...', { id: 'delete-blog' });
      return contentAPI.deleteSection(sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      queryClient.refetchQueries({ queryKey: ['domain', domainId] });
      toast.success('Blog deleted successfully! 🗑️', { id: 'delete-blog' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete blog', { id: 'delete-blog' });
    },
  });

  const reorderSectionMutation = useMutation({
    mutationFn: ({ sectionId, direction }: { sectionId: string; direction: 'up' | 'down' }) => {
      return contentAPI.reorderSection(sectionId, direction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      queryClient.refetchQueries({ queryKey: ['domain', domainId] });
      toast.success('Blog reordered successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reorder blog');
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: ({ blockId, content }: { blockId: string; content: any }) =>
      contentAPI.update(blockId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain', domainId] });
      queryClient.refetchQueries({ queryKey: ['domain', domainId] });
      setEditingBlog(null);
      toast.success('Blog updated successfully! ✅');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update blog');
    },
  });

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    
    // Find title and content blocks
    const titleBlock = blog.contentBlocks.find((b: any) => {
      try {
        const content = JSON.parse(b.contentJson);
        return content.isTitle === true;
      } catch {
        return false;
      }
    }) || blog.contentBlocks.find((b: any) => b.blockType === 'text');
    
    const contentBlock = blog.contentBlocks.find((b: any) => {
      try {
        const content = JSON.parse(b.contentJson);
        return content.isFullContent === true;
      } catch {
        return false;
      }
    });

    if (titleBlock) {
      const titleContent = JSON.parse(titleBlock.contentJson);
      setEditTitle(titleContent.text || '');
    }
    
    if (contentBlock) {
      const contentData = JSON.parse(contentBlock.contentJson);
      setEditContent(contentData.text || '');
    }
  };

  const handleSaveEdit = () => {
    if (!editingBlog) return;

    // Find title and content blocks
    const titleBlock = editingBlog.contentBlocks.find((b: any) => {
      try {
        const content = JSON.parse(b.contentJson);
        return content.isTitle === true;
      } catch {
        return false;
      }
    });
    
    const contentBlock = editingBlog.contentBlocks.find((b: any) => {
      try {
        const content = JSON.parse(b.contentJson);
        return content.isFullContent === true;
      } catch {
        return false;
      }
    });

    // Update title
    if (titleBlock && editTitle) {
      updateContentMutation.mutate({
        blockId: titleBlock.id,
        content: { text: editTitle, isTitle: true },
      });
    }

    // Update content
    if (contentBlock && editContent) {
      updateContentMutation.mutate({
        blockId: contentBlock.id,
        content: { text: editContent, isFullContent: true },
      });
    }
  };

  // Check for invalid domainId
  if (!domainId || domainId === 'undefined') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Invalid domain ID</p>
          <button
            onClick={() => router.push('/dashboard/domains')}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <CustomLoader />
          <p className="text-sm text-neutral-400">Loading website...</p>
        </div>
      </div>
    );
  }

  if (!domain || !domain.website) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-400 mb-4">Website not found</p>
        <button onClick={() => router.push('/dashboard/domains')} className="text-neutral-300 hover:text-white hover:underline">
          ← Back to dashboard
        </button>
      </div>
    );
  }

  const blogs = domain.website.pages
    .filter((page: any) => page.slug === '/')
    .flatMap((page: any) => page.sections)
    .filter((section: any) => section.sectionType === 'content')
    .map((section: any) => {
      const titleBlock = section.contentBlocks.find((b: any) => {
        try {
          const content = JSON.parse(b.contentJson);
          return content.isTitle === true;
        } catch {
          return false;
        }
      }) || section.contentBlocks.find((b: any) => b.blockType === 'text');

      const titleContent = titleBlock ? JSON.parse(titleBlock.contentJson) : { text: 'Untitled' };
      
      return {
        ...section,
        title: titleContent.text || 'Untitled Blog',
        isHero: section.orderIndex === 0,
      };
    });

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Page Header */}
      <div className="bg-black border-b border-neutral-800 px-4 sm:px-8 lg:px-16 xl:px-24 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/dashboard/domains')}
              className="p-2 hover:bg-[#262626] rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-neutral-400" />
            </button>
            <div>
              <h1 className="text-md sm:text-lg font-light text-neutral-100 truncate max-w-[200px] sm:max-w-none">{domain.domainName}</h1>
              <p className="text-xs text-neutral-400 mt-0.5">{blogs.length} blogs • Active</p>
            </div>
          </div>
          <a
            href={getSiteUrl(domain.website.subdomain)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 sm:px-4 bg-white hover:bg-neutral-200 text-black rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">View Site</span>
            <span className="sm:hidden">View</span>
          </a>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Website Preview - Hidden on mobile */}
        <div className="hidden lg:block lg:w-1/2 border-r border-neutral-800 bg-black p-4 overflow-auto">
          <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-neutral-700">
            <div className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between gap-3">
              {/* Left: MacBook buttons */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              {/* Center: URL bar */}
              <div className="flex-1 flex justify-center">
                <div className="bg-[#404040] rounded px-3 py-1 text-xs text-neutral-300 font-mono">
                  {getDisplaySubdomain(domain.website.subdomain)}
                </div>
              </div>
              
              {/* Right: Domain name with logo + Open Site button */}
              <div className="flex items-center gap-3">
                {/* Open Site button */}
                <a
                  href={getSiteUrl(domain.website.subdomain)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-neutral-600 hover:bg-neutral-600 text-neutral-200 px-3 py-1.5 rounded text-xs transition-colors"
                  title="Open site in new tab"
                >
                  <ExternalLink size={14} />
                  Open Site
                </a>
              </div>
            </div>
            <iframe
              src={getSiteUrl(domain.website.subdomain)}
              className="w-full h-[calc(100vh-200px)] bg-white"
              title="Website Preview"
            />
          </div>
        </div>

        {/* Right: Tabs & Content */}
        <div className="w-full lg:w-1/2 flex flex-col bg-black min-h-0">
          {/* Tabs */}
          <div className="flex-shrink-0 border-b border-neutral-800 px-4 sm:px-8 pt-4 sm:pt-6 overflow-x-auto">
            <div className="flex gap-4 sm:gap-6 min-w-max">
              <TabButton
                active={activeTab === 'blogs'}
                onClick={() => setActiveTab('blogs')}
                icon={<FileCode size={18} />}
              >
                Blogs
              </TabButton>
              <TabButton
                active={activeTab === 'leads'}
                onClick={() => setActiveTab('leads')}
                icon={<Mail size={18} />}
              >
                Leads
              </TabButton>
              <TabButton
                active={activeTab === 'deployment'}
                onClick={() => setActiveTab('deployment')}
                icon={<Rocket size={18} />}
              >
                Deployment
              </TabButton>
              <TabButton
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                icon={<SettingsIcon size={18} />}
              >
                Settings
              </TabButton>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-5 bg-black">
            {activeTab === 'blogs' && (
              <BlogsTab
                blogs={blogs}
                domain={domain}
                generateMoreBlogsMutation={generateMoreBlogsMutation}
                regenerateTitleMutation={regenerateTitleMutation}
                regenerateContentMutation={regenerateContentMutation}
                regenerateImageMutation={regenerateImageMutation}
                deleteSectionMutation={deleteSectionMutation}
                reorderSectionMutation={reorderSectionMutation}
                onEditBlog={handleEditBlog}
              />
            )}

            {activeTab === 'leads' && <LeadsTab domain={domain} />}

            {activeTab === 'deployment' && <DeploymentTab domain={domain} />}

            {activeTab === 'settings' && <SettingsTab domain={domain} domainId={domainId} queryClient={queryClient} />}
          </div>
        </div>
      </div>

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-neutral-700 animate-in zoom-in duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-700 flex-shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-100 truncate">Edit Blog</h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                  {editingBlog.isHero ? 'Hero Blog' : `Blog #${blogs.indexOf(editingBlog) + 1}`}
                </p>
              </div>
              <button
                onClick={() => setEditingBlog(null)}
                className="p-2 hover:bg-[#262626] rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X size={18} className="text-neutral-400 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto flex-1">
              <div className="space-y-4 sm:space-y-6">
                {/* Edit Title */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-200 mb-1.5 sm:mb-2">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter blog title..."
                  />
                </div>

                {/* Edit Content */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-200 mb-1.5 sm:mb-2">
                    Blog Content
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#262626] border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 font-mono text-xs sm:text-sm resize-none"
                    placeholder="Enter blog content (supports Markdown)..."
                  />
                  <p className="text-xs text-neutral-400 mt-1.5 sm:mt-2">
                    💡 Tip: You can use Markdown formatting (e.g., # for headings, ** for bold)
                  </p>
                </div>

                {/* Regenerate Options */}
                <div className="border-t border-neutral-700 pt-4 sm:pt-6">
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-200 mb-3 sm:mb-4">
                    Or Regenerate with AI
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        regenerateTitleMutation.mutate(editingBlog.id);
                        setEditingBlog(null);
                      }}
                      disabled={regenerateTitleMutation.isPending}
                      className="px-3 py-2.5 sm:px-4 sm:py-3 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-blue-800/50"
                    >
                      <Type size={14} className="sm:w-4 sm:h-4" />
                      <span>Regenerate Title</span>
                    </button>

                    <button
                      onClick={() => {
                        regenerateContentMutation.mutate(editingBlog.id);
                        setEditingBlog(null);
                      }}
                      disabled={regenerateContentMutation.isPending}
                      className="px-3 py-2.5 sm:px-4 sm:py-3 bg-green-900/40 hover:bg-green-900/60 text-green-300 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-green-800/50"
                    >
                      <FileText size={14} className="sm:w-4 sm:h-4" />
                      <span>Regenerate Content</span>
                    </button>

                    <button
                      onClick={() => {
                        regenerateImageMutation.mutate(editingBlog.id);
                        setEditingBlog(null);
                      }}
                      disabled={regenerateImageMutation.isPending}
                      className="px-3 py-2.5 sm:px-4 sm:py-3 bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-purple-800/50"
                    >
                      <ImageIcon size={14} className="sm:w-4 sm:h-4" />
                      <span>Regenerate Image</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-neutral-700 bg-[#262626]/50 flex-shrink-0">
              {/* Delete Button (left side) */}
              {!editingBlog.isHero ? (
                <button
                  onClick={() => {
                    if (confirm(`Delete this blog? This cannot be undone.`)) {
                      deleteSectionMutation.mutate(editingBlog.id);
                      setEditingBlog(null);
                    }
                  }}
                  disabled={deleteSectionMutation.isPending}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-red-800/50"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  <span>Delete Blog</span>
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {/* Save Button (right side) */}
              <button
                onClick={handleSaveEdit}
                disabled={updateContentMutation.isPending}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white hover:bg-neutral-200 text-black rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                {updateContentMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

