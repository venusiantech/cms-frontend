'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: string;
  type: string;
  order: number;
  blocks: Array<{
    id: string;
    type: string;
    content: any;
  }>;
}

interface PageData {
  id: string;
  slug: string;
  seo: {
    title: string | null;
    description: string | null;
  };
  sections: Section[];
}

interface ModernNewsProps {
  page: PageData;
  website: {
    id: string;
    templateKey: string;
    adsEnabled: boolean;
    adsApproved: boolean;
    contactFormEnabled: boolean;
  };
  domain: {
    name: string;
  };
}

interface Blog {
  title: string;
  content: string;
  preview: string;
  image: string;
  sectionId: string;
}

/**
 * Modern News Magazine Template
 * Professional news/magazine layout with hero, content grid, and sidebar
 */
export default function ModernNews({ page, website, domain }: ModernNewsProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set document title for browser tab
  useEffect(() => {
    const domainName = domain.name.split('.')[0];
    document.title = `${domainName.charAt(0).toUpperCase() + domainName.slice(1)} - News & Articles`;
  }, [domain.name]);

  // Simulate loading for images
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top when returning to home view
  useEffect(() => {
    if (!selectedBlog) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedBlog]);

  // Extract all blogs from content sections
  const contentSections = page.sections.filter((s) => s.type === 'content');
  const heroSection = page.sections.find((s) => s.type === 'hero');

  const blogs: Blog[] = contentSections.map((section) => {
    // Try new format first (with flags)
    let titleBlock = section.blocks.find((b) => b.type === 'text' && b.content.isTitle);
    let contentBlock = section.blocks.find((b) => b.type === 'text' && b.content.isFullContent);
    let previewBlock = section.blocks.find((b) => b.type === 'text' && b.content.isPreview);
    const imageBlock = section.blocks.find((b) => b.type === 'image');

    // Fallback for old format (without flags)
    if (!titleBlock || !contentBlock || !previewBlock) {
      const textBlocks = section.blocks.filter((b) => b.type === 'text');
      
      if (textBlocks.length === 1) {
        // Only one text block - use it as title and content
        titleBlock = textBlocks[0];
        contentBlock = textBlocks[0];
        previewBlock = textBlocks[0];
      } else if (textBlocks.length >= 2) {
        // Multiple text blocks - first is title, second is content/preview
        titleBlock = titleBlock || textBlocks[0];
        contentBlock = contentBlock || textBlocks[1];
        previewBlock = previewBlock || textBlocks[1];
      }
      
      // If we have 3+ text blocks, try to use them intelligently
      if (textBlocks.length >= 3 && !contentBlock) {
        titleBlock = titleBlock || textBlocks[0];
        contentBlock = contentBlock || textBlocks[1]; // Full content
        previewBlock = previewBlock || textBlocks[2]; // Preview
      }
    }

    return {
      title: titleBlock?.content?.text || 'Untitled',
      content: contentBlock?.content?.text || previewBlock?.content?.text || '',
      preview: previewBlock?.content?.text || contentBlock?.content?.text?.substring(0, 300) + '...' || '',
      image: imageBlock?.content?.url || 'https://placehold.co/800x400/6366f1/white?text=Article',
      sectionId: section.id,
    };
  });

  if (selectedBlog) {
    return (
      <FullArticleView
        blog={selectedBlog}
        domain={domain}
        onBack={() => setSelectedBlog(null)}
      />
    );
  }

  if (showContactForm) {
    return (
      <ContactFormPage
        domain={domain}
        onBack={() => setShowContactForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Always visible, no skeleton */}
      <Header 
        domain={domain} 
        onContactClick={website.contactFormEnabled ? () => setShowContactForm(true) : undefined} 
      />

      {/* Main Content - Tighter margins for professional look */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section - Show skeleton while loading */}
        {isLoading ? (
          <HeroSectionSkeleton />
        ) : (
          blogs.length > 0 && <HeroSection section={heroSection} blogs={blogs} onBlogClick={setSelectedBlog} />
        )}

        {/* All Blogs Grid - Show skeleton while loading */}
        {isLoading ? (
          <BlogsGridSkeleton />
        ) : (
          blogs.length > 0 && (
            <BlogsGrid blogs={blogs} onBlogClick={setSelectedBlog} />
          )
        )}
      </main>

      {/* Footer - Always visible, no skeleton */}
      <Footer 
        sections={page.sections} 
        website={website} 
        domain={domain} 
        onContactClick={website.contactFormEnabled ? () => setShowContactForm(true) : undefined} 
      />
    </div>
  );
}

// Hero Section Skeleton - Only shows while loading hero content
function HeroSectionSkeleton() {
  return (
    <section className="mb-8 animate-pulse">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Featured Article Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="h-80 bg-gray-200"></div>
          </div>
        </div>

        {/* Sidebar Articles Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded shadow-sm p-3">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Blogs Grid Skeleton - Only shows while loading blogs
function BlogsGridSkeleton() {
  return (
    <section className="mb-8 animate-pulse">
      {/* Section Header Skeleton */}
      <div className="flex items-center mb-5">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="bg-white rounded shadow-sm overflow-hidden">
            <div className="h-40 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-2 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                <div className="h-2 bg-gray-200 rounded w-3/5"></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FullArticleView({ blog, domain, onBack }: { blog: Blog; domain: { name: string }; onBack: () => void }) {
  // Scroll to top when article opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Set document title for article page
  useEffect(() => {
    document.title = `${blog.title} - ${domain.name.split('.')[0].charAt(0).toUpperCase() + domain.name.split('.')[0].slice(1)}`;
    
    // Restore original title when component unmounts
    return () => {
      const domainName = domain.name.split('.')[0];
      document.title = `${domainName.charAt(0).toUpperCase() + domainName.slice(1)} - News & Articles`;
    };
  }, [blog.title, domain.name]);

  // Convert markdown headings to HTML-friendly format
  const renderContent = (content: string) => {
    // Clean the content: remove code fence markers and first H1 (duplicate title)
    let cleanContent = content
      // Remove markdown code fence markers
      .replace(/```markdown\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    // Split into lines
    const lines = cleanContent.split('\n');
    
    // Remove first H1 if it matches or contains the blog title (avoid duplicate)
    let startIndex = 0;
    if (lines[0]?.startsWith('# ')) {
      const firstHeading = lines[0].substring(2).trim();
      // Skip if it's similar to the blog title
      if (firstHeading.toLowerCase().includes(blog.title.toLowerCase().substring(0, 20)) || 
          blog.title.toLowerCase().includes(firstHeading.toLowerCase().substring(0, 20))) {
        startIndex = 1;
      }
    }
    
    return lines.slice(startIndex).map((line, idx) => {
      // Skip empty code fence markers
      if (line.trim() === '```' || line.trim() === '```markdown') {
        return null;
      }
      
      // Handle headings
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-4xl font-bold text-gray-900 mb-6 mt-8">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-3xl font-bold text-gray-900 mb-4 mt-6">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-2xl font-semibold text-gray-800 mb-3 mt-5">{line.substring(4)}</h3>;
      } else if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-xl font-semibold text-gray-800 mb-2 mt-4">{line.substring(5)}</h4>;
      } else if (line.trim() === '') {
        return <div key={idx} className="h-4"></div>;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="ml-6 text-gray-700 leading-relaxed mb-2">{line.substring(2)}</li>;
      } else if (line.startsWith('1. ') || /^\d+\.\s/.test(line)) {
        // Handle numbered lists
        return <li key={idx} className="ml-6 text-gray-700 leading-relaxed mb-2 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
      } else {
        return <p key={idx} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
      }
    }).filter(Boolean); // Remove null entries
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header domain={domain} />

      {/* Article Container - Narrower for better readability */}
      <article className="max-w-3xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Articles
        </button>

        {/* Article Header */}
        <header className="mb-6">
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold mr-2">
              ARTICLE
            </span>
            <time>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span className="mx-2">•</span>
            <span>{Math.ceil(blog.content.length / 1000)} min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {blog.title}
          </h1>
        </header>

        {/* Featured Image - Smaller and better proportioned */}
        <div className="mb-6 rounded overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto max-h-96 object-cover"
          />
          <p className="text-xs text-gray-500 mt-2 text-right">Photo by <a href="https://aaddyy.com" target="_blank" rel="noopener noreferrer">AADDYY</a></p>
        </div>

        {/* Article Content */}
        <div className="prose max-w-none">
          {renderContent(blog.content)}
        </div>

        {/* Share Section */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Share this article</h3>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-xs font-semibold">
              Twitter
            </button>
            <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors text-xs font-semibold">
              Facebook
            </button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors text-xs font-semibold">
              Copy Link
            </button>
          </div>
        </div>

        {/* Back Button (Bottom) */}
        <div className="mt-10 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </button>
        </div>
      </article>

      {/* Footer */}
      <Footer sections={[]} website={{ adsEnabled: false, adsApproved: false }} domain={domain} />
    </div>
  );
}

function Header({ domain, onContactClick }: { domain: { name: string }; onContactClick?: () => void }) {
  const domainName = domain.name.split('.')[0].toUpperCase();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Debounce to reduce rapid state changes
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        // Add hysteresis - larger gap between thresholds
        if (currentScrollY > 200 && !isScrolled) {
          setIsScrolled(true);
        } else if (currentScrollY < 50 && isScrolled) {
          setIsScrolled(false);
        }
      }, 50); // 50ms debounce
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isScrolled]);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar - Hide when scrolled */}
      <div 
        className="bg-gray-900 text-white overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isScrolled ? '0px' : '48px',
          opacity: isScrolled ? 0 : 1,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-4">
              {onContactClick && (
                <button
                  onClick={onContactClick}
                  className="text-white hover:text-gray-300 transition-colors text-xs font-semibold"
                >
                  CONTACT US
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Shrinks when scrolled */}
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out"
        style={{
          paddingTop: isScrolled ? '0.5rem' : '1.5rem',
          paddingBottom: isScrolled ? '0.5rem' : '1.5rem',
        }}
      >
        <div className="flex justify-center">
          <a 
            href="/"
            className="text-center cursor-pointer group"
          >
            <h1 
              className="font-serif font-bold text-gray-900 group-hover:text-blue-600 transition-all duration-500 ease-in-out"
              style={{
                fontSize: isScrolled ? '1.5rem' : '3rem',
                lineHeight: isScrolled ? '2rem' : '1',
              }}
            >
              {domainName}
            </h1>
            <div 
              className="bg-gradient-to-r from-blue-600 to-red-600 group-hover:from-blue-700 group-hover:to-red-700 transition-all duration-500 ease-in-out"
              style={{
                height: isScrolled ? '2px' : '4px',
                marginTop: isScrolled ? '0.25rem' : '0.5rem',
              }}
            ></div>
          </a>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ section, blogs, onBlogClick }: { section: Section | undefined; blogs: Blog[]; onBlogClick: (blog: Blog) => void }) {
  // Use first blog as featured content, or fallback to hero section blocks
  const featuredBlog = blogs[0];
  const textBlock = section?.blocks.find((b) => b.type === 'text');
  const imageBlock = section?.blocks.find((b) => b.type === 'image');

  // Get first 3 unique blogs for sidebar
  const sidebarBlogs = blogs.slice(0, 3);

  // Use featured blog if available, otherwise use hero section blocks
  const heroTitle = featuredBlog?.title || textBlock?.content?.text;
  const heroImage = featuredBlog?.image || imageBlock?.content?.url;

  return (
    <section className="mb-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Featured Article */}
        <div className="lg:col-span-2">
          <div 
            className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => featuredBlog && onBlogClick(featuredBlog)}
          >
            {heroImage && (
              <div className="relative h-80">
                <img
                  src={heroImage}
                  alt={heroTitle || 'Featured'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                {heroTitle && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h2 className="text-2xl font-bold leading-tight mb-2">
                      {heroTitle}
                    </h2>
                    <div className="flex items-center text-xs mt-2">
                      <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold mr-2">
                        FEATURED
                      </span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Articles - First 3 unique blogs */}
        <div className="space-y-3">
          {sidebarBlogs.map((blog, index) => (
            <div 
              key={blog.sectionId} 
              onClick={() => onBlogClick(blog)}
              className="bg-white rounded shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogsGrid({ blogs, onBlogClick }: { blogs: Blog[]; onBlogClick: (blog: Blog) => void }) {
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">
          Latest Stories
        </h2>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {blogs.map((blog) => (
          <article
            key={blog.sectionId}
            onClick={() => onBlogClick(blog)}
            className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-1 mb-2">
                <span className="text-xs font-semibold text-blue-600 uppercase">Article</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {blog.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {blog.preview}
              </p>
              <div className="mt-3">
                <span className="text-blue-600 text-xs font-semibold group-hover:underline">
                  Read More →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactFormPage({ domain, onBack }: { domain: { name: string }; onBack: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top when contact form opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/public/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.name,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header domain={domain} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have a question or want to get in touch? Fill out the form below and we'll get back to you soon.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Thank You!</h3>
              <p className="text-green-700">
                Your message has been sent successfully. We'll get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer sections={[]} website={{ adsEnabled: false, adsApproved: false }} domain={domain} />
    </div>
  );
}


function Footer({ sections, website, domain, onContactClick }: { sections: Section[]; website: any; domain: { name: string }; onContactClick?: () => void }) {
  const footerSection = sections.find((s) => s.type === 'footer');
  const textBlock = footerSection?.blocks.find((b) => b.type === 'text');

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted source for {domain.name.split('.')[0]} news and information.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              {onContactClick && (
                <li>
                  <button
                    onClick={onContactClick}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
              )}
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Articles</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">News</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Insights</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <p className="text-gray-400 text-sm mb-4">Stay connected with our latest updates</p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {domain.name}. All rights reserved.
          </p>
        </div>

        {/* Ads Section */}
        {website.adsEnabled && website.adsApproved && (
          <div className="mt-8 text-center">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-500">Advertisement</p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

