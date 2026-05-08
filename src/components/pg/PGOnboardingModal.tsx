'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Upload, User, Phone, BookOpen, MapPin, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGAuth } from '@/contexts/PGAuthContext';
import { getAvailableRituals, getAvailableLocations } from '@/lib/api/pgAuth';
import type { Ritual, ServiceAreaEntry, Panthulugaru } from '@/types';
import toast from 'react-hot-toast';

type PGOnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Contact', icon: Phone },
  { id: 3, title: 'Rituals', icon: BookOpen },
  { id: 4, title: 'Service Area', icon: MapPin },
  { id: 5, title: 'Documents', icon: FileText },
];

export function PGOnboardingModal({ isOpen, onClose }: PGOnboardingModalProps) {
  const { user, completePGProfile } = usePGAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Personal Info
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [experience, setExperience] = useState(user?.experience?.toString() || '');
  const [qualification, setQualification] = useState(user?.qualification || '');
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [languages, setLanguages] = useState<string[]>(user?.languages || []);

  // Step 2: Contact
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');

  // Step 3: Rituals
  const [availableRituals, setAvailableRituals] = useState<Ritual[]>([]);
  const [selectedRitualIds, setSelectedRitualIds] = useState<string[]>(
    user?.rituals?.map((r) => r.ritualId) || []
  );

  // Step 4: Service Area
  const [availableLocations, setAvailableLocations] = useState<ServiceAreaEntry[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaEntry[]>(user?.serviceAreas || []);
  const [newState, setNewState] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newCity, setNewCity] = useState('');

  // Step 5: Documents
  const [proofDocument, setProofDocument] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchRituals();
      fetchLocations();
    }
  }, [isOpen]);

  const fetchRituals = async () => {
    try {
      const response = await getAvailableRituals();
      if (response.success && response.data) {
        setAvailableRituals(response.data);
      }
    } catch {
      // silently fail
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await getAvailableLocations();
      if (response.success && response.data) {
        setAvailableLocations(response.data);
      }
    } catch {
      // silently fail
    }
  };

  if (!isOpen) return null;

  const toggleRitual = (ritualId: string) => {
    setSelectedRitualIds((prev) =>
      prev.includes(ritualId) ? prev.filter((id) => id !== ritualId) : [...prev, ritualId]
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

  const removeServiceArea = (index: number) => {
    setServiceAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!firstName || !lastName || !experience) {
          toast.error('Please fill in required fields');
          return false;
        }
        return true;
      case 2:
        if (!phone || !email) {
          toast.error('Please provide phone and email');
          return false;
        }
        return true;
      case 3:
        if (selectedRitualIds.length === 0) {
          toast.error('Please select at least one ritual');
          return false;
        }
        return true;
      case 4:
        if (serviceAreas.length === 0) {
          toast.error('Please add at least one service area');
          return false;
        }
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const profileData: Partial<Panthulugaru> = {
        firstName,
        lastName,
        experience: parseInt(experience) || 0,
        qualification,
        aboutMe,
        gender,
        languages,
        phone,
        email,
        rituals: selectedRitualIds.map((id) => {
          const ritual = availableRituals.find((r) => r.id === id);
          return {
            ritualId: id,
            ritualName: ritual?.name || '',
            subRituals: [],
          };
        }),
        serviceAreas,
      };

      const success = await completePGProfile(profileData);
      if (success) {
        toast.success('Profile completed! Pending admin approval.');
        onClose();
      }
    } catch {
      toast.error('Failed to complete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const LANGUAGE_OPTIONS = ['Telugu', 'Hindi', 'English', 'Sanskrit', 'Tamil', 'Kannada', 'Malayalam'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-1">
            {STEPS.map((step) => (
              <div key={step.id} className="flex-1 flex items-center gap-1">
                <div
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    step.id <= currentStep ? 'bg-[#FF6B00]' : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-1 text-xs ${
                  step.id === currentStep ? 'text-[#FF6B00] font-medium' : 'text-gray-400'
                }`}
              >
                <step.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
                <Input label="Last Name *" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
              </div>
              <Input label="Experience (years) *" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years of experience" min="0" required />
              <Input label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="e.g., Vedic Studies, Sanskrit Scholar" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        languages.includes(lang)
                          ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">About Me</label>
                <textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Input label="Phone Number *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" required />
              <Input label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Rituals */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Select the rituals you can perform:</p>
              {availableRituals.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Loading rituals...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                  {availableRituals.map((ritual) => (
                    <button
                      key={ritual.id}
                      type="button"
                      onClick={() => toggleRitual(ritual.id)}
                      className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                        selectedRitualIds.includes(ritual.id)
                          ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          selectedRitualIds.includes(ritual.id)
                            ? 'bg-[#FF6B00] border-[#FF6B00]'
                            : 'border-gray-300'
                        }`}>
                          {selectedRitualIds.includes(ritual.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="line-clamp-2">{ritual.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {selectedRitualIds.length > 0 && (
                <p className="text-sm text-[#FF6B00] font-medium">{selectedRitualIds.length} rituals selected</p>
              )}
            </div>
          )}

          {/* Step 4: Service Area */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Add the areas where you provide services:</p>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="State" value={newState} onChange={(e) => setNewState(e.target.value)} />
                <Input placeholder="District" value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} />
                <Input placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" onClick={addServiceArea} disabled={!newState || !newDistrict || !newCity}>
                Add Area
              </Button>

              {serviceAreas.length > 0 && (
                <div className="space-y-2 mt-4">
                  {serviceAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700">
                        {area.city}, {area.district}, {area.state}
                      </span>
                      <button onClick={() => removeServiceArea(index)} className="text-red-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Upload proof documents (optional for now):</p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FF6B00] transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Click to upload documents</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 5MB)</p>
                <Input
                  type="text"
                  value={proofDocument}
                  onChange={(e) => setProofDocument(e.target.value)}
                  placeholder="Or paste a document URL"
                  className="mt-4"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <strong>Note:</strong> You can skip this step and upload documents later. Your profile will be reviewed by the admin after submission.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Step {currentStep} of 5</span>
          </div>

          {currentStep < 5 ? (
            <Button variant="primary" onClick={handleNext}>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
              Submit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
