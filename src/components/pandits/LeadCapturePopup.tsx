'use client';

import React, { useState } from 'react';
import { X, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createLead } from '@/lib/api/leads';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

type LeadCapturePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  panthulugaruId: string;
  panthulugaruName: string;
  onSuccess: () => void;
};

export function LeadCapturePopup({ isOpen, onClose, panthulugaruId, panthulugaruName, onSuccess }: LeadCapturePopupProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createLead({
        panthulugaruId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
        message: message || undefined,
      });
      if (response.success) {
        toast.success('Your inquiry has been submitted!');
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to submit inquiry');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Unlock Contact Details</h3>
          <p className="text-sm text-gray-500 mb-6">
            Share your details to unlock {panthulugaruName}&apos;s contact information
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
            <Input
              label="Phone Number *"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            <Input
              label="Email (optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Purpose / Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What service are you looking for?"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Submit & Unlock Contact
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
