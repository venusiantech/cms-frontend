'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { domainsAPI, contentAPI, websitesAPI, leadsAPI } from '@/lib/api';
import { ArrowLeft, RefreshCw, Trash2, FileText, Image as ImageIcon, Type, Plus, Mail, Rocket, Settings as SettingsIcon, FileCode, ExternalLink, CheckCircle2, Edit3, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useJobStatus } from '@/hooks/useJobStatus';
import CustomLoader from '@/components/CustomLoader';

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
    mutationFn: (websiteId: string) => {
      toast.loading('Starting blog generation...', { id: 'generate-blogs' });
      return websitesAPI.generateMoreBlogs(websiteId);
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
          <p className="text-gray-500 mb-4">Invalid domain ID</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
          <p className="text-sm text-gray-500">Loading website...</p>
        </div>
      </div>
    );
  }

  if (!domain || !domain.website) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Website not found</p>
        <button onClick={() => router.push('/dashboard')} className="text-gray-900 hover:underline">
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 sm:px-16 lg:px-24 xl:px-32 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-medium text-gray-900">{domain.domainName}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{blogs.length} blogs • Active</p>
            </div>
          </div>
          <a
            href={`http://${domain.website.subdomain}.local:3000`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <ExternalLink size={16} />
            View Site
          </a>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Website Preview */}
        <div className="w-1/2 border-r border-gray-200 bg-gray-100 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between gap-3">
              {/* Left: MacBook buttons */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              {/* Center: URL bar */}
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300 font-mono">
                  {domain.website.subdomain}.local
                </div>
              </div>
              
              {/* Right: Domain name with logo + Open Site button */}
              <div className="flex items-center gap-3">
                {/* Domain display with logo */}
                {/* <div className="flex items-center gap-2 bg-gray-700 rounded px-3 py-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    {domain.domainName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    {domain.domainName}
                  </span>
                </div> */}
                
                {/* Open Site button */}
                <a
                  href={`http://${domain.website.subdomain}.local:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-gray-200 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  title="Open site in new tab"
                >
                  <ExternalLink size={14} />
                  Open Site
                </a>
              </div>
            </div>
            <iframe
              src={`http://${domain.website.subdomain}.local:3000`}
              className="w-full h-[calc(100vh-200px)] bg-white"
              title="Website Preview"
            />
          </div>
        </div>

        {/* Right: Tabs & Content */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-8 pt-6">
            <div className="flex gap-6">
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
          <div className="flex-1 overflow-auto p-8">
            {activeTab === 'blogs' && (
              <BlogsTab
                blogs={blogs}
                domain={domain}
                generateMoreBlogsMutation={generateMoreBlogsMutation}
                regenerateTitleMutation={regenerateTitleMutation}
                regenerateContentMutation={regenerateContentMutation}
                regenerateImageMutation={regenerateImageMutation}
                deleteSectionMutation={deleteSectionMutation}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Edit Blog</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingBlog.isHero ? 'Hero Blog' : `Blog #${blogs.indexOf(editingBlog) + 1}`}
                </p>
              </div>
              <button
                onClick={() => setEditingBlog(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Edit Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    placeholder="Enter blog title..."
                  />
                </div>

                {/* Edit Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Blog Content
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-mono text-sm"
                    placeholder="Enter blog content (supports Markdown)..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: You can use Markdown formatting (e.g., # for headings, ** for bold)
                  </p>
                </div>

                {/* Regenerate Options */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Or Regenerate with AI
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        regenerateTitleMutation.mutate(editingBlog.id);
                        setEditingBlog(null);
                      }}
                      disabled={regenerateTitleMutation.isPending}
                      className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Type size={16} />
                      <span>Regenerate Title</span>
                    </button>

                    <button
                      onClick={() => {
                        regenerateContentMutation.mutate(editingBlog.id);
                        setEditingBlog(null);
                      }}
                      disabled={regenerateContentMutation.isPending}
                      className="px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      <span>Regenerate Content</span>
                    </button>

                    <button
                      onClick={() => {
                        regenerateImageMutation.mutate(editingBlog.id);
                        setEditingBlog(null);
                      }}
                      disabled={regenerateImageMutation.isPending}
                      className="px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={16} />
                      <span>Regenerate Image</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
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
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>Delete Blog</span>
                </button>
              ) : (
                <div />
              )}

              {/* Save Button (right side) */}
              <button
                onClick={handleSaveEdit}
                disabled={updateContentMutation.isPending}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {updateContentMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-4 border-b-2 transition-all duration-200 ${
        active
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </button>
  );
}

function BlogsTab({ blogs, domain, generateMoreBlogsMutation, onEditBlog }: any) {
  return (
    <div className="space-y-6">
      {/* Generate More Button */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Generate More Content</h3>
          <p className="text-sm text-gray-600">Add 3 more AI-generated blog posts to your site</p>
        </div>
        <button
          onClick={() => generateMoreBlogsMutation.mutate(domain.website.id)}
          disabled={generateMoreBlogsMutation.isPending}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
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
              className={`border rounded-xl p-5 transition-all duration-200 ${
                blog.isHero
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
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
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
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

function LeadsTab({ domain }: any) {
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
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Form Leads</h3>
          <p className="text-sm text-gray-600">Messages from visitors to your website</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
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
            <div key={lead.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{lead.name}</h4>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  {lead.company && (
                    <p className="text-xs text-gray-500 mt-1">{lead.company}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
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
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.message}</p>
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

function DeploymentTab({ domain }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Deployment</h3>
        <p className="text-sm text-gray-600">Your website is live and accessible</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Deployment Successful</h4>
            <p className="text-sm text-green-700">Your website is live and accessible to visitors</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">SUBDOMAIN</p>
          <p className="font-mono text-sm text-gray-900 mb-3">{domain.website.subdomain}.cms.local</p>
          <a
            href={`http://${domain.website.subdomain}.local:3000`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-900 hover:underline flex items-center gap-1"
          >
            View site <ExternalLink size={14} />
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">CUSTOM DOMAIN</p>
          <p className="font-mono text-sm text-gray-900 mb-3">{domain.domainName}</p>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">DNS Configuration</p>
            <p className="text-xs text-gray-600 mb-2">Add this CNAME record to your DNS provider:</p>
            <div className="font-mono text-xs bg-white rounded p-2 border border-gray-200">
              {domain.domainName} → {domain.website.subdomain}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ domain, domainId, queryClient }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Website Settings</h3>
        <p className="text-sm text-gray-600">Configure your website preferences</p>
      </div>

      <div className="space-y-4">
        {/* Ads Setting */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
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
                className="w-5 h-5 text-gray-900 rounded mt-0.5 focus:ring-2 focus:ring-gray-900"
              />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Enable Ads</p>
                <p className="text-sm text-gray-600">Show advertisements on your website</p>
              </div>
            </label>
            {domain.website.adsApproved ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Approved
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Contact Form Setting */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
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
              className="w-5 h-5 text-gray-900 rounded mt-0.5 focus:ring-2 focus:ring-gray-900"
            />
            <div>
              <p className="font-semibold text-gray-900 mb-1">Enable Contact Form</p>
              <p className="text-sm text-gray-600">Show "Contact Us" link in your website</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
