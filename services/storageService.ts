
import { RSVPData } from '../types';

const STORAGE_KEY = 'wedding_rsvp_data';

export const storageService = {
  saveRSVP: (data: RSVPData) => {
    const existing = storageService.getRSVPs();
    const updated = [...existing, data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getRSVPs: (): RSVPData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  exportToCSV: (data: RSVPData[]) => {
    if (data.length === 0) return;
    
    const headers = ['Full Name', 'Attending', 'Guests', 'Email', 'Phone', 'Children Count', 'Children Ages', 'Notes', 'Date'];
    const rows = data.map(r => [
      r.fullName,
      r.attendance,
      r.guestCount,
      r.email,
      r.phone,
      (r.childrenCount ?? '').toString().replace(/,/g, ';') || 'N/A',
      (r.childrenAges || '').replace(/,/g, ';'),
      (r.notes || '').replace(/,/g, ';'),
      r.submittedAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `RSVPs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
