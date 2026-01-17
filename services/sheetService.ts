
import { RSVPData } from '../types';

// Live Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwkLnKzCKPFRDUcwp2XGpsm8FVIypSeKivdln78fkbJ4ecmQubc8gsq-MyAuP-nXKCT/exec';

export const sheetService = {
  syncToGoogleSheet: async (data: RSVPData) => {
    try {
      // Using 'no-cors' mode to handle Google Apps Script redirects effectively in a browser environment
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Successfully synced to Google Sheets');
    } catch (error) {
      console.error('Failed to sync to Google Sheets:', error);
    }
  }
};
