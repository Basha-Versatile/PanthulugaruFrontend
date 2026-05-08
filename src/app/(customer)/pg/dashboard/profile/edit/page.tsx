'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, User, Phone, BookOpen, MapPin, Building2, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { usePGAuth } from '@/contexts/PGAuthContext';
import { getFullProfile, updateProfile } from '@/lib/api/pgDashboard';
import { getAvailableRituals, getAvailableLocations } from '@/lib/api/pgAuth';
import type { Panthulugaru, Ritual, ServiceAreaEntry } from '@/types';
import toast from 'react-hot-toast';

function ProfileEditContent() {
  const { user, refreshProfile, featureAccess } = usePGAuth();
  const [profile, setProfile] = useState<Panthulugaru | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [gender, setGender] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);

  // Contact
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Rituals
  const [availableRituals, setAvailableRituals] = useState<Ritual[]>([]);
  const [selectedRitualIds, setSelectedRitualIds] = useState<string[]>([]);

  // Service Areas
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaEntry[]>([]);
  const [newState, setNewState] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newCity, setNewCity] = useState('');

  // Bank Details
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, ritualsRes] = await Promise.all([
        getFullProfile(),
        getAvailableRituals(),
      ]);

      if (profileRes.success && profileRes.data) {
        const p = profileRes.data;
        setProfile(p);
        setFirstName(p.firstName || '');
        setLastName(p.lastName || '');
        setExperience(p.experience?.toString() || '');
        setQualification(p.qualification || '');
        setAboutMe(p.aboutMe || '');
        setGender(p.gender || '');
        setLanguages(p.languages || []);
        setPhone(p.phone || '');
        setEmail(p.email || '');
        setSelectedRitualIds(p.rituals?.map((r) => r.ritualId) || []);
        setServiceAreas(p.serviceAreas || []);
        if (p.bankDetails) {
          setAccountHolderName(p.bankDetails.accountHolderName || '');
          setAccountNumber(p.bankDetails.accountNumber || '');
          setIfscCode(p.bankDetails.ifscCode || '');
          setBankName(p.bankDetails.bankName || '');
          setUpiId(p.bankDetails.upiId || '');
        }
      }

      if (ritualsRes.success && ritualsRes.data) {
        setAvailableRituals(ritualsRes.data);
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (section: string) => {
    if (!featureAccess.canEditProfile) {
      toast.error('Profile editing is not available for your account status');
      return;
    }
    setSaving(section);
    try {
      let data: Partial<Panthulugaru> = {};

      switch (section) {
        case 'personal':
          data = { firstName, lastName, experience: parseInt(experience) || 0, qualification, aboutMe, gender, languages };
          break;
        case 'contact':
          data = { phone, email };
          break;
        case 'rituals':
          data = {
            rituals: selectedRitualIds.map((id) => {
              const ritual = availableRituals.find((r) => r.id === id);
              return { ritualId: id, ritualName: ritual?.name || '', subRituals: [] };
            }),
          };
          break;
        case 'areas':
          data = { serviceAreas };
          break;
        case 'bank':
          data = {
            bankDetails: { accountHolderName, accountNumber, ifscCode, bankName, upiId },
          };
          break;
      }

      const response = await updateProfile(data);
      if (response.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully`);
        refreshProfile();
      } else {
        toast.error(response.message || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(null);
    }
  };

  const toggleRitual = (id: string) => {
    setSelectedRitualIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const addServiceArea = () => {
    if (newState && newDistrict && newCity) {
      setServiceAreas((prev) => [...prev, { state: newState, district: newDistrict, city: newCity }]);
      setNewState('');
      setNewDistrict('');
      setNewCity('');
    }
  };

  const LANGUAGE_OPTIONS = ['Telugu', 'Hindi', 'English', 'Sanskrit', 'Tamil', 'Kannada', 'Malayalam'];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/pg/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E07B39]">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-[#E07B39]" />Personal Information</CardTitle>
              <Button variant="primary" size="sm" onClick={() => saveSection('personal')} isLoading={saving === 'personal'}>
                <Save className="h-4 w-4 mr-1" />Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Experience (years)" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <Input label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Languages</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      languages.includes(lang) ? 'border-[#E07B39] bg-[#E07B39]/10 text-[#E07B39]' : 'border-gray-200 text-gray-600'
                    }`}
                  >{lang}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">About Me</label>
              <textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} rows={3}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-[#E07B39]" />Contact Details</CardTitle>
              <Button variant="primary" size="sm" onClick={() => saveSection('contact')} isLoading={saving === 'contact'}>
                <Save className="h-4 w-4 mr-1" />Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </CardContent>
        </Card>

        {/* Rituals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#E07B39]" />Rituals ({selectedRitualIds.length} selected)</CardTitle>
              <Button variant="primary" size="sm" onClick={() => saveSection('rituals')} isLoading={saving === 'rituals'}>
                <Save className="h-4 w-4 mr-1" />Save
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {availableRituals.map((ritual) => (
                <button key={ritual.id} type="button" onClick={() => toggleRitual(ritual.id)}
                  className={`p-2 rounded-lg border text-left text-sm transition-colors ${
                    selectedRitualIds.includes(ritual.id) ? 'border-[#E07B39] bg-[#E07B39]/5 text-[#E07B39]' : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                      selectedRitualIds.includes(ritual.id) ? 'bg-[#E07B39] border-[#E07B39]' : 'border-gray-300'
                    }`}>
                      {selectedRitualIds.includes(ritual.id) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="line-clamp-1">{ritual.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[#E07B39]" />Service Areas</CardTitle>
              <Button variant="primary" size="sm" onClick={() => saveSection('areas')} isLoading={saving === 'areas'}>
                <Save className="h-4 w-4 mr-1" />Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="State" value={newState} onChange={(e) => setNewState(e.target.value)} />
              <Input placeholder="District" value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} />
              <Input placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
            </div>
            <Button variant="outline" size="sm" onClick={addServiceArea} disabled={!newState || !newDistrict || !newCity}>Add Area</Button>
            {serviceAreas.length > 0 && (
              <div className="space-y-2">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm">{area.city}, {area.district}, {area.state}</span>
                    <button onClick={() => setServiceAreas((prev) => prev.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-[#E07B39]" />Bank Details</CardTitle>
              <Button variant="primary" size="sm" onClick={() => saveSection('bank')} isLoading={saving === 'bank'}>
                <Save className="h-4 w-4 mr-1" />Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Account Holder Name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              <Input label="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              <Input label="UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@upi" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PGProfileEditPage() {
  return (
    <RouteGuard role="pg">
      <ProfileEditContent />
    </RouteGuard>
  );
}
