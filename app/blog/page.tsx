import Link from 'next/link';

// Define the blog post data
const blogPosts = [
  {
    title: 'AI vs Human: The Future of Content Creation',
    slug: 'ai-vs-human',
    date: '2023-10-01',
  },
  // Add more blog posts here as needed
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Blog Posts</h1>
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{post.title}</h2>
              <small className="block mb-4 text-gray-500 dark:text-gray-400">{post.date}</small>
              <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}