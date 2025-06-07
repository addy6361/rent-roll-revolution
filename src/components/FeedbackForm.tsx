
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';

interface FeedbackQuestion {
  id: string;
  question: string;
  options: string[];
}

const feedbackQuestions: FeedbackQuestion[] = [
  {
    id: 'ease_of_use',
    question: 'How easy is it to navigate and use the RentFlow software?',
    options: ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult']
  },
  {
    id: 'property_management_needs',
    question: 'How well does the property management feature meet your needs?',
    options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
  },
  {
    id: 'occupant_management_satisfaction',
    question: 'How satisfied are you with the occupant management system?',
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
  },
  {
    id: 'payment_tracking_effectiveness',
    question: 'How effective is the payment tracking and collection feature?',
    options: ['Extremely Effective', 'Very Effective', 'Moderately Effective', 'Slightly Effective', 'Not Effective']
  },
  {
    id: 'reports_analytics_usefulness',
    question: 'How useful are the reports and analytics provided?',
    options: ['Extremely Useful', 'Very Useful', 'Moderately Useful', 'Slightly Useful', 'Not Useful']
  },
  {
    id: 'performance_speed_rating',
    question: 'How would you rate the overall performance and speed of the software?',
    options: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor']
  },
  {
    id: 'mobile_experience',
    question: 'How is your experience using the system on mobile devices?',
    options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
  },
  {
    id: 'recommendation_likelihood',
    question: 'How likely are you to recommend RentFlow to other property managers?',
    options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely']
  },
  {
    id: 'comparison_other_solutions',
    question: 'How well does RentFlow compare to other property management solutions you\'ve used?',
    options: ['Much Better', 'Better', 'About the Same', 'Worse', 'Much Worse']
  },
  {
    id: 'market_readiness',
    question: 'How ready do you think RentFlow is for commercial use in the market?',
    options: ['Completely Ready', 'Mostly Ready', 'Somewhat Ready', 'Needs Improvement', 'Not Ready']
  },
  {
    id: 'purchase_likelihood',
    question: 'How likely are you to purchase/subscribe to RentFlow for your business?',
    options: ['Definitely Will', 'Probably Will', 'Might', 'Probably Won\'t', 'Definitely Won\'t']
  }
];

export const FeedbackForm: React.FC = () => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [organizationName, setOrganizationName] = useState('');
  const [role, setRole] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [additionalComments, setAdditionalComments] = useState('');
  const { toast } = useToast();

  const submitFeedbackMutation = useMutation({
    mutationFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const feedbackData = {
        user_id: user.id,
        organization_name: organizationName,
        role: role,
        responses: responses,
        overall_rating: overallRating,
        additional_comments: additionalComments
      };

      const { data, error } = await supabase
        .from('feedback')
        .insert(feedbackData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your valuable feedback!',
      });
      // Reset form
      setResponses({});
      setOrganizationName('');
      setRole('');
      setOverallRating(0);
      setAdditionalComments('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(responses).length < feedbackQuestions.length) {
      toast({
        title: 'Incomplete Form',
        description: 'Please answer all questions before submitting.',
        variant: 'destructive',
      });
      return;
    }
    if (overallRating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please provide an overall rating.',
        variant: 'destructive',
      });
      return;
    }
    submitFeedbackMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RentFlow Client Feedback Form</CardTitle>
        <CardDescription>
          Help us improve RentFlow by sharing your experience with our property management system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <Input
                id="organization"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Your organization name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Property Manager, Owner, Director"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            {feedbackQuestions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-sm font-medium">
                  {index + 1}. {question.question}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        responses[question.id] === option
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={responses[question.id] === option}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Label>Overall Rating (1-5 stars) *</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className={`p-1 ${
                    star <= overallRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Any additional feedback, suggestions, or comments about RentFlow..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitFeedbackMutation.isPending}
          >
            {submitFeedbackMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
