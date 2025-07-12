import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { CategoryCard } from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Search, Plus, Rocket } from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const { data: featuredProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects/featured'],
    staleTime: 300000,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 300000,
  });

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % Math.max(1, featuredProjects.length - 2));
  };

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + Math.max(1, featuredProjects.length - 2)) % Math.max(1, featuredProjects.length - 2));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Fuel Africa's </span>
            <span className="gradient-text">Brightest Ideas</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the movement transforming Africa through innovation. Back groundbreaking projects, support visionary creators, and be part of the future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/discover">
              <Button 
                size="lg" 
                className="bg-[#1877F2] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#166FE5] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center hover-lift"
              >
                <Search className="mr-2 w-5 h-5" />
                Explore Projects
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-[#1877F2] hover:text-[#1877F2] transition-all duration-200 flex items-center hover-lift"
              >
                <Plus className="mr-2 w-5 h-5" />
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured from Africa Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured from Africa</h2>
              <p className="text-gray-600">Discover innovative projects across the continent</p>
            </div>
            <div className="flex items-center space-x-4 animate-slide-in-right">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow hover-grow"
                onClick={prevFeatured}
                disabled={featuredProjects.length <= 3}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow hover-grow"
                onClick={nextFeatured}
                disabled={featuredProjects.length <= 3}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(featuredIndex, featuredIndex + 3).map((project: any, index: number) => (
                <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-gray-600 mb-12">From technology to arts, find projects that inspire and make a difference</p>
          </div>
          
          {categoriesLoading ? (
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
              {categories.slice(0, 6).map((category: any, index: number) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CategoryCard category={category} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Plus Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          size="icon"
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-grow"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Kalluba</span>
              </div>
              <p className="text-gray-400">Fueling Africa's brightest ideas through innovative crowdfunding.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Discover</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Featured Projects</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Create</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Start a Project</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Creator Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kalluba. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
