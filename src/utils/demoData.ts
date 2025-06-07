
import { supabase } from '@/integrations/supabase/client';

export const createDemoData = async (userId: string) => {
  console.log('Creating demo data for user:', userId);
  
  try {
    // Create demo properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .insert([
        {
          name: 'Green Valley PG',
          address: '123 Green Valley Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          owner_id: userId
        },
        {
          name: 'Sunrise Hostel',
          address: '456 Sunrise Avenue',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          owner_id: userId
        }
      ])
      .select();

    if (propertiesError) throw propertiesError;

    if (properties && properties.length > 0) {
      // Create demo rooms for first property
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .insert([
          {
            property_id: properties[0].id,
            label: 'Room A1',
            type: 'shared'
          },
          {
            property_id: properties[0].id,
            label: 'Room A2',
            type: 'private'
          },
          {
            property_id: properties[1].id,
            label: 'Room B1',
            type: 'shared'
          }
        ])
        .select();

      if (roomsError) throw roomsError;

      if (rooms && rooms.length > 0) {
        // Create demo beds
        const { data: beds, error: bedsError } = await supabase
          .from('beds')
          .insert([
            { room_id: rooms[0].id, label: 'Bed 1', occupancy_status: 'occupied' },
            { room_id: rooms[0].id, label: 'Bed 2', occupancy_status: 'vacant' },
            { room_id: rooms[1].id, label: 'Bed 1', occupancy_status: 'occupied' },
            { room_id: rooms[2].id, label: 'Bed 1', occupancy_status: 'vacant' },
            { room_id: rooms[2].id, label: 'Bed 2', occupancy_status: 'vacant' }
          ])
          .select();

        if (bedsError) throw bedsError;

        // Create demo occupants
        const { data: occupants, error: occupantsError } = await supabase
          .from('occupants')
          .insert([
            {
              full_name: 'Rahul Sharma',
              phone: '+91-9876543210',
              email: 'rahul.sharma@email.com',
              address: 'Mumbai, Maharashtra',
              owner_id: userId
            },
            {
              full_name: 'Priya Patel',
              phone: '+91-9876543211',
              email: 'priya.patel@email.com',
              address: 'Pune, Maharashtra',
              owner_id: userId
            }
          ])
          .select();

        if (occupantsError) throw occupantsError;

        if (occupants && beds && occupants.length > 0 && beds.length > 0) {
          // Create demo assignments
          const { data: assignments, error: assignmentsError } = await supabase
            .from('assignments')
            .insert([
              {
                occupant_id: occupants[0].id,
                bed_id: beds[0].id,
                start_date: '2024-01-01',
                end_date: null
              },
              {
                occupant_id: occupants[1].id,
                bed_id: beds[2].id,
                start_date: '2024-01-15',
                end_date: null
              }
            ])
            .select();

          if (assignmentsError) throw assignmentsError;

          if (assignments && assignments.length > 0) {
            // Create demo payments
            await supabase
              .from('payments')
              .insert([
                {
                  assignment_id: assignments[0].id,
                  amount_due: 8000,
                  amount_paid: 8000,
                  month: 'January 2024',
                  status: 'paid',
                  paid_at: '2024-01-05T10:00:00Z'
                },
                {
                  assignment_id: assignments[0].id,
                  amount_due: 8000,
                  amount_paid: 0,
                  month: 'February 2024',
                  status: 'pending'
                },
                {
                  assignment_id: assignments[1].id,
                  amount_due: 7500,
                  amount_paid: 7500,
                  month: 'January 2024',
                  status: 'paid',
                  paid_at: '2024-01-20T15:30:00Z'
                }
              ]);
          }
        }
      }
    }

    console.log('Demo data created successfully');
    return true;
  } catch (error) {
    console.error('Error creating demo data:', error);
    return false;
  }
};

export const hasDemoData = async (userId: string): Promise<boolean> => {
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id')
      .eq('owner_id', userId)
      .limit(1);
    
    return (properties && properties.length > 0) || false;
  } catch (error) {
    console.error('Error checking demo data:', error);
    return false;
  }
};
