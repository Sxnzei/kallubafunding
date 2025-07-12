import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatTimeLeft } from '@/lib/utils';
import { Calendar, Users } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    subtitle?: string;
    heroImageUrl?: string;
    goal: string;
    pledged: string;
    backerCount: number;
    endDate: Date;
    status: string;
  };
  className?: string;
}

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const pledgedAmount = parseFloat(project.pledged);
  const goalAmount = parseFloat(project.goal);
  const progressPercentage = Math.min((pledgedAmount / goalAmount) * 100, 100);
  const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`bg-white rounded-xl shadow-lg overflow-hidden card-hover-shadow transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="relative">
        <img 
          src={project.heroImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {project.status}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {project.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                ${pledgedAmount.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                of ${goalAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {Math.round(progressPercentage)}% funded
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended'}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{project.backerCount} backers</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


