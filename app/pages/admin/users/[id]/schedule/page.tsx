"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Users, Check } from "lucide-react";
import { getAuthToken } from "@/app/lib/auth";
import PageHeader from "@/app/components/admin/PageHeader";
import Modal from "@/app/components/Modal";

type UserProfile = {
  id: string;
  user_id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  contact_no: string | null;
  position: string | null;
  created_at: string;
};

export default function ScheduleManagementPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [customSchedule, setCustomSchedule] = useState<{[key: string]: {
    time: string;
    breakDuration: string;
    hourLimit: string;
  }}>({
    Mon: { time: '8:00-17:00', breakDuration: '60', hourLimit: '8' },
    Tue: { time: '8:00-17:00', breakDuration: '60', hourLimit: '8' }, 
    Wed: { time: '8:00-17:00', breakDuration: '60', hourLimit: '8' },
    Thu: { time: '8:00-17:00', breakDuration: '60', hourLimit: '8' },
    Fri: { time: '8:00-17:00', breakDuration: '60', hourLimit: '8' },
    Sat: { time: 'Off', breakDuration: '0', hourLimit: '0' },
    Sun: { time: 'Off', breakDuration: '0', hourLimit: '0' }
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleScheduleChange = (day: string, field: 'time' | 'breakDuration' | 'hourLimit', value: string) => {
    setCustomSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <PageHeader 
          title="Schedule Management" 
          subtitle="Loading user information..." 
        />
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="text-center text-slate-500">Loading...</div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <PageHeader 
          title="Schedule Management" 
          subtitle="User information not available" 
        />
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error || 'User not found'}</div>
            <button
              onClick={() => router.back()}
              className="text-sky-600 hover:text-sky-700 text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Schedule Management" 
        subtitle={`Custom schedule for ${user.name}`}
        actions={
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
        }
      />

      {/* Progress Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-sky-600 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-sky-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-600">
          <span>Select Days</span>
          <span>Set Schedule</span>
          <span>Review & Save</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Working Days</h3>
            <div className="grid grid-cols-7 gap-3">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`p-4 rounded-lg border-2 text-sm font-medium transition-colors ${
                    selectedDays.includes(day)
                      ? 'bg-sky-50 border-sky-500 text-sky-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Set Schedule for Selected Days</h3>
            <div className="space-y-6">
              {selectedDays.map((day) => (
                <div key={day} className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-slate-700 mb-3">{day}</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                      <input
                        type="text"
                        value={customSchedule[day].time}
                        onChange={(e) => handleScheduleChange(day, 'time', e.target.value)}
                        placeholder="e.g., 8:00-17:00"
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Break (min)</label>
                      <input
                        type="number"
                        value={customSchedule[day].breakDuration}
                        onChange={(e) => handleScheduleChange(day, 'breakDuration', e.target.value)}
                        placeholder="60"
                        min="0"
                        max="120"
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Hours</label>
                      <input
                        type="number"
                        value={customSchedule[day].hourLimit}
                        onChange={(e) => handleScheduleChange(day, 'hourLimit', e.target.value)}
                        placeholder="8"
                        min="1"
                        max="12"
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Review Schedule</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="space-y-3">
                {days.map((day) => (
                  <div key={day} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{day}</span>
                      <span className={`text-sm font-medium ${
                        selectedDays.includes(day) ? 'text-slate-900' : 'text-slate-500'
                      }`}>
                        {selectedDays.includes(day) ? customSchedule[day].time : 'Off'}
                      </span>
                    </div>
                    {selectedDays.includes(day) && (
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Break: {customSchedule[day].breakDuration} min</span>
                        <span>Hours: {customSchedule[day].hourLimit}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition"
            >
              Save Schedule
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Saved"
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-slate-700 mb-4">Custom schedule has been saved successfully!</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  );
}
