'use client';

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createUnlockPayment } from '@/lib/api/payments';
import { createSecureUnlock } from '@/lib/api/leads';
import toast from 'react-hot-toast';

type PaymentGatePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  panthulugaruId: string;
  panthulugaruName: string;
  onPaymentSuccess: () => void;
};

type PaymentMethod = 'upi' | 'card' | 'netbanking';

export function PaymentGatePopup({
  isOpen,
  onClose,
  panthulugaruId,
  panthulugaruName,
  onPaymentSuccess,
}: PaymentGatePopupProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const UNLOCK_AMOUNT = 99;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Create payment order
      const paymentResponse = await createUnlockPayment(panthulugaruId);
      if (!paymentResponse.success || !paymentResponse.data) {
        toast.error(paymentResponse.message || 'Failed to create payment');
        setIsProcessing(false);
        return;
      }

      // Demo mode: simulate payment success
      const orderId = paymentResponse.data.orderId;

      // Simulate a short delay for the demo payment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create unlock
      const unlockResponse = await createSecureUnlock(panthulugaruId, orderId);
      if (unlockResponse.success) {
        toast.success('Payment successful! Contact unlocked.');
        onPaymentSuccess();
        onClose();
      } else {
        toast.error(unlockResponse.message || 'Failed to unlock contact');
      }
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'upi' as PaymentMethod, label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card' as PaymentMethod, label: 'Card', icon: CreditCard, desc: 'Credit or Debit Card' },
    { id: 'netbanking' as PaymentMethod, label: 'Net Banking', icon: Building2, desc: 'All major banks' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Unlock Contact Details</h3>
            <p className="text-sm text-gray-500 mt-1">
              Pay to unlock {panthulugaruName}&apos;s contact information
            </p>
          </div>

          {/* Amount display */}
          <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-gray-600">Amount to pay</p>
            <p className="text-3xl font-bold text-[#FF6B00]">
              &#8377;{UNLOCK_AMOUNT}
            </p>
            <p className="text-xs text-gray-500 mt-1">One-time payment for 30 days access</p>
          </div>

          {/* Payment methods */}
          <div className="space-y-2 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Select payment method</p>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  selectedMethod === method.id
                    ? 'border-[#FF6B00] bg-[#FF6B00]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  selectedMethod === method.id ? 'bg-[#FF6B00]/10' : 'bg-gray-100'
                }`}>
                  <method.icon className={`h-5 w-5 ${
                    selectedMethod === method.id ? 'text-[#FF6B00]' : 'text-gray-500'
                  }`} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${
                    selectedMethod === method.id ? 'text-[#FF6B00]' : 'text-gray-900'
                  }`}>
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500">{method.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Submit */}
          <Button
            variant="primary"
            className="w-full"
            size="lg"
            onClick={handlePayment}
            isLoading={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${UNLOCK_AMOUNT}`}
          </Button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5" />
            <span>Secure payment powered by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
