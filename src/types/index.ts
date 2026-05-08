/* ===========================
   Generic API Response Types
   =========================== */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
  statusCode?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface LocalizedField {
  en: string;
  hi?: string;
  te?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface ServiceAreaEntry {
  id?: string;
  state: string;
  district: string;
  city: string;
  pincode?: string;
  isPrimary?: boolean;
}

export interface DistrictEntry {
  id?: string;
  state: string;
  district: string;
  cities: string[];
}

export interface TimeSlot {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  label?: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  upiId?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  googleId?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Panthulugaru {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  slug: string;
  profileImage?: string;
  bannerImage?: string;
  gender?: string;
  dateOfBirth?: string;
  experience: number;
  qualification?: string;
  aboutMe?: string;
  aboutMeLocalized?: LocalizedField;
  languages: string[];
  specializations: string[];
  rituals: RitualOffering[];
  serviceAreas: ServiceAreaEntry[];
  primaryCity?: string;
  primaryState?: string;
  rating: number;
  reviewCount: number;
  totalBookings: number;
  isVerified: boolean;
  isAvailable: boolean;
  status: string;
  onboardingStatus: string;
  onboardingStep: number;
  bankDetails?: BankDetails;
  gallery?: string[];
  videoIntroUrl?: string;
  minimumPricing?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ritual {
  id: string;
  name: string;
  nameLocalized?: LocalizedField;
  description?: string;
  descriptionLocalized?: LocalizedField;
  image?: string;
  bannerImage?: string;
  category?: string;
  isActive: boolean;
  sortOrder?: number;
  subRituals?: SubRitual[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SubRitual {
  id: string;
  name: string;
  nameLocalized?: LocalizedField;
  description?: string;
  descriptionLocalized?: LocalizedField;
  image?: string;
  ritualId: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RitualOffering {
  ritualId: string;
  ritualName: string;
  subRituals: SubRitualOffering[];
}

export interface SubRitualOffering {
  subRitualId: string;
  subRitualName: string;
  price: number;
  duration?: number;
  description?: string;
}

export type BookingStatus = "DRAFT" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";
export type PaymentStatus = "PENDING" | "PARTIAL" | "COMPLETED" | "REFUNDED" | "FAILED";

export interface BookingCeremony {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  panthulugaruId: string;
  panthulugaruName: string;
  panthulugaruPhone?: string;
  ritualId: string;
  ritualName: string;
  subRitualId?: string;
  subRitualName?: string;
  bookingDate: string;
  bookingTime: string;
  endTime?: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  geoLocation?: GeoLocation;
  status: BookingStatus;
  amount: number;
  advanceAmount?: number;
  platformFee?: number;
  totalAmount?: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  notes?: string;
  specialRequirements?: string;
  cancellationReason?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED" | "SPAM";

export interface Lead {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  panthulugaruId: string;
  panthulugaruName: string;
  ritualId?: string;
  ritualName?: string;
  city?: string;
  message?: string;
  status: LeadStatus;
  source?: string;
  isUnlocked: boolean;
  unlockPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentType = "BOOKING" | "UNLOCK" | "SUBSCRIPTION" | "LEAD";
export type PaymentGlobalStatus = "CREATED" | "SUCCESS" | "FAILED" | "REFUNDED" | "PENDING";

export interface Payment {
  id: string;
  orderId: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  status: PaymentGlobalStatus;
  provider: string;
  providerPaymentId?: string;
  providerOrderId?: string;
  customerId?: string;
  customerName?: string;
  panthulugaruId?: string;
  bookingId?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Ad {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  page?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Article {
  id: string;
  title: string;
  titleLocalized?: LocalizedField;
  slug: string;
  excerpt?: string;
  content: string;
  contentLocalized?: LocalizedField;
  coverImage?: string;
  author?: string;
  category?: string;
  tags: string[];
  status: ArticleStatus;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photographer {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  email: string;
  phone: string;
  profileImage?: string;
  bannerImage?: string;
  aboutMe?: string;
  experience: number;
  specializations: string[];
  languages: string[];
  serviceAreas: ServiceAreaEntry[];
  primaryCity?: string;
  primaryState?: string;
  portfolio: string[];
  videography: boolean;
  dronePhotography: boolean;
  equipment?: string[];
  pricePerDay?: number;
  pricePerEvent?: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isAvailable: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Caterer {
  id: string;
  businessName: string;
  ownerName: string;
  slug: string;
  email: string;
  phone: string;
  profileImage?: string;
  bannerImage?: string;
  aboutUs?: string;
  experience: number;
  cuisineTypes: string[];
  menuTypes: string[];
  serviceAreas: ServiceAreaEntry[];
  primaryCity?: string;
  primaryState?: string;
  minPlateCount?: number;
  maxPlateCount?: number;
  pricePerPlate?: number;
  vegetarianOnly: boolean;
  gallery: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isAvailable: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TithiInfo {
  paksham: string;
  tithiName: string;
  tithiNumber: number;
  lunarMonth: string;
  lunarYear?: number;
  nakshatra?: string;
  gregorianDate?: string;
}

export interface UpcomingAnniversary {
  year: number;
  gregorianDate: string;
  tithiInfo: TithiInfo;
  dayOfWeek: string;
}

export interface DeathAnniversary {
  id: string;
  customerId: string;
  deceasedName: string;
  relationship: string;
  deathDate: string;
  deathTithi?: TithiInfo;
  lunarMonth?: string;
  lunarDay?: string;
  gothram?: string;
  nakshatra?: string;
  notes?: string;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  upcomingAnniversaries?: UpcomingAnniversary[];
  createdAt: string;
  updatedAt: string;
}

export interface Horoscope {
  id: string;
  customerId: string;
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
  nakshatra?: string;
  rashi?: string;
  lagna?: string;
  gothram?: string;
  planetaryPositions?: Record<string, string>;
  doshas?: string[];
  predictions?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface TempleJob {
  id: string;
  templeName: string;
  templeLocation: string;
  city: string;
  state: string;
  jobTitle: string;
  jobType: string;
  description: string;
  requirements: string[];
  qualifications: string[];
  salary?: string;
  salaryRange?: { min: number; max: number };
  contactEmail?: string;
  contactPhone?: string;
  applicationDeadline?: string;
  isActive: boolean;
  applicationsCount: number;
  postedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl?: string;
  coverLetter?: string;
  experience: number;
  qualifications: string[];
  status: "APPLIED" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  createdAt: string;
  updatedAt: string;
}

export interface Festival {
  id: string;
  name: string;
  nameLocalized?: LocalizedField;
  description?: string;
  descriptionLocalized?: LocalizedField;
  date: string;
  endDate?: string;
  image?: string;
  category?: string;
  rituals?: string[];
  significance?: string;
  isNationalHoliday: boolean;
  region?: string[];
  createdAt?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleAuthData {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  idToken: string;
}

export interface DashboardStats {
  totalPGs: number;
  activePGs: number;
  pendingPGs: number;
  totalCustomers: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalLeads: number;
  totalPayments: number;
  recentBookings: BookingCeremony[];
  recentLeads: Lead[];
}

export interface PGDashboardStats {
  totalBookings: number;
  completedBookings: number;
  upcomingBookings: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  rating: number;
  reviewCount: number;
  profileViews: number;
  leadsReceived: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "admin";
}

export interface DateFilter {
  startDate: string;
  endDate: string;
  label: string;
}

// Wallet
export interface Wallet {
  id: string;
  userId: string;
  role: string;
  amount: number;
  previousAmount: number;
  upcomingAmount: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistory {
  id: string;
  walletId: string;
  userId: string;
  role: string;
  transactionType: 'credit' | 'debit';
  transactionAmount: number;
  balanceAfter: number;
  transactionMode: string;
  referenceId: string;
  description: string;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  role: string;
  type: string;
  title: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  bookingId?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string;
}

// Streaming
export interface Streaming {
  id: string;
  bookingId: string;
  roomName: string;
  roomSid: string;
  pgId: string;
  customerId: string;
  pgTwilioToken: string;
  customerTwilioToken: string;
  isCustomerJoined: boolean;
  isPanthulugaruJoined: boolean;
  isStarted: boolean;
  isEnded: boolean;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

// Withdraw
export interface Withdraw {
  id: string;
  pgId: string;
  userId: string;
  walletId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  reason?: string;
  bankDetailsId: string;
  transactionRef?: string;
  createdAt: string;
  processedAt?: string;
}

// MuhurthamOrder
export interface MuhurthamOrder {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDescription: string;
  preferredDateRange?: string;
  pgId?: string;
  status: string;
  amount: number;
  paymentId?: string;
  paymentStatus: string;
  muhurthamDate?: string;
  muhurthamTime?: string;
  notes?: string;
  createdAt: string;
}

// GreetingsSubscription
export interface GreetingsSubscription {
  id: string;
  customerId: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  greetingType: string;
  greetingDate: string;
  message: string;
  isRecurring: boolean;
  isActive: boolean;
  lastSentDate?: string;
  createdAt: string;
}
