export type ApprovalStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';

export interface FeatureAccess {
  canAccessDashboard: boolean;
  canEditProfile: boolean;
  canAccessBookings: boolean;
  canViewCustomerDetails: boolean;
  isPubliclyVisible: boolean;
  canReceiveBookings: boolean;
  showOnboardingModal: boolean;
  dashboardReadOnly: boolean;
}

export function deriveApprovalStatus(status: string, onboardingStatus: string): ApprovalStatus {
  if (onboardingStatus !== 'COMPLETED') return 'DRAFT';
  const s = status?.toLowerCase();
  if (s === 'active') return 'ACTIVE';
  if (s === 'rejected') return 'REJECTED';
  return 'PENDING_APPROVAL';
}

export function getFeatureAccess(approvalStatus: ApprovalStatus): FeatureAccess {
  switch (approvalStatus) {
    case 'DRAFT':
      return {
        canAccessDashboard: false,
        canEditProfile: false,
        canAccessBookings: false,
        canViewCustomerDetails: false,
        isPubliclyVisible: false,
        canReceiveBookings: false,
        showOnboardingModal: true,
        dashboardReadOnly: true,
      };
    case 'PENDING_APPROVAL':
      return {
        canAccessDashboard: true,
        canEditProfile: false,
        canAccessBookings: false,
        canViewCustomerDetails: false,
        isPubliclyVisible: false,
        canReceiveBookings: false,
        showOnboardingModal: false,
        dashboardReadOnly: true,
      };
    case 'ACTIVE':
      return {
        canAccessDashboard: true,
        canEditProfile: true,
        canAccessBookings: true,
        canViewCustomerDetails: true,
        isPubliclyVisible: true,
        canReceiveBookings: true,
        showOnboardingModal: false,
        dashboardReadOnly: false,
      };
    case 'REJECTED':
      return {
        canAccessDashboard: true,
        canEditProfile: true,
        canAccessBookings: false,
        canViewCustomerDetails: false,
        isPubliclyVisible: false,
        canReceiveBookings: false,
        showOnboardingModal: false,
        dashboardReadOnly: false,
      };
  }
}
