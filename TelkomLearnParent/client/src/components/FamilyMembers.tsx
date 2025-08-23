import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Plus } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertFamilyMemberSchema, type FamilyMember, type InsertFamilyMember } from '@shared/schema';

interface FamilyMemberFormData extends InsertFamilyMember {}

export function FamilyMembers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: familyMembers = [], isLoading } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const form = useForm<FamilyMemberFormData>({
    resolver: zodResolver(insertFamilyMemberSchema),
    defaultValues: {
      name: '',
      role: 'student',
      age: 0,
      status: 'offline',
      studyTime: '0 hrs',
      studyProgress: 0,
      initials: ''
    }
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: FamilyMemberFormData) => {
      const response = await apiRequest('POST', '/api/family-members', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-members'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Family Member Added",
        description: "New family member has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add family member. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FamilyMemberFormData) => {
    // Generate initials from name
    const initials = data.name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
    
    createMemberMutation.mutate({
      ...data,
      initials,
      studyTime: data.role === 'adult' ? 'Self-managed' : '0 hrs study'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
           'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getInitialsColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200',
      'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
      'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-telkom-500 shadow-lg">
      <CardHeader className="border-b-2 border-telkom-500 bg-telkom-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-telkom-600 flex items-center gap-2">
              <Users className="w-6 h-6 text-telkom-500" />
              Family Members
            </CardTitle>
            <p className="text-base text-telkom-500">
              Monitor usage and progress for each family member
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-telkom-500 hover:bg-telkom-600 text-white"
                data-testid="button-add-member"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    data-testid="input-member-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    {...form.register('age', { valueAsNumber: true })}
                    data-testid="input-member-age"
                  />
                  {form.formState.errors.age && (
                    <p className="text-sm text-red-600">{form.formState.errors.age.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => form.setValue('role', value)} defaultValue="student">
                    <SelectTrigger data-testid="select-member-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="adult">Adult (18+)</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMemberMutation.isPending}
                    data-testid="button-submit"
                    className="bg-telkom-500 hover:bg-telkom-600 text-white"
                  >
                    {createMemberMutation.isPending ? 'Adding...' : 'Add Member'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {familyMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              data-testid={`member-${member.id}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getInitialsColor(index)}`}>
                  <span className="font-medium">{member.initials}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)} - Age {member.age}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {member.role !== 'adult' && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.studyTime}</p>
                    <div className="w-24 mt-1">
                      <Progress value={member.studyProgress || 0} className="h-2" />
                    </div>
                  </div>
                )}
                {member.role === 'adult' && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Self-managed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">No restrictions</p>
                  </div>
                )}
                <Badge className={getStatusColor(member.status)} data-testid={`status-${member.id}`}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
          {familyMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No family members added yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Member" to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
