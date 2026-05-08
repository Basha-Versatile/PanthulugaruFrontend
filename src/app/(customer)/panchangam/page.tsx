'use client';

import React from 'react';
import { Calendar, Sun, Moon, Star, Clock, Sunrise, Sunset } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Static/demo panchangam data
const TODAY_PANCHANGAM = {
  date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  hinduDate: {
    month: 'Vaishakha',
    paksham: 'Shukla Paksha',
    tithi: 'Dashami',
    year: 'Shobhana',
    samvatsara: '2083',
  },
  timings: {
    sunrise: '05:42 AM',
    sunset: '06:48 PM',
    moonrise: '12:15 PM',
    moonset: '01:03 AM',
  },
  nakshatra: {
    name: 'Uttara Phalguni',
    startTime: '06:15 AM',
    endTime: '04:30 AM (next day)',
  },
  yoga: {
    name: 'Siddha',
    startTime: '08:45 AM',
    endTime: '07:12 AM (next day)',
  },
  karana: {
    name: 'Bava',
    startTime: '06:15 AM',
    endTime: '05:48 PM',
  },
  auspicious: [
    { name: 'Abhijit Muhurta', time: '11:50 AM - 12:42 PM' },
    { name: 'Amrit Kalam', time: '02:15 PM - 03:48 PM' },
    { name: 'Brahma Muhurta', time: '04:18 AM - 05:06 AM' },
  ],
  inauspicious: [
    { name: 'Rahu Kalam', time: '07:30 AM - 09:00 AM' },
    { name: 'Yamagandam', time: '10:30 AM - 12:00 PM' },
    { name: 'Gulika', time: '01:30 PM - 03:00 PM' },
    { name: 'Dur Muhurta', time: '08:24 AM - 09:12 AM' },
  ],
};

export default function PanchangamPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B1A1A] to-[#6B1414] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-[#D4A017]" />
            <h1 className="text-2xl sm:text-3xl font-bold">Daily Panchangam</h1>
          </div>
          <p className="text-white/80">{TODAY_PANCHANGAM.date}</p>
          <div className="flex gap-2 mt-3">
            <Badge className="bg-white/20 text-white border-white/30">{TODAY_PANCHANGAM.hinduDate.month}</Badge>
            <Badge className="bg-white/20 text-white border-white/30">{TODAY_PANCHANGAM.hinduDate.paksham}</Badge>
            <Badge className="bg-[#D4A017] text-white border-[#D4A017]">{TODAY_PANCHANGAM.hinduDate.tithi}</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tithi & Nakshatra */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-[#E07B39]" />
                Today&apos;s Tithi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-[#E07B39]/5 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#E07B39]">{TODAY_PANCHANGAM.hinduDate.tithi}</p>
                <p className="text-sm text-gray-500 mt-1">{TODAY_PANCHANGAM.hinduDate.paksham}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-3">
                  <p className="text-xs text-gray-500">Hindu Month</p>
                  <p className="font-medium text-sm">{TODAY_PANCHANGAM.hinduDate.month}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-3">
                  <p className="text-xs text-gray-500">Samvatsara</p>
                  <p className="font-medium text-sm">{TODAY_PANCHANGAM.hinduDate.samvatsara}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nakshatra & Yoga */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#D4A017]" />
                Nakshatra & Yoga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-[#D4A017]/10 rounded-lg p-4">
                <p className="text-sm text-gray-500">Nakshatra</p>
                <p className="font-semibold text-gray-900 dark:text-white">{TODAY_PANCHANGAM.nakshatra.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{TODAY_PANCHANGAM.nakshatra.startTime} - {TODAY_PANCHANGAM.nakshatra.endTime}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-4">
                <p className="text-sm text-gray-500">Yoga</p>
                <p className="font-semibold text-gray-900 dark:text-white">{TODAY_PANCHANGAM.yoga.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{TODAY_PANCHANGAM.yoga.startTime} - {TODAY_PANCHANGAM.yoga.endTime}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-4">
                <p className="text-sm text-gray-500">Karana</p>
                <p className="font-semibold text-gray-900 dark:text-white">{TODAY_PANCHANGAM.karana.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{TODAY_PANCHANGAM.karana.startTime} - {TODAY_PANCHANGAM.karana.endTime}</p>
              </div>
            </CardContent>
          </Card>

          {/* Sun & Moon Timings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-[#E07B39]" />
                Sun & Moon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50 dark:bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <Sunrise className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Sunrise</p>
                  <p className="font-semibold text-sm">{TODAY_PANCHANGAM.timings.sunrise}</p>
                </div>
                <div className="bg-orange-50 dark:bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <Sunset className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Sunset</p>
                  <p className="font-semibold text-sm">{TODAY_PANCHANGAM.timings.sunset}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <Moon className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Moonrise</p>
                  <p className="font-semibold text-sm">{TODAY_PANCHANGAM.timings.moonrise}</p>
                </div>
                <div className="bg-gray-100 dark:bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <Moon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Moonset</p>
                  <p className="font-semibold text-sm">{TODAY_PANCHANGAM.timings.moonset}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auspicious Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Clock className="h-5 w-5" />
                Auspicious Times (Shubh Muhurta)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {TODAY_PANCHANGAM.auspicious.map((time) => (
                  <div key={time.name} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">{time.name}</span>
                    <span className="text-sm text-green-600 dark:text-green-400">{time.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inauspicious Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Clock className="h-5 w-5" />
                Inauspicious Times (Ashubh)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {TODAY_PANCHANGAM.inauspicious.map((time) => (
                  <div key={time.name} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">{time.name}</span>
                    <span className="text-sm text-red-600 dark:text-red-400">{time.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>About Panchangam</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Panchangam (Panchanga) is the Hindu calendar and almanac that provides five key elements:
                Tithi (lunar day), Nakshatra (constellation), Yoga (luni-solar combination),
                Karana (half of tithi), and Vara (day of the week). It is used to determine
                auspicious timings for ceremonies, rituals, and important events.
              </p>
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-300">
                <strong>Note:</strong> This is demo data. Actual panchangam will be calculated based on your location and astronomical data.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
