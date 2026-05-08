'use client';

import React, { useState } from 'react';
import { Calendar, Check, Star, Phone, Mail, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const PLANS = [
  {
    name: 'Basic',
    price: 4999,
    period: 'month',
    description: 'Essential monthly pandit services',
    features: [
      'Weekly puja at home',
      'Festival puja guidance',
      'Phone consultation',
      'Basic ritual items provided',
    ],
    popular: false,
  },
  {
    name: 'Standard',
    price: 9999,
    period: 'month',
    description: 'Comprehensive spiritual services',
    features: [
      'Bi-weekly puja at home',
      'All festival pujas included',
      'Priority phone consultation',
      'Ritual items provided',
      'Monthly Satyanarayana Puja',
      'Family horoscope consultation',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 19999,
    period: 'month',
    description: 'Complete spiritual care package',
    features: [
      'Weekly puja at home',
      'All festival pujas included',
      '24/7 consultation support',
      'All ritual items provided',
      'Monthly Satyanarayana Puja',
      'Family horoscope consultation',
      'Navagraha and special pujas',
      'Personal pandit assigned',
      'Death anniversary management',
    ],
    popular: false,
  },
];

export default function MonthlyHirePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Your inquiry has been submitted! We will contact you shortly.');
    setName('');
    setPhone('');
    setEmail('');
    setSelectedPlan('');
    setCity('');
    setMessage('');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#8B1A1A] to-[#6B1414] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <Calendar className="h-12 w-12 text-[#D4A017] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Monthly Pandit Hire</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Subscribe to monthly pandit services for regular pujas, festival ceremonies, and spiritual guidance for your family.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-[#E07B39] border-2 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="saffron" className="shadow-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 pt-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#E07B39]">&#8377;{plan.price.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full mt-6"
                  onClick={() => {
                    setSelectedPlan(plan.name);
                    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Inquiry Form */}
        <div id="inquiry-form" className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Get Started - Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Your Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
                <Input label="Phone Number *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preferred Plan</label>
                  <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white">
                    <option value="">Select a plan</option>
                    {PLANS.map((p) => <option key={p.name} value={p.name}>{p.name} - ₹{p.price}/month</option>)}
                  </select>
                </div>
                <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any specific requirements..." rows={3} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white" />
                </div>
                <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                  Submit Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
