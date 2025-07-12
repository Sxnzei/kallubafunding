import { useQuery } from '@tanstack/react-query';

export function useProjects(filters?: { category?: string; status?: string; limit?: number }) {
  const queryParams = new URLSearchParams();
  
  if (filters?.category) queryParams.append('category', filters.category);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());
  
  const queryString = queryParams.toString();
  const url = `/api/projects${queryString ? `?${queryString}` : ''}`;
  
  return useQuery({
    queryKey: ['/api/projects', filters],
    staleTime: 300000,
  });
}

export function useFeaturedProjects(limit = 6) {
  return useQuery({
    queryKey: ['/api/projects/featured', limit],
    staleTime: 300000,
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ['/api/projects', id],
    enabled: !!id,
    staleTime: 300000,
  });
}
