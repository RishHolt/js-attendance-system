"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User, Mail, Calendar, Shield, Phone, Briefcase, Clock, CalendarDays, Users } from "lucide-react";
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
        title="User Profile" 
        subtitle="View and manage user information" 
        actions={
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
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

                  {/* Status */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Account Status</div>
                      <div className="text-slate-900">{user.status === 'active' ? 'Active' : 'Inactive'}</div>
                    </div>
                  </div>
                </div>

                {/* Join Date */}
                <div className="mt-6 pt-6 border-t border-slate-100">
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
        <div className="text-center py-12">
          <CalendarDays className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Schedule</h3>
          <p className="text-slate-500">User schedule and work hours will be displayed here.</p>
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">📅 Schedule management coming soon...</p>
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
