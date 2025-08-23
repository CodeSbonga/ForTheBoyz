import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, X, Shield, Plus } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { WhitelistSite, InsertWhitelistSite } from '@shared/schema';

export function WhitelistManagement() {
  const [newUrl, setNewUrl] = useState('');
  const { toast } = useToast();

  const { data: whitelistSites = [], isLoading } = useQuery<WhitelistSite[]>({
    queryKey: ['/api/whitelist-sites'],
  });

  const addSiteMutation = useMutation({
    mutationFn: async (siteData: InsertWhitelistSite) => {
      const response = await apiRequest('POST', '/api/whitelist-sites', siteData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist-sites'] });
      setNewUrl('');
      toast({
        title: "Site Added",
        description: "Educational site has been added to the whitelist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add site. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  });

  const removeSiteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/whitelist-sites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist-sites'] });
      toast({
        title: "Site Removed",
        description: "Site has been removed from the whitelist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove site. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddSite = () => {
    if (!newUrl.trim()) return;

    // Extract domain name from URL for display
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const name = domain.split('.')[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);

      addSiteMutation.mutate({
        name: displayName,
        url: domain
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSite = (id: string) => {
    removeSiteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-telkom-500 shadow-lg">
      <CardHeader className="border-b-2 border-telkom-500 bg-telkom-50">
        <CardTitle className="text-xl font-bold text-telkom-600 flex items-center gap-2">
          <Shield className="w-6 h-6 text-telkom-500" />
          Allowed Educational Sites
        </CardTitle>
        <p className="text-base text-telkom-500">
          Manage whitelisted educational platforms
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., khanacademy.org)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
              data-testid="input-whitelist-url"
              className="flex-1"
            />
            <Button
              onClick={handleAddSite}
              disabled={!newUrl.trim() || addSiteMutation.isPending}
              data-testid="button-add-whitelist"
              className="bg-telkom-500 hover:bg-telkom-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              {addSiteMutation.isPending ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {whitelistSites.map((site) => (
            <div
              key={site.id}
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              data-testid={`whitelist-site-${site.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{site.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{site.url}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSite(site.id)}
                disabled={removeSiteMutation.isPending}
                data-testid={`button-remove-${site.id}`}
                className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          {whitelistSites.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No educational sites whitelisted yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Add educational websites that students can always access.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
