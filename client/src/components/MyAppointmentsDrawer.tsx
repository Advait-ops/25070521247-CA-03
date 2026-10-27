import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Trash2, 
  Download, 
  Printer, 
  Plus, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Appointment } from '../types';

interface MyAppointmentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onNewBooking: () => void;
  databaseStatus?: {
    connected: boolean;
    source: string;
  };
}

export const MyAppointmentsDrawer: React.FC<MyAppointmentsDrawerProps> = ({
  isOpen,
  onClose,
  appointments,
  onCancelAppointment,
  onNewBooking,
  databaseStatus,
}) => {
  const [cancellingAppointmentId, setCancellingAppointmentId] = React.useState<string | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadIcs = (apt: Appointment) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Medilife General Hospital//Appointments//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Medical Appointment with ${apt.doctorName}`,
      `DESCRIPTION:Appointment Confirmation #${apt.confirmationCode} for ${apt.departmentName} at Medilife General Hospital. Room: ${apt.roomNumber}.`,
      `LOCATION:Medilife General Hospital, ${apt.roomNumber}, 742 Healthcare Parkway`,
      `DTSTART:${apt.date.replace(/-/g, '')}T090000Z`,
      `DTEND:${apt.date.replace(/-/g, '')}T100000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Medilife-Appointment-${apt.confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D543E]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2D543E]">
                Patient Portal
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                {databaseStatus?.connected ? 'MongoDB Connected' : 'MongoDB Service Ready'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              My Scheduled Appointments
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-slate-800 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-stone-400">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-800 text-base">
                  No Appointments Booked Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  When you schedule a consultation with our department specialists, your confirmation passes and appointment details will appear here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewBooking();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Book First Appointment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                  <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>{appointments.length} Registered {appointments.length === 1 ? 'Booking' : 'Bookings'}</span>
                <span>Sorted by latest</span>
              </div>

              {appointments.map((apt) => {
                const isCancelled = apt.status === 'Cancelled';
                return (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCancelled
                        ? 'bg-stone-50/80 border-stone-200 opacity-60'
                        : 'bg-white border-stone-200 shadow-xs hover:border-[#2D543E]/40'
                    }`}
                  >
                    {/* Top Row: Ref & Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-stone-400">PASS</span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {apt.confirmationCode}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          isCancelled
                            ? 'bg-red-50 text-red-700'
                            : 'bg-emerald-50 text-[#2D543E]'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    {/* Middle Info */}
                    <div className="py-3 space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {apt.doctorName}
                        </h4>
                        <p className="text-stone-500">{apt.doctorSpecialty} · {apt.departmentName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-stone-600 bg-stone-50/80 p-2.5 rounded-lg border border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#2D543E]" />
                          <span>{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2D543E]" />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5 text-stone-500">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{apt.roomNumber}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500">
                        <span>Patient: <strong>{apt.patientName}</strong> (Age {apt.age})</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    {!isCancelled && (
                      <div className="pt-2 border-t border-stone-100">
                        {cancellingAppointmentId === apt.id ? (
                          <div className="p-3 bg-red-50 rounded-xl border border-red-200/80 space-y-2 mt-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
                              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                              <span>Cancel this appointment?</span>
                            </div>
                            <p className="text-[11px] text-red-700 leading-relaxed">
                              This will cancel your scheduled consultation slot with {apt.doctorName}.
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                disabled={isCancelling}
                                onClick={async () => {
                                  setIsCancelling(true);
                                  try {
                                    await onCancelAppointment(apt.id);
                                    setSuccessMessage(`Appointment #${apt.confirmationCode || apt.id} has been cancelled.`);
                                    setTimeout(() => setSuccessMessage(null), 4000);
                                  } finally {
                                    setIsCancelling(false);
                                    setCancellingAppointmentId(null);
                                  }
                                }}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setCancellingAppointmentId(null)}
                                className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                              >
                                Keep Appointment
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDownloadIcs(apt)}
                                className="p-1.5 text-stone-600 hover:text-slate-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                                title="Add to calendar"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => window.print()}
                                className="p-1.5 text-stone-600 hover:text-slate-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                                title="Print pass"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCancellingAppointmentId(apt.id)}
                              className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Cancel Appointment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {appointments.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNewBooking();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Another Consultation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
