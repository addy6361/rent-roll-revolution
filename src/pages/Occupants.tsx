import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Phone, Mail, MapPin, Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Occupants: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedOccupant, setSelectedOccupant] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch occupants
  const { data: occupants, isLoading: loadingOccupants } = useQuery({
    queryKey: ['occupants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('occupants')
        .select(`
          *,
          assignments (
            id,
            start_date,
            end_date,
            beds (
              id,
              label,
              rooms (
                id,
                label,
                properties (
                  id,
                  name
                )
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch available beds for assignment
  const { data: availableBeds } = useQuery({
    queryKey: ['available-beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select(`
          id,
          label,
          occupancy_status,
          rooms (
            id,
            label,
            properties (
              id,
              name
            )
          )
        `)
        .eq('occupancy_status', 'vacant');

      if (error) throw error;
      return data;
    },
  });

  // Add occupant mutation
  const addOccupantMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const occupantData = {
        full_name: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        address: formData.get('address') as string,
        owner_id: user.id,
      };

      const { data, error } = await supabase
        .from('occupants')
        .insert([occupantData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupants'] });
      setIsAddDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Occupant added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Assign bed mutation
  const assignBedMutation = useMutation({
    mutationFn: async ({ 
      occupantId, 
      bedId, 
      startDate, 
      monthlyRent, 
      depositAmount 
    }: { 
      occupantId: string, 
      bedId: string, 
      startDate: string,
      monthlyRent: number,
      depositAmount: number
    }) => {
      const { data, error } = await supabase
        .from('assignments')
        .insert([{
          occupant_id: occupantId,
          bed_id: bedId,
          start_date: startDate,
          monthly_rent: monthlyRent,
          deposit_amount: depositAmount,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update bed occupancy status
      await supabase
        .from('beds')
        .update({ occupancy_status: 'occupied' })
        .eq('id', bedId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupants'] });
      queryClient.invalidateQueries({ queryKey: ['available-beds'] });
      setIsAssignDialogOpen(false);
      setSelectedOccupant(null);
      toast({
        title: 'Success',
        description: 'Bed assigned successfully! Redirecting to payments...',
      });
      // Redirect to payments page after successful assignment
      setTimeout(() => {
        navigate('/payments');
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddOccupant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addOccupantMutation.mutate(formData);
  };

  const handleAssignBed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bedId = formData.get('bedId') as string;
    const startDate = formData.get('startDate') as string;
    const monthlyRent = parseFloat(formData.get('monthlyRent') as string);
    const depositAmount = parseFloat(formData.get('depositAmount') as string || '0');

    if (!selectedOccupant || !bedId || !startDate || !monthlyRent) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    assignBedMutation.mutate({
      occupantId: selectedOccupant.id,
      bedId,
      startDate,
      monthlyRent,
      depositAmount,
    });
  };

  if (loadingOccupants) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Occupants</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your tenants and their assignments
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Occupant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Occupant</DialogTitle>
              <DialogDescription>
                Enter the occupant's details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddOccupant} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={addOccupantMutation.isPending}
              >
                {addOccupantMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Occupant
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Occupants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {occupants?.map((occupant) => {
          const currentAssignment = occupant.assignments?.find((a: any) => !a.end_date);
          
          return (
            <Card key={occupant.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{occupant.full_name}</CardTitle>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    currentAssignment ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentAssignment ? 'Assigned' : 'Unassigned'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {occupant.phone}
                </div>
                {occupant.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {occupant.email}
                  </div>
                )}
                {occupant.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {occupant.address}
                  </div>
                )}
                
                {currentAssignment ? (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      {currentAssignment.beds?.rooms?.properties?.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {currentAssignment.beds?.rooms?.label} - {currentAssignment.beds?.label}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Since: {new Date(currentAssignment.start_date).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedOccupant(occupant);
                      setIsAssignDialogOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Bed
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {occupants?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No occupants yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first occupant</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Occupant
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Assign Bed Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Bed & Set Payment Details</DialogTitle>
            <DialogDescription>
              Assign {selectedOccupant?.full_name} to a bed and set rent/deposit amounts
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignBed} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bedId">Available Beds</Label>
              <Select name="bedId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bed" />
                </SelectTrigger>
                <SelectContent>
                  {availableBeds?.map((bed) => (
                    <SelectItem key={bed.id} value={bed.id}>
                      {bed.rooms?.properties?.name} - {bed.rooms?.label} - {bed.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent (₹) <span className="text-red-500">*</span></Label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                placeholder="e.g., 5000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Security Deposit (₹)</Label>
              <Input
                id="depositAmount"
                name="depositAmount"
                type="number"
                placeholder="e.g., 10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={assignBedMutation.isPending}
            >
              {assignBedMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Bed & Create Payment Records
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
