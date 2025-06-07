
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  CreditCard, 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const guideSteps = [
  {
    id: 'welcome',
    title: 'Welcome to RentFlow!',
    description: 'Your complete property management solution',
    icon: Building2,
    content: 'RentFlow helps you manage your PG, hostel, or rental properties efficiently. This guide will walk you through the essential steps to get started.',
    action: null
  },
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your personal details and contact information',
    icon: User,
    content: 'Go to Settings section to add your phone number (preferably WhatsApp number as payment links will be sent via this), profile photo (optional), and other details to complete your registration.',
    action: '/settings'
  },
  {
    id: 'payment-setup',
    title: 'Setup Payment Methods',
    description: 'Configure how you want to receive payments',
    icon: CreditCard,
    content: 'Navigate to Payments section and configure your UPI ID, bank account details, or other payment methods. This enables direct money transfer to your account when tenants pay.',
    action: '/payments'
  },
  {
    id: 'add-properties',
    title: 'Add Your Properties',
    description: 'Register all your properties in the system',
    icon: Building2,
    content: 'Add your PG, hostel, or rental properties with complete details including rooms and beds. This forms the foundation of your property management.',
    action: '/properties'
  },
  {
    id: 'add-occupants',
    title: 'Manage Occupants',
    description: 'Add tenant details and assign them to rooms',
    icon: Users,
    content: 'Add occupant details including their phone numbers and Gmail addresses. You can assign them to specific beds and manage their stay duration.',
    action: '/occupants'
  },
  {
    id: 'payments-tracking',
    title: 'Payment Tracking',
    description: 'Monitor rent collection and generate payment links',
    icon: FileText,
    content: 'The payment section helps you track monthly rent, send payment reminders, and generate QR codes for easy collection. All transactions are automatically recorded.',
    action: '/payments'
  },
  {
    id: 'reports-analytics',
    title: 'Reports & Analytics',
    description: 'Gain insights into your business performance',
    icon: BarChart3,
    content: 'View detailed reports on occupancy rates, payment trends, and property performance. These insights help you make informed business decisions.',
    action: '/reports'
  },
  {
    id: 'whatsapp-feature',
    title: 'WhatsApp Integration',
    description: 'Direct messaging to occupants',
    icon: MessageSquare,
    content: 'Send payment reminders, property updates, and communicate directly with your tenants via WhatsApp. (This feature is coming soon!)',
    action: null
  }
];

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipStep = () => {
    handleNext();
  };

  const handleSkipGuide = () => {
    setShowSkipWarning(true);
  };

  const confirmSkipGuide = () => {
    setShowSkipWarning(false);
    onClose();
  };

  const handleActionClick = () => {
    const step = guideSteps[currentStep];
    if (step.action) {
      navigate(step.action);
      onClose();
    }
  };

  const currentGuideStep = guideSteps[currentStep];
  const StepIcon = currentGuideStep.icon;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <StepIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl">{currentGuideStep.title}</DialogTitle>
                  <DialogDescription>{currentGuideStep.description}</DialogDescription>
                </div>
              </div>
              <Badge variant="outline">
                {currentStep + 1} of {guideSteps.length}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
              />
            </div>

            {/* Step Content */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed">
                  {currentGuideStep.content}
                </p>
                
                {currentGuideStep.id === 'whatsapp-feature' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Coming Soon</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      WhatsApp integration is currently under development and will be available soon.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSkipStep}
                  className="flex items-center space-x-2"
                >
                  <span>Skip Step</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSkipGuide}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Skip Guide
                </Button>
              </div>

              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                )}

                {currentGuideStep.action ? (
                  <Button
                    onClick={handleActionClick}
                    className="flex items-center space-x-2"
                  >
                    <span>Go to {currentGuideStep.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex items-center space-x-2"
                  >
                    <span>{currentStep === guideSteps.length - 1 ? 'Finish' : 'Next'}</span>
                    {currentStep < guideSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
                    {currentStep === guideSteps.length - 1 && <CheckCircle className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Skip Warning Dialog */}
      <Dialog open={showSkipWarning} onOpenChange={setShowSkipWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Skip Onboarding Guide?</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to skip the onboarding guide? This guide will help you set up RentFlow properly for managing your properties efficiently.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowSkipWarning(false)}>
              Continue Guide
            </Button>
            <Button variant="destructive" onClick={confirmSkipGuide}>
              Skip Guide
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
