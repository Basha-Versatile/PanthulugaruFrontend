export const ENDPOINTS = {
  // Customer Auth
  CUSTOMER_SIGNUP: '/customer/auth/signup',
  CUSTOMER_LOGIN: '/customer/auth/login',
  CUSTOMER_GOOGLE_AUTH: '/customer/auth/google',
  CUSTOMER_ME: '/customer/auth/me',
  CUSTOMER_UPDATE_PROFILE: '/customer/auth/profile',
  CUSTOMER_LOGOUT: '/customer/auth/logout',
  CUSTOMER_MY_PGS: '/customer/auth/my-pgs',

  // PG Auth
  PG_EMAIL_SIGNUP: '/pg/dashboard/auth/email/signup',
  PG_EMAIL_LOGIN: '/pg/dashboard/auth/email/login',
  PG_SEND_OTP: '/pg/dashboard/auth/send-otp',
  PG_VERIFY_OTP: '/pg/dashboard/auth/verify-otp',

  // PG Dashboard
  PG_PROFILE: '/pg/dashboard/profile',
  PG_FULL_PROFILE: '/pg/dashboard/profile/full',
  PG_UPDATE_PROFILE: '/pg/dashboard/profile',
  PG_COMPLETE_PROFILE: '/pg/dashboard/profile/complete',
  PG_RITUALS: '/pg/dashboard/rituals',
  PG_LOCATIONS: '/pg/dashboard/locations',
  PG_STATS: '/pg/dashboard/stats',
  PG_BOOKINGS: '/pg/dashboard/bookings',
  PG_AVAILABILITY: '/pg/dashboard/availability',

  // Pandits (public)
  GET_ALL_PANDITS: '/pandits',
  GET_PANDIT_BY_SLUG: '/pandits/slug',
  GET_PANDIT_BY_ID: '/pandits',
  GET_PANDIT_BY_PHONE: '/pandits/phone',

  // Photographers
  GET_ALL_PHOTOGRAPHERS: '/photographers',
  GET_PHOTOGRAPHER_BY_SLUG: '/photographers/slug',
  GET_PHOTOGRAPHER_BY_ID: '/photographers',

  // Caterers
  GET_ALL_CATERERS: '/caterers',
  GET_CATERER_BY_SLUG: '/caterers/slug',
  GET_CATERER_BY_ID: '/caterers',

  // Bookings
  CREATE_BOOKING_DRAFT: '/bookings/draft',
  GET_BOOKING_DRAFT: '/bookings/draft',
  MY_BOOKINGS: '/bookings/my-bookings',
  PANDIT_AVAILABILITY: '/bookings/availability',
  CONFIRM_BOOKING: '/bookings',
  CANCEL_BOOKING: '/bookings',
  INITIATE_PAYMENT: '/booking-payments/initiate',
  CONFIRM_PAYMENT: '/booking-payments/confirm',
  FAIL_PAYMENT: '/booking-payments/fail',
  PAYMENT_STATUS: '/booking-payments',

  // Leads
  CREATE_LEAD: '/leads',
  CHECK_UNLOCK: '/leads/check-unlock',
  CHECK_UNLOCK_BY_CUSTOMER: '/leads/check-unlock/customer',

  // Payments
  CREATE_PAYMENT: '/payments',
  GET_PAYMENTS: '/payments',

  // Customer Access
  GET_UNLOCK_STATUS: '/customer-access/unlock-status',
  CREATE_UNLOCK: '/customer-access/unlock',
  MY_PANTHULUGARU: '/customer-access/my-panthulugaru',
  CUSTOMER_ACCESS_CONTACT: '/customer-access/contact',

  // Rituals
  RITUALS_WITH_SUBLIST: '/commonRouter/webRitualsWithsublist',
  RITUAL_BY_ID: '/commonRouter/rituals',
  MOST_BOOKED: '/commonRouter/mostBookedCeremonies',
  BANNER_RITUALS: '/commonRouter/bannerRituals',
  SEARCH_RITUALS: '/commonRouter/searchRituals',

  // Articles
  GET_ARTICLES: '/articles',

  // Festivals
  GET_FESTIVALS: '/festivals',

  // Death Anniversary
  DEATH_ANNIVERSARY: '/death-anniversary',
  DEATH_ANNIVERSARY_MY: '/death-anniversary/my',
  DEATH_ANNIVERSARY_UPCOMING: '/death-anniversary/upcoming',
  CALCULATE_TITHI: '/death-anniversary/calculate-tithi',

  // Horoscope
  HOROSCOPE: '/horoscope',
  HOROSCOPE_QUICK: '/horoscope/quick-lookup',
  HOROSCOPE_NAKSHATRAS: '/horoscope/nakshatras',

  // Temple Jobs
  TEMPLE_JOBS: '/temple-jobs',

  // Ads
  ADS_ACTIVE: '/ads/active',
  ADS: '/ads',

  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD_STATS: '/admin/dashboard/stats',
  ADMIN_PGS: '/admin/pgs',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_RECENT_CUSTOMERS: '/admin/recent/customers',
  ADMIN_RECENT_PGS: '/admin/recent/panthulugaru',
  ADMIN_GET_LEADS: '/leads',
  ADMIN_GET_PAYMENTS: '/payments',
  ADMIN_ARTICLES: '/articles',
  ADMIN_MASTER_RITUALS: '/commonRouter/webRitualsWithsublist',
  ADMIN_MASTER_LOCATIONS: '/pg/dashboard/locations',
  ADMIN_ADS: '/ads',
} as const;
