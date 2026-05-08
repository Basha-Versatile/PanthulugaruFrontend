'use client';

import React from 'react';
import { ServiceListingPage, type FilterConfig } from '@/components/features/ServiceListingPage';
import { getAllPhotographers } from '@/lib/api/photographers';

const PHOTOGRAPHER_FILTERS: FilterConfig[] = [
  {
    key: 'city',
    label: 'City',
    type: 'text',
  },
];

export default function PhotographersListingPage() {
  return (
    <ServiceListingPage
      type="photographer"
      title="Find Photographers"
      fetchFn={getAllPhotographers}
      filters={PHOTOGRAPHER_FILTERS}
    />
  );
}
