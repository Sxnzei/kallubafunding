// client/src/pages/Discover.tsx
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useProjects } from '@/hooks/useProjects';
import { useCategories } from '@/hooks/useCategories';
import { ProjectCard } from '@/components/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';

const Discover: React.FC = () => {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  if (projectsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center mt-32">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1877F2]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Projects</h1>
            <p className="text-gray-600">
              Explore innovative projects from creators across Africa
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer hover:bg-[#1877F2] hover:text-white">
              All
            </Badge>
            {categories?.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="cursor-pointer hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Discover;