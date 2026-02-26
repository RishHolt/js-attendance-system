"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Users, Save } from "lucide-react";
import { getAuthToken } from "@/app/lib/auth";
import PageHeader from "@/app/components/admin/PageHeader";

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

export default function EditSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    breakDuration: '',
    hourLimit: '',
    notes: ''
  });

  const [workingDays, setWorkingDays] = useState({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (day: string) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: !prev[day as keyof typeof prev]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message or redirect
      router.push(`/admin/users/${params.id}`);
    } catch (err) {
      console.error('Failed to save schedule:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader 
          title="Edit Work Schedule" 
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
          title="Edit Work Schedule" 
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
        title="Edit Work Schedule" 
        subtitle={`Manage work schedule for ${user.name}`}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Working Days */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Working Days</h3>
          <div className="grid grid-cols-7 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <label key={day} className="flex flex-col items-center">
                <input
                  type="checkbox"
                  checked={workingDays[day as keyof typeof workingDays]}
                  onChange={() => handleDayToggle(day)}
                  className="sr-only peer"
                />
                <div className={`w-full p-3 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  workingDays[day as keyof typeof workingDays]
                    ? 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-500 shadow-sm scale-105'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}>
                  <span className={`text-sm font-semibold mb-1 ${
                    workingDays[day as keyof typeof workingDays] ? 'text-sky-700' : 'text-slate-600'
                  }`}>
                    {day}
                  </span>
                  <div className={`text-xs ${
                    workingDays[day as keyof typeof workingDays] ? 'text-sky-600' : 'text-slate-400'
                  }`}>
                    {workingDays[day as keyof typeof workingDays] ? 'Selected' : 'Not Selected'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              <span className="font-medium">{Object.values(workingDays).filter(Boolean).length}</span> days selected
            </div>
            <button
              type="button"
              onClick={() => router.push(`/admin/users/${params.id}/schedule`)}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" />
              Custom Schedule
            </button>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Working Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Schedule Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Schedule Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Break Duration</label>
              <input
                type="number"
                value={formData.breakDuration}
                onChange={(e) => handleInputChange('breakDuration', e.target.value)}
                min="0"
                max="120"
                placeholder="1 hour"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hour Limit</label>
              <input
                type="number"
                value={formData.hourLimit}
                onChange={(e) => handleInputChange('hourLimit', e.target.value)}
                min="1"
                max="12"
                placeholder="8 hours"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any special instructions or notes..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
