'use client';

import { useRouter } from 'next/navigation';

/**
 * Custom 404 Not Found Page
 * 
 * Simple, clean 404 page shown when a route doesn't exist
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 text-lg mb-8">
          The link you clicked may be broken or the page may have been removed.
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  );
}
