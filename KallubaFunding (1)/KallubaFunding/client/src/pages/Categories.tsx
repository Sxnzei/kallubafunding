import React from 'react';
import { useParams } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { CategoryCard } from '@/components/CategoryCard';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Categories() {
  const params = useParams();
  const slug = params.slug;

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 300000,
  });

  if (slug) {
    // Show specific category page
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link href="/categories">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Category: {slug}</h1>
              <p className="text-gray-600 mt-2">Projects in this category</p>
            </div>
            
            <div className="text-center py-12">
              <p className="text-gray-500">Category details and projects will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h1>
            <p className="text-gray-600 mb-12">From technology to arts, find projects that inspire and make a difference</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-8 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category: any, index: number) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CategoryCard category={category} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
