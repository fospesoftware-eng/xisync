import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Filter,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

type CalendarEvent = {
  id: string;
  day: number;
  time: string;
  title: string;
  category: 'meeting' | 'freight' | 'marketing' | 'compliance';
  color: string;
};

const sampleEvents: CalendarEvent[] = [
  { id: '1', day: 14, time: '10:00 AM', title: 'ABC Corp Contract Call', category: 'meeting', color: 'bg-blue-500/90 text-white' },
  { id: '2', day: 14, time: '02:30 PM', title: 'COSCO Vessel Departure', category: 'freight', color: 'bg-emerald-500/90 text-white' },
  { id: '3', day: 14, time: '04:00 PM', title: 'Meta & Google Ad Scaling', category: 'marketing', color: 'bg-purple-500/90 text-white' },
  { id: '4', day: 15, time: '11:00 AM', title: 'EU CE Compliance Audit', category: 'compliance', color: 'bg-amber-500/90 text-white' },
  { id: '5', day: 18, time: '09:00 AM', title: 'Dubai Expo Logistics Briefing', category: 'meeting', color: 'bg-blue-500/90 text-white' },
  { id: '6', day: 20, time: '01:00 PM', title: 'DHL Air Freight Customs Check', category: 'freight', color: 'bg-emerald-500/90 text-white' },
  { id: '7', day: 22, time: '03:00 PM', title: 'Q3 Revenue & ROI Forecast', category: 'marketing', color: 'bg-purple-500/90 text-white' },
  { id: '8', day: 25, time: '10:30 AM', title: 'FDA Export Clearance Review', category: 'compliance', color: 'bg-amber-500/90 text-white' },
];

export function CalendarPage() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [activeCategories, setActiveCategories] = useState<Record<string, boolean>>({
    meeting: true,
    freight: true,
    marketing: true,
    compliance: true,
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // August 2026 starts on Saturday (day 6), 31 days
  const daysInMonth = 31;
  const startDayOffset = 6; // Saturday

  const calendarGrid = [];
  // Prev month padding
  for (let i = startDayOffset - 1; i >= 0; i--) {
    calendarGrid.push({ day: 26 + (startDayOffset - 1 - i), isCurrentMonth: false });
  }
  // Current month days 1-31
  for (let d = 1; d <= daysInMonth; d++) {
    calendarGrid.push({ day: d, isCurrentMonth: true });
  }
  // Next month padding to fill 35 cells
  const remainingCells = 35 - calendarGrid.length;
  for (let n = 1; n <= remainingCells; n++) {
    calendarGrid.push({ day: n, isCurrentMonth: false });
  }

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Controls Bar (Same as Google Calendar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">August 2026</h1>
              <p className="text-xs text-slate-500 dark:text-slate-300 font-medium">XiSync Trade Schedule & Activities</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-4">
            <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Today
            </button>
            <button className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-bold">
            {(['month', 'week', 'day', 'agenda'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  viewMode === m
                    ? 'bg-gradient-to-r from-xisync-cyan-500 to-xisync-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <Button icon={<Plus className="w-4 h-4" />}>Create Event</Button>
        </div>
      </div>

      {/* Main Calendar Viewport + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Google Calendar Controls Sidebar */}
        <div className="space-y-6">
          {/* Calendar Category Filter Checklist */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-xisync-cyan-500" />
              My Trade Calendars
            </h3>

            <div className="space-y-2.5 text-xs font-semibold">
              {[
                { id: 'meeting', label: 'B2B Buyer Meetings', color: 'bg-blue-500' },
                { id: 'freight', label: 'Logistics & Ocean Freight', color: 'bg-emerald-500' },
                { id: 'marketing', label: 'Ad Campaigns & ROI', color: 'bg-purple-500' },
                { id: 'compliance', label: 'Customs & Compliance', color: 'bg-amber-500' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <span className="text-slate-800 dark:text-slate-200">{cat.label}</span>
                  </div>
                  {activeCategories[cat.id] ? (
                    <CheckSquare className="w-4 h-4 text-xisync-cyan-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Schedule Agenda */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-xisync-cyan-500" />
              Upcoming Activities
            </h3>

            <div className="space-y-3">
              {sampleEvents.slice(0, 4).map((evt) => (
                <div key={evt.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Aug {evt.day}, 2026</span>
                    <span>{evt.time}</span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">{evt.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Google Calendar Month Grid (3-Column Width) */}
        <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden flex flex-col">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-center py-3 text-xs font-extrabold text-slate-600 dark:text-slate-300">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month Cells Grid (5 Rows x 7 Columns) */}
          <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y divide-slate-100 dark:divide-slate-800/80 min-h-[580px]">
            {calendarGrid.map((cell, idx) => {
              const dayEvents = sampleEvents.filter(
                (evt) => cell.isCurrentMonth && evt.day === cell.day && activeCategories[evt.category]
              );
              const isToday = cell.isCurrentMonth && cell.day === 14;

              return (
                <div
                  key={idx}
                  className={`p-2 flex flex-col justify-between transition-colors min-h-[110px] ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-50/40 dark:bg-slate-950/30 text-slate-400 dark:text-slate-600'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold font-mono w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-xisync-cyan-500 text-white shadow-md ring-2 ring-xisync-cyan-400/40'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-xisync-cyan-400" />
                    )}
                  </div>

                  {/* Event Chips */}
                  <div className="space-y-1 my-1 flex-1 overflow-y-auto">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold truncate shadow-xs cursor-pointer hover:opacity-90 ${evt.color}`}
                        title={`${evt.time} - ${evt.title}`}
                      >
                        <span className="font-mono opacity-80 mr-1">{evt.time}</span>
                        <span>{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
