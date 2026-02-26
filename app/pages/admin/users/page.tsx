"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Check, X, RefreshCw, Eye, EyeOff } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import UserTable from "@/app/components/admin/UserTable";
import Modal from "@/app/components/Modal";
import CustomSelect from "@/app/components/CustomSelect";
import { swal } from "@/app/components/Swal";

type User = {
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

export default function UserManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("user");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    contactNo: "",
    position: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
    contactNo: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
      email: "",
      contactNo: ""
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 5) {
      newErrors.username = "Username must be at least 5 characters";
    } else if (users.some(user => user.username.toLowerCase() === formData.username.toLowerCase())) {
      newErrors.username = "Username already exists";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (users.some(user => user.email.toLowerCase() === formData.email.toLowerCase())) {
      newErrors.email = "Email already exists";
    }

    // Contact Number validation
    if (formData.contactNo && formData.contactNo.trim()) {
      const digitsOnly = formData.contactNo.replace(/\D/g, '');
      if (digitsOnly.length !== 11) {
        newErrors.contactNo = "Contact number must be exactly 11 digits";
      } else {
        newErrors.contactNo = "";
      }
    } else {
      newErrors.contactNo = "";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password && !newErrors.email && !newErrors.contactNo;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show success notification
        await swal({
          title: "Success!",
          text: `User "${formData.name}" has been created successfully.`,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981"
        });
        
        // Reset form and close modal
        setFormData({
          username: "",
          password: "",
          name: "",
          email: "",
          contactNo: "",
          position: ""
        });
        setErrors({
          username: "",
          password: "",
          email: "",
          contactNo: ""
        });
        setRole("user");
        setIsModalOpen(false);
        // Refresh users list
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateUsername = () => {
    // Generate user_id format: user + 6-digit number
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const userIdNumber = (timestamp % 1000000) + randomSuffix;
    const username = `user${String(userIdNumber).padStart(6, '0')}`;
    
    setFormData(prev => ({ ...prev, username }));
    
    // Trigger validation
    handleInputChange('username', username);
  };

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    let password = '';
    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Add remaining characters
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData(prev => ({ ...prev, password }));
    
    // Trigger validation
    handleInputChange('password', password);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const newErrors = { ...errors };
    
    switch (field) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = "Username is required";
        } else if (value.trim().length < 5) {
          newErrors.username = "Username must be at least 5 characters";
        } else if (users.some(user => user.username.toLowerCase() === value.toLowerCase())) {
          newErrors.username = "Username already exists";
        } else {
          newErrors.username = "";
        }
        break;
        
      case 'password':
        if (!value.trim()) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else {
          newErrors.password = "";
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email format";
        } else if (users.some(user => user.email.toLowerCase() === value.toLowerCase())) {
          newErrors.email = "Email already exists";
        } else {
          newErrors.email = "";
        }
        break;
        
      case 'contactNo':
        if (value && value.trim()) {
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length !== 11) {
            newErrors.contactNo = "Contact number must be exactly 11 digits";
          } else {
            newErrors.contactNo = "";
          }
        } else {
          newErrors.contactNo = "";
        }
        break;
    }
    
    setErrors(newErrors);
  };

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage accounts and permissions"
        actions={
          <button
            onClick={() => {
              setIsModalOpen(true);
              // Clear form and errors when opening modal
              setFormData({
                username: "",
                password: "",
                name: "",
                email: "",
                contactNo: "",
                position: ""
              });
              setErrors({
                username: "",
                password: "",
                email: "",
                contactNo: ""
              });
              setRole("user");
            }}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 px-3 md:px-4 py-2 rounded-xl font-medium text-white text-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add User</span>
          </button>
        }
      />

      {/* Search bar */}
      <div className="flex items-center gap-3 bg-white mb-4 px-4 py-3 border border-slate-200 rounded-xl">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Loading users...</div>
        </div>
      ) : (
        <UserTable users={users.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )} />
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">
                  Username
                </label>
                <button
                  type="button"
                  onClick={generateUsername}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  title="Generate username"
                >
                  <RefreshCw className="w-3 h-3" />
                  Generate
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none transition ${
                    errors.username 
                      ? 'border-red-300 focus:border-red-500' 
                      : formData.username && !errors.username
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {formData.username && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {errors.username ? (
                      <X className="w-4 h-4 text-red-500" />
                    ) : (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  title="Generate password"
                >
                  <RefreshCw className="w-3 h-3" />
                  Generate
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className={`w-full px-3 py-2 pr-20 border rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none transition ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : formData.password && !errors.password
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {formData.password && (
                    <div className="flex items-center pr-2">
                      {errors.password ? (
                        <X className="w-4 h-4 text-red-500" />
                      ) : (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none transition ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : formData.email && !errors.email
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {formData.email && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {errors.email ? (
                      <X className="w-4 h-4 text-red-500" />
                    ) : (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Contact No */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter contact number"
                  value={formData.contactNo}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none transition ${
                    errors.contactNo 
                      ? 'border-red-300 focus:border-red-500' 
                      : formData.contactNo && !errors.contactNo
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {formData.contactNo && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {errors.contactNo ? (
                      <X className="w-4 h-4 text-red-500" />
                    ) : (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.contactNo && (
                <p className="mt-1 text-xs text-red-600">{errors.contactNo}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <CustomSelect
                options={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
                value={role}
                onChange={setRole}
              />
            </div>

            {/* Position */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Position
              </label>
              <input
                type="text"
                placeholder="Enter position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
