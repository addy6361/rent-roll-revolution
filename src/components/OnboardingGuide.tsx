
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, CreditCard, Building2, Users, FileText, BarChart3, X, Play, Pause } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  action?: string;
  targetElement?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Complete Your Profile',
    description: 'Add your personal details, WhatsApp number, and profile photo to get started with RentFlow.',
    route: '/settings',
    icon: <User className="h-6 w-6" />,
    action: 'Fill in your full name and WhatsApp number',
    targetElement: '[data-testid="profile-form"]'
  },
  {
    id: 2,
    title: 'Setup Payment Methods',
    description: 'Configure your payment receiving methods like UPI ID, bank account details for seamless transactions.',
    route: '/settings',
    icon: <CreditCard className="h-6 w-6" />,
    action: 'Add your UPI ID or bank account details',
    targetElement: '[data-testid="payment-settings"]'
  },
  {
    id: 3,
    title: 'Add Your First Property',
    description: 'Register your property with rooms and beds to start managing your rentals effectively.',
    route: '/properties',
    icon: <Building2 className="h-6 w-6" />,
    action: 'Click "Add Property" and fill in property details'
  },
  {
    id: 4,
    title: 'Add Occupants/Tenants',
    description: 'Register your tenants with their contact details and assign them to specific beds.',
    route: '/occupants',
    icon: <Users className="h-6 w-6" />,
    action: 'Add tenant details and assign beds with rent amounts'
  },
  {
    id: 5,
    title: 'Manage Payments',
    description: 'Track rental payments, generate invoices, and mark payments as received.',
    route: '/payments',
    icon: <FileText className="h-6 w-6" />,
    action: 'View payment dashboard and manage collections'
  },
  {
    id: 6,
    title: 'View Reports & Analytics',
    description: 'Monitor your rental business performance with detailed reports and insights.',
    route: '/reports',
    icon: <BarChart3 className="h-6 w-6" />,
    action: 'Explore occupancy rates and revenue analytics'
  }
];

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  autoStart?: boolean;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ 
  isOpen, 
  onClose, 
  autoStart = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const navigate = useNavigate();

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        // Auto-advance every 8 seconds when playing
        handleNext();
      }, 8000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Navigate to the next step's route
      if (onboardingSteps[nextStep].route) {
        navigate(onboardingSteps[nextStep].route);
      }
    } else {
      // Guide completed
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Navigate to the previous step's route
      if (onboardingSteps[prevStep].route) {
        navigate(onboardingSteps[prevStep].route);
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (onboardingSteps[stepIndex].route) {
      navigate(onboardingSteps[stepIndex].route);
    }
  };

  const handleSkipStep = () => {
    handleNext();
  };

  const handleSkipGuide = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkipGuide = () => {
    onClose();
    setShowSkipConfirm(false);
  };

  const handleGoToStep = () => {
    // Navigate to current step and highlight target element
    if (currentStepData.route) {
      navigate(currentStepData.route);
    }
    
    // If target element is specified, scroll to it and highlight
    if (currentStepData.targetElement) {
      setTimeout(() => {
        const element = document.querySelector(currentStepData.targetElement!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-75');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-75');
          }, 3000);
        }
      }, 500);
    }
  };

  if (showSkipConfirm) {
    return (
      <Dialog open={true} onOpenChange={() => setShowSkipConfirm(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Skip Onboarding Guide?</DialogTitle>
            <DialogDescription>
              Are you sure you want to skip the setup guide? You can always access it later from the help menu.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowSkipConfirm(false)} className="flex-1">
              Continue Guide
            </Button>
            <Button onClick={confirmSkipGuide} className="flex-1">
              Skip Guide
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Welcome to RentFlow! 🏠
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkipGuide}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Let's set up your rental management system step by step
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Navigation Pills - Mobile Responsive */}
        <div className="flex flex-wrap gap-2 py-2">
          {onboardingSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all
                ${index === currentStep 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : index < currentStep 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
                ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              `}
              disabled={index > currentStep}
            >
              <span className="hidden sm:inline">{step.icon}</span>
              <span className="truncate max-w-24 sm:max-w-none">{step.title}</span>
              {index < currentStep && <span className="text-green-500">✓</span>}
            </button>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {currentStepData.icon}
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              <p className="text-gray-600">{currentStepData.description}</p>
              {currentStepData.action && (
                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-800">
                    <strong>Action:</strong> {currentStepData.action}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Auto-play Controls */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause Guide' : 'Auto Guide'}
            </Button>
            <span className="text-xs text-gray-500">
              {isPlaying ? 'Auto-advancing in 8s' : 'Manual navigation'}
            </span>
          </div>
        </div>

        {/* Action Buttons - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSkipStep}
              className="flex-1 sm:flex-none"
            >
              Skip Step
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGoToStep}
              variant="secondary"
              className="flex items-center gap-2"
            >
              Take Me There
            </Button>
            
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile-specific help text */}
        <div className="sm:hidden bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            💡 Tip: Use horizontal scroll on step pills to see all steps
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
