'use client';

import React from 'react';
import { ServiceListingPage, type FilterConfig } from '@/components/features/ServiceListingPage';
import { getAllCaterers } from '@/lib/api/caterers';

const CATERER_FILTERS: FilterConfig[] = [
  {
    key: 'cuisineType',
    label: 'Cuisine Type',
    type: 'text',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
  },
];

export default function CaterersListingPage() {
  return (
    <ServiceListingPage
      type="caterer"
      title="Find Caterers"
      fetchFn={getAllCaterers}
      filters={CATERER_FILTERS}
    />
  );
}
