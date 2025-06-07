
import React from 'react';
import { FeedbackForm } from '@/components/FeedbackForm';

export const Feedback: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Share your experience with our property management system
        </p>
      </div>

      <FeedbackForm />
    </div>
  );
};
