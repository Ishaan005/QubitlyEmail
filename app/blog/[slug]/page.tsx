import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// Define the blog post data (this should match the data in app/blog/page.tsx)
const blogPosts = [
  {
    title: 'AI vs Human: The Future of Content Creation',
    slug: 'ai-vs-human',
    date: '2023-10-01',
    content: 'aivshuman.md',
  },
  // Add more blog posts here as needed
];

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPostContent(slug: string) {
  const post = blogPosts.find((post) => post.slug === slug);
  if (!post) {
    return null;
  }

  const filePath = path.join(process.cwd(), 'app', 'blog', 'content', post.content);
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    return { ...post, content };
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostContent(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block">
          &larr; Back to all posts
        </Link>
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">{post.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{post.date}</p>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}