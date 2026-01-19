
import React, { useState } from 'react';
import { AttendanceStatus, FormData } from '../types';

interface Props {
  onSubmit: (data: FormData) => void;
}

const RSVPForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    attendance: AttendanceStatus.YES,
    guestCount: 1,
    email: '',
    phone: '',
    childrenCount: null,
    childrenAges: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full px-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#556b2f]/20 focus:border-[#556b2f] outline-none transition-all placeholder:text-stone-300";
  const labelClasses = "block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2";

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-4xl font-serif text-stone-800">Kindly Respond</h2>
          <p className="text-stone-400 font-light italic">Please RSVP by April 1st, 2026</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className={labelClasses}>Full Name</label>
            <input
              required
              type="text"
              className={inputClasses}
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Your name as it appears on invitation"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Attendance</label>
              <select
                required
                className={inputClasses}
                value={formData.attendance}
                onChange={e => {
                  const val = e.target.value as AttendanceStatus;
                  setFormData({ 
                    ...formData, 
                    attendance: val,
                    guestCount: val === AttendanceStatus.NO ? 0 : formData.guestCount,
                    childrenCount: val === AttendanceStatus.NO ? null : formData.childrenCount,
                    childrenAges: val === AttendanceStatus.NO ? '' : formData.childrenAges,
                  });
                }}
              >
                <option value={AttendanceStatus.YES}>Joyfully Accepts</option>
                <option value={AttendanceStatus.NO}>Regretfully Declines</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>
                Number of Guests
              </label>
              <input
                required={formData.attendance === AttendanceStatus.YES}
                disabled={formData.attendance === AttendanceStatus.NO}
                type="number"
                min="0"
                max="10"
                className={inputClasses}
                value={formData.guestCount}
                onChange={e => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Email Address</label>
              <input
                required
                type="email"
                className={inputClasses}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="For updates & details"
              />
            </div>
            <div>
              <label className={labelClasses}>Phone Number</label>
              <input
                type="tel"
                className={inputClasses}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Children</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.3em] mb-2">
                  Number of children
                </label>
                <select
                  className={inputClasses}
                  value={formData.childrenCount === null ? 'NA' : String(formData.childrenCount)}
                  onChange={e => {
                    const raw = e.target.value;
                    const nextCount = raw === 'NA' ? null : parseInt(raw, 10);
                    setFormData({
                      ...formData,
                      childrenCount: Number.isFinite(nextCount as any) ? (nextCount as number) : null,
                      childrenAges: !nextCount ? '' : formData.childrenAges,
                    });
                  }}
                >
                  <option value="NA">N/A</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10+</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.3em] mb-2">
                  Ages (comma-separated)
                </label>
                <input
                  type="text"
                  className={inputClasses}
                  disabled={!formData.childrenCount}
                  value={formData.childrenAges}
                  onChange={e => setFormData({ ...formData, childrenAges: e.target.value })}
                  placeholder="e.g. 2, 5, 8"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Notes for the Couple</label>
            <textarea
              rows={3}
              className={inputClasses}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Leave a sweet message..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#556b2f] hover:bg-[#3d4d21] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-olive-900/10 transition-all transform active:scale-[0.99] uppercase tracking-[0.2em] text-sm"
        >
          Send Response
        </button>
      </form>
    </div>
  );
};

export default RSVPForm;
