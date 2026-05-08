'use client';

import React from 'react';
import { X, Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ContactRevealPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  panthulugaruId: string;
  panthulugaruName: string;
  phone: string;
  email: string;
};

export function ContactRevealPopup({
  isOpen,
  onClose,
  panthulugaruId,
  panthulugaruName,
  phone,
  email,
}: ContactRevealPopupProps) {
  if (!isOpen) return null;

  const whatsappLink = phone ? `https://wa.me/91${phone.replace(/\D/g, '')}` : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Contact Unlocked!</h3>
            <p className="text-sm text-gray-500 mt-1">{panthulugaruName}&apos;s contact details</p>
          </div>

          <div className="space-y-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{phone}</p>
                </div>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                </div>
              </a>
            )}

            {phone && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <p className="text-sm font-medium text-green-700">Chat on WhatsApp</p>
                </div>
              </a>
            )}
          </div>

          <div className="mt-6">
            <Link href={`/book/${panthulugaruId}`}>
              <Button variant="primary" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
