'use client';

import React from 'react';
import { Star, Quote, Shield, Heart, Award, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PLATFORM_STATS } from '@/lib/dummyData';

const ENDORSEMENTS = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    title: 'Film Director',
    quote: 'Panthulu Garu helped us find the perfect pandit for our housewarming ceremony. The experience was seamless and the pandit was extremely knowledgeable.',
    image: '',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    title: 'Classical Dancer',
    quote: 'I regularly use Panthulu Garu for all our family ceremonies. The platform connects us with authentic and well-versed pandits who make every ritual meaningful.',
    image: '',
    rating: 5,
  },
  {
    id: '3',
    name: 'Dr. Venkatesh Rao',
    title: 'Physician & Philanthropist',
    quote: 'What a wonderful initiative! Panthulu Garu is preserving our rich cultural heritage by connecting the younger generation with experienced pandits.',
    image: '',
    rating: 5,
  },
  {
    id: '4',
    name: 'Lakshmi Devi',
    title: 'Author & Spiritual Teacher',
    quote: 'The pandits on this platform are verified and experienced. I am impressed by the quality of service and the dedication to maintaining traditional practices.',
    image: '',
    rating: 5,
  },
  {
    id: '5',
    name: 'Suresh Reddy',
    title: 'Business Leader',
    quote: 'We used Panthulu Garu for our office Vastu puja and the experience was excellent. The pandit was punctual, well-prepared, and conducted the ceremony beautifully.',
    image: '',
    rating: 5,
  },
  {
    id: '6',
    name: 'Annapurna Garu',
    title: 'Social Worker',
    quote: 'This platform is a blessing for our community. It makes it easy to find pandits for last-minute ceremonies and the booking process is very straightforward.',
    image: '',
    rating: 4,
  },
];

export default function CelebritiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Premium Hero */}
      <div className="bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#3d1a1a] text-white relative overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A017]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#E07B39]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Award className="h-4 w-4 text-[#D4A017]" />
            <span className="text-sm font-medium text-white/90">Trusted Voices</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Hear From Our{' '}
            <span className="gradient-text-gold">Community</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Renowned personalities and thousands of devotees trust Panthulu Garu for their sacred ceremonies.
          </p>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mt-10">
            {[
              { value: `${PLATFORM_STATS.totalPandits}+`, label: 'Verified Pandits' },
              { value: `${(PLATFORM_STATS.totalCeremonies / 1000).toFixed(0)}K+`, label: 'Ceremonies' },
              { value: `${PLATFORM_STATS.customerRating}`, label: 'Avg Rating' },
              { value: `${(PLATFORM_STATS.totalReviews / 1000).toFixed(1)}K+`, label: 'Reviews' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#D4A017]">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <Badge variant="saffron" className="mb-3">
            <Heart className="h-3 w-3 mr-1" />
            Testimonials
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">What People Are Saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENDORSEMENTS.map((endorsement) => (
            <Card key={endorsement.id} className="h-full card-premium overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#E07B39] via-[#D4A017] to-[#8B1A1A]" />
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-[#D4A017]/20 mb-3" />
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic text-sm">
                  &quot;{endorsement.quote}&quot;
                </p>
                <div className="flex items-center gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < endorsement.rating ? 'text-[#D4A017] fill-[#D4A017]' : 'text-gray-200'}`} />
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#E07B39] to-[#D4A017] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {endorsement.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{endorsement.name}</p>
                    <p className="text-xs text-[#E07B39]">{endorsement.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#E07B39] via-[#D4A017] to-[#E07B39] animate-gradient rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 pattern-bg opacity-10" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 mb-4">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Join the community</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join Thousands of Happy Devotees</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Experience the convenience of finding trusted pandits for all your ceremonies. Start your journey with Panthulu Garu today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pandits">
                <Button variant="secondary" size="lg" className="bg-white text-[#E07B39] hover:bg-gray-100 shadow-xl px-8">
                  Find a Pandit
                </Button>
              </Link>
              <Link href="/rituals">
                <Button variant="ghost" size="lg" className="text-white border-2 border-white/40 hover:bg-white/10 px-8">
                  Browse Rituals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
