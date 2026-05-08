'use client';

import React, { useState } from 'react';
import { Car, Shield, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const SERVICES = [
  { title: 'New Vehicle Puja', description: 'Blessing ceremony for your new car, bike, or any vehicle', icon: Car },
  { title: 'Accident Protection Puja', description: 'Special puja for safety and protection on the road', icon: Shield },
  { title: 'Commercial Fleet Puja', description: 'Puja for commercial vehicles, trucks, and fleet vehicles', icon: Car },
];

const BENEFITS = [
  'Traditional Vedic mantras for vehicle blessing',
  'Experienced pandits who specialize in vaahan puja',
  'Available for all vehicle types - cars, bikes, trucks',
  'Can be performed at your location or temple',
  'Coconut breaking and decoration included',
  'Auspicious date and time selection assistance',
];

export default function VaahanPujaPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [location, setLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    setSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Your inquiry has been submitted! We will contact you shortly.');
    setName('');
    setPhone('');
    setEmail('');
    setVehicleType('');
    setLocation('');
    setPreferredDate('');
    setMessage('');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#E07B39] to-[#c96a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Car className="h-10 w-10" />
              <Badge className="bg-white/20 text-white border-white/30">Vehicle Puja Service</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Vaahan Puja - Vehicle Blessing Ceremony</h1>
            <p className="text-white/80 text-lg">
              Get your vehicle blessed by experienced pandits with traditional Vedic rituals for safe travels and divine protection.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h2>
              <div className="space-y-4">
                {SERVICES.map((service) => (
                  <Card key={service.title}>
                    <CardContent className="p-5 flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-[#E07B39]/10 flex items-center justify-center flex-shrink-0">
                        <service.icon className="h-6 w-6 text-[#E07B39]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{service.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h2>
              <div className="space-y-3">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Inquiry form */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book a Vaahan Puja</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input label="Your Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
                  <Input label="Phone Number *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required />
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vehicle Type</label>
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white">
                      <option value="">Select vehicle type</option>
                      <option value="Car">Car</option>
                      <option value="Bike">Bike / Scooter</option>
                      <option value="Truck">Truck / Commercial</option>
                      <option value="Auto">Auto Rickshaw</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your city" />
                  <Input label="Preferred Date" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any special requirements..." rows={3} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white" />
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
    </div>
  );
}
