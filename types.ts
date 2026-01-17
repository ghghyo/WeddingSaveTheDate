
export enum AttendanceStatus {
  YES = 'Yes',
  NO = 'No'
}

export interface RSVPData {
  id: string;
  fullName: string;
  attendance: AttendanceStatus;
  guestCount: number;
  email: string;
  phone: string;
  dietaryRestrictions: string;
  notes: string;
  submittedAt: string;
}

export type FormData = Omit<RSVPData, 'id' | 'submittedAt'>;
