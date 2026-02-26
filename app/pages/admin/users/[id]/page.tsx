"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User, CalendarDays, Users, ChevronRight, Shield, Mail, Phone, Briefcase, Calendar } from "lucide-react";
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

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'attendance'>('profile');

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <PageHeader 
          title="User Profile" 
          subtitle="Loading user information..." 
        />
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="text-center text-slate-500">Loading profile...</div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <PageHeader 
          title="User Profile" 
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
        title={activeTab === 'profile' ? 'User Profile' : activeTab === 'schedule' ? 'User Schedule' : 'User Attendance'}
        subtitle={user ? `Manage ${activeTab === 'profile' ? 'profile information' : activeTab === 'schedule' ? 'work schedule' : 'attendance records'} for ${user.name}` : 'Loading user information...'}
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

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-8" aria-label="Tabs">
          {[
            { id: 'profile' as const, label: 'Profile', icon: User },
            { id: 'schedule' as const, label: 'Schedule', icon: CalendarDays },
            { id: 'attendance' as const, label: 'Attendance', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-semibold text-sky-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">{user.name}</h2>
                <p className="text-slate-500 text-sm mb-4">@{user.username}</p>
                
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  user.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Role Badge */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Role</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
              </div>

              {/* Info Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Full Name</div>
                      <div className="text-slate-900">{user.name}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Email Address</div>
                      <div className="text-slate-900">{user.email}</div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Username</div>
                      <div className="text-slate-900">{user.username}</div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Contact Number</div>
                      <div className="text-slate-900">{user.contact_no || 'Not provided'}</div>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Position</div>
                      <div className="text-slate-900">{user.position || 'Not assigned'}</div>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Member Since</div>
                      <div className="text-slate-900">{formatDate(user.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Schedule Overview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Work Schedule</h3>
              <button 
                onClick={() => router.push(`/admin/users/${params.id}/edit-schedule`)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium"
              >
                Edit Schedule
              </button>
            </div>

            {/* Weekly Schedule */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-xs font-medium text-slate-500 mb-2">{day}</div>
                  <div className={`p-3 rounded-lg border ${
                    index < 5 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="text-xs font-medium">
                      {index < 5 ? '9:00 - 18:00' : 'Off'}
                    </div>
                    {index < 5 && (
                      <div className="text-xs text-slate-500 mt-1">9 hours</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Schedule Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">Work Days</span>
                </div>
                <span className="text-sm text-slate-600">Monday - Friday</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">Working Hours</span>
                </div>
                <span className="text-sm text-slate-600">9:00 AM - 6:00 PM</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">Break Duration</span>
                </div>
                <span className="text-sm text-slate-600">1 hour</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">Time Zone</span>
                </div>
                <span className="text-sm text-slate-600">UTC+8 (Asia/Singapore)</span>
              </div>
            </div>
          </div>

          {/* Upcoming Shifts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Shifts</h3>
            <div className="space-y-3">
              {[
                { date: 'Today', time: '9:00 AM - 6:00 PM', status: 'active' },
                { date: 'Tomorrow', time: '9:00 AM - 6:00 PM', status: 'scheduled' },
                { date: 'Dec 28, 2024', time: '9:00 AM - 6:00 PM', status: 'scheduled' },
              ].map((shift, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{shift.date}</div>
                    <div className="text-xs text-slate-500">{shift.time}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    shift.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {shift.status === 'active' ? 'Active' : 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance</h3>
          <p className="text-slate-500">User attendance records and statistics will be displayed here.</p>
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">📊 Attendance tracking coming soon...</p>
          </div>
        </div>
      )}
    </>
  );
}
