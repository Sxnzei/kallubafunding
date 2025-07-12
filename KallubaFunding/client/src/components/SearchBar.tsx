import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: number;
  title: string;
  subtitle: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['/api/search/suggestions', query],
    enabled: query.length > 2,
    staleTime: 300000, // 5 minutes
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      <div className={cn(
        "relative transition-all duration-200",
        isFocused && "scale-105"
      )}>
        <div className="absolute inset-0 glassmorphism rounded-lg"></div>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg glassmorphism backdrop-blur-md max-h-60 overflow-y-auto z-50">
          {isLoading && (
            <div className="p-4 text-sm text-gray-500">
              Searching...
            </div>
          )}
          
          {!isLoading && suggestions.length === 0 && query.length > 2 && (
            <div className="p-4 text-sm text-gray-500">
              No projects found
            </div>
          )}
          
          {suggestions.map((suggestion: SearchSuggestion) => (
            <div
              key={suggestion.id}
              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => {
                setQuery(suggestion.title);
                setIsOpen(false);
                setIsFocused(false);
              }}
            >
              <div className="font-medium text-gray-900">{suggestion.title}</div>
              {suggestion.subtitle && (
                <div className="text-sm text-gray-600">{suggestion.subtitle}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
