
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Settings } from 'lucide-react';

interface PaymentSetting {
  id: string;
  payment_method: string;
  upi_id: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  account_holder_name: string | null;
  qr_code_url: string | null;
  is_active: boolean;
}

export const PaymentSettings: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    payment_method: '',
    upi_id: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentSettings, isLoading } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PaymentSetting[];
    },
  });

  const addPaymentSettingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const settingData = {
        owner_id: user.id,
        payment_method: data.payment_method,
        upi_id: data.upi_id || null,
        account_number: data.account_number || null,
        ifsc_code: data.ifsc_code || null,
        account_holder_name: data.account_holder_name || null,
      };

      const { data: result, error } = await supabase
        .from('payment_settings')
        .insert(settingData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
      setIsAdding(false);
      setFormData({
        payment_method: '',
        upi_id: '',
        account_number: '',
        ifsc_code: '',
        account_holder_name: '',
      });
      toast({
        title: 'Success',
        description: 'Payment method added successfully',
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

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('payment_settings')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
      toast({
        title: 'Success',
        description: 'Payment method updated successfully',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentSettingMutation.mutate(formData);
  };

  const renderMethodFields = () => {
    const method = formData.payment_method;
    
    if (method === 'paytm' || method === 'gpay' || method === 'phonepe' || method === 'upi') {
      return (
        <div className="space-y-2">
          <Label htmlFor="upi_id">UPI ID</Label>
          <Input
            id="upi_id"
            value={formData.upi_id}
            onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
            placeholder="user@paytm or user@okaxis"
            required
          />
        </div>
      );
    }

    if (method === 'bank_transfer') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="account_holder_name">Account Holder Name</Label>
            <Input
              id="account_holder_name"
              value={formData.account_holder_name}
              onChange={(e) => setFormData(prev => ({ ...prev, account_holder_name: e.target.value }))}
              placeholder="Full name as per bank"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              value={formData.account_number}
              onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
              placeholder="Bank account number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ifsc_code">IFSC Code</Label>
            <Input
              id="ifsc_code"
              value={formData.ifsc_code}
              onChange={(e) => setFormData(prev => ({ ...prev, ifsc_code: e.target.value }))}
              placeholder="Bank IFSC code"
              required
            />
          </div>
        </>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Payment Settings</h3>
          <p className="text-sm text-gray-600">Configure your payment receiving methods</p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
            <CardDescription>Configure a new way to receive payments</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paytm">Paytm</SelectItem>
                    <SelectItem value="gpay">Google Pay</SelectItem>
                    <SelectItem value="phonepe">PhonePe</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderMethodFields()}

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={addPaymentSettingMutation.isPending}
                >
                  {addPaymentSettingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Payment Method
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {paymentSettings?.map((setting) => (
          <Card key={setting.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium capitalize">
                    {setting.payment_method.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {setting.upi_id && `UPI: ${setting.upi_id}`}
                    {setting.account_number && `Account: ****${setting.account_number.slice(-4)}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={setting.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleActiveMutation.mutate({
                      id: setting.id,
                      is_active: !setting.is_active
                    })}
                  >
                    {setting.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
