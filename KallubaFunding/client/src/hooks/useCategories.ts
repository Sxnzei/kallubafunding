import { useQuery } from '@tanstack/react-query';

export function useCategories() {
  return useQuery({
    queryKey: ['/api/categories'],
    staleTime: 300000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['/api/categories', slug],
    enabled: !!slug,
    staleTime: 300000,
  });
}
