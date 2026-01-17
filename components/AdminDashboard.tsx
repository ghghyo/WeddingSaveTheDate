
import React, { useState, useMemo } from 'react';
import { RSVPData, AttendanceStatus } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  rsvps: RSVPData[];
}

const AdminDashboard: React.FC<Props> = ({ rsvps }) => {
  const [filter, setFilter] = useState<AttendanceStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return rsvps.filter(r => {
      const matchesFilter = filter === 'ALL' || r.attendance === filter;
      const matchesSearch = r.fullName.toLowerCase().includes(search.toLowerCase()) || 
                           r.email.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [rsvps, filter, search]);

  const stats = useMemo(() => {
    return {
      total: rsvps.length,
      attending: rsvps.filter(r => r.attendance === AttendanceStatus.YES).length,
      guests: rsvps.filter(r => r.attendance === AttendanceStatus.YES).reduce((sum, r) => sum + r.guestCount, 0),
      declined: rsvps.filter(r => r.attendance === AttendanceStatus.NO).length,
    };
  }, [rsvps]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-800">RSVP Manager</h2>
          <p className="text-sm text-slate-500">Track your guest list and responses</p>
        </div>
        <button
          onClick={() => storageService.exportToCSV(rsvps)}
          className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Confirmed Attending</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.attending}</p>
        </div>
        <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
          <p className="text-xs text-sky-600 font-semibold uppercase tracking-wider">Total Guest Count</p>
          <p className="text-2xl font-bold text-sky-700">{stats.guests}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Total Submissions</p>
          <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
        >
          <option value="ALL">All Responses</option>
          <option value={AttendanceStatus.YES}>Attending</option>
          <option value={AttendanceStatus.NO}>Declined</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Guest</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Count</th>
              <th className="px-6 py-4 font-semibold">Contact</th>
              <th className="px-6 py-4 font-semibold">Dietary/Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No responses found match your criteria.</td>
              </tr>
            ) : (
              filteredData.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{r.fullName}</div>
                    <div className="text-xs text-slate-400">{r.submittedAt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      r.attendance === AttendanceStatus.YES ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {r.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.guestCount}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{r.email}</div>
                    <div className="text-xs text-slate-500">{r.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {r.dietaryRestrictions || r.notes || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
