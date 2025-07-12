import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Laptop, 
  Palette, 
  Heart, 
  GraduationCap, 
  Leaf, 
  Music,
  Code,
  Stethoscope,
  TreePine
} from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    projectCount: number;
    iconName: string;
    color: string;
  };
  className?: string;
}

const iconMap = {
  'laptop-code': Code,
  'palette': Palette,
  'heartbeat': Heart,
  'graduation-cap': GraduationCap,
  'leaf': Leaf,
  'music': Music,
  'laptop': Laptop,
  'stethoscope': Stethoscope,
  'tree-pine': TreePine,
};

const colorMap = {
  'blue': 'bg-blue-100 text-blue-600',
  'purple': 'bg-purple-100 text-purple-600',
  'green': 'bg-green-100 text-green-600',
  'indigo': 'bg-indigo-100 text-indigo-600',
  'teal': 'bg-teal-100 text-teal-600',
  'pink': 'bg-pink-100 text-pink-600',
  'orange': 'bg-orange-100 text-orange-600',
  'red': 'bg-red-100 text-red-600',
};

export function CategoryCard({ category, className = "" }: CategoryCardProps) {
  const IconComponent = iconMap[category.iconName as keyof typeof iconMap] || Code;
  const colorClass = colorMap[category.color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';

  return (
    <Card className={`bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 ${className}`}>
      <CardContent className="p-8 text-center">
        <div className={`w-16 h-16 ${colorClass} rounded-xl flex items-center justify-center mx-auto mb-4`}>
          <IconComponent className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {category.name}
        </h3>
        <p className="text-gray-600">
          {category.projectCount} projects
        </p>
      </CardContent>
    </Card>
  );
}
