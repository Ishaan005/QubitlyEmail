import React from 'react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample blog post cards */}
          {[1, 2, 3, 4, 5, 6].map((post) => (
            <div key={post} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Blog Post {post}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">This is a sample blog post description. Click to read more.</p>
              <a href="#" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Read more</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}