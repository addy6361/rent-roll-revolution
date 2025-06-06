
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Loader2, Home, Bed, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddPropertyDialog } from '@/components/AddPropertyDialog';

export const Properties: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [isAddBedDialogOpen, setIsAddBedDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties with rooms and beds
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          rooms (
            *,
            beds (
              *,
              assignments (
                id,
                start_date,
                end_date,
                occupants (
                  id,
                  full_name
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

  // Add room mutation
  const addRoomMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const roomData = {
        property_id: selectedProperty.id,
        label: formData.get('label') as string,
        type: formData.get('type') as string,
      };

      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties-detailed'] });
      setIsAddRoomDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Room added successfully',
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

  // Add bed mutation
  const addBedMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const bedData = {
        room_id: selectedRoom.id,
        label: formData.get('label') as string,
      };

      const { data, error } = await supabase
        .from('beds')
        .insert([bedData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties-detailed'] });
      setIsAddBedDialogOpen(false);
      setSelectedRoom(null);
      toast({
        title: 'Success',
        description: 'Bed added successfully',
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

  // Toggle bed occupancy mutation
  const toggleBedOccupancyMutation = useMutation({
    mutationFn: async ({ bedId, newStatus }: { bedId: string, newStatus: string }) => {
      const { data, error } = await supabase
        .from('beds')
        .update({ occupancy_status: newStatus })
        .eq('id', bedId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties-detailed'] });
      toast({
        title: 'Success',
        description: 'Bed status updated successfully',
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

  const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addRoomMutation.mutate(formData);
  };

  const handleAddBed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addBedMutation.mutate(formData);
  };

  const toggleBedStatus = (bedId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'vacant' ? 'occupied' : 'vacant';
    toggleBedOccupancyMutation.mutate({ bedId, newStatus });
  };

  if (isLoading) {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your properties, rooms, and beds
          </p>
        </div>
        <AddPropertyDialog />
      </div>

      {properties?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first property</p>
            <AddPropertyDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties?.map((property) => (
            <Card key={property.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{property.name}</span>
                  <Badge variant="outline">
                    {property.rooms?.length || 0} rooms
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {property.address}, {property.city}, {property.state} - {property.pincode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms</TabsTrigger>
                    <TabsTrigger value="beds">Beds</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Home className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                        <p className="text-sm font-medium text-blue-900">
                          {property.rooms?.length || 0}
                        </p>
                        <p className="text-xs text-blue-600">Rooms</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Bed className="h-6 w-6 mx-auto mb-1 text-green-600" />
                        <p className="text-sm font-medium text-green-900">
                          {property.rooms?.reduce((total: number, room: any) => total + (room.beds?.length || 0), 0) || 0}
                        </p>
                        <p className="text-xs text-green-600">Beds</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Users className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                        <p className="text-sm font-medium text-purple-900">
                          {property.rooms?.reduce((total: number, room: any) => 
                            total + (room.beds?.filter((bed: any) => bed.occupancy_status === 'occupied').length || 0), 0
                          ) || 0}
                        </p>
                        <p className="text-xs text-purple-600">Occupied</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rooms" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Rooms</h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedProperty(property);
                            setIsAddRoomDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Room
                        </Button>
                      </div>
                      {property.rooms?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No rooms added yet</p>
                      ) : (
                        <div className="space-y-2">
                          {property.rooms?.map((room: any) => (
                            <div key={room.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{room.label}</span>
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {room.type}
                                </Badge>
                              </div>
                              <span className="text-sm text-gray-600">
                                {room.beds?.length || 0} beds
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="beds" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">All Beds</h4>
                      </div>
                      {property.rooms?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Add rooms first to create beds</p>
                      ) : (
                        <div className="space-y-3">
                          {property.rooms?.map((room: any) => (
                            <div key={room.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-medium text-sm">{room.label}</h5>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRoom(room);
                                    setIsAddBedDialogOpen(true);
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Bed
                                </Button>
                              </div>
                              {room.beds?.length === 0 ? (
                                <p className="text-xs text-gray-500">No beds in this room</p>
                              ) : (
                                <div className="grid grid-cols-1 gap-2">
                                  {room.beds?.map((bed: any) => {
                                    const currentOccupant = bed.assignments?.find((a: any) => !a.end_date)?.occupants;
                                    return (
                                      <div key={bed.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                                        <div className="flex items-center gap-2">
                                          <span>{bed.label}</span>
                                          <Badge 
                                            variant={bed.occupancy_status === 'occupied' ? 'default' : 'secondary'}
                                            className="text-xs"
                                          >
                                            {bed.occupancy_status}
                                          </Badge>
                                          {currentOccupant && (
                                            <span className="text-xs text-gray-600">
                                              ({currentOccupant.full_name})
                                            </span>
                                          )}
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => toggleBedStatus(bed.id, bed.occupancy_status)}
                                          disabled={toggleBedOccupancyMutation.isPending}
                                        >
                                          {bed.occupancy_status === 'vacant' ? (
                                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                                          ) : (
                                            <ToggleRight className="h-4 w-4 text-green-600" />
                                          )}
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Room Dialog */}
      <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Add a room to {selectedProperty?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Room Label</Label>
              <Input
                id="label"
                name="label"
                placeholder="e.g., Room 101"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="dorm">Dorm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={addRoomMutation.isPending}
            >
              {addRoomMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Room
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Bed Dialog */}
      <Dialog open={isAddBedDialogOpen} onOpenChange={setIsAddBedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
            <DialogDescription>
              Add a bed to {selectedRoom?.label}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBed} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Bed Label</Label>
              <Input
                id="label"
                name="label"
                placeholder="e.g., Bed A"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={addBedMutation.isPending}
            >
              {addBedMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Bed
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
