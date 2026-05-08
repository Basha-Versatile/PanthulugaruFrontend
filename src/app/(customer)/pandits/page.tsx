'use client';

import React from 'react';
import { ServiceListingPage, type FilterConfig } from '@/components/features/ServiceListingPage';
import { getAllPandits } from '@/lib/api/pandits';

const PANDIT_FILTERS: FilterConfig[] = [
  {
    key: 'ritual',
    label: 'Ritual',
    type: 'text',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
  },
];

export default function PanditsListingPage() {
  return (
    <ServiceListingPage
      type="pandit"
      title="Find Pandits"
      fetchFn={getAllPandits}
      filters={PANDIT_FILTERS}
    />
  );
}
