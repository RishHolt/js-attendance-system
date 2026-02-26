import { MoreHorizontal, Filter, X, Calendar, Power, PowerOff, User } from "lucide-react";
import { useState, useRef } from "react";

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

type UserTableProps = {
  users: User[];
};

type FilterState = {
  role: "all" | "admin" | "user";
  status: "all" | "active" | "inactive";
  position: "all" | string;
  nameSort: "none" | "asc" | "desc";
  emailSort: "none" | "asc" | "desc";
};

// Helper components
function RoleBadge({ role }: { role: "admin" | "user" }) {
  const colors = {
    admin: "bg-purple-100 text-purple-700",
    user: "bg-blue-100 text-blue-700"
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

function StatusIndicator({ status }: { status: "active" | "inactive" }) {
  const colors = {
    active: "bg-emerald-500",
    inactive: "bg-slate-400"
  };
  
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`rounded-full w-2 h-2 ${colors[status]}`}></span>
      <span className="text-slate-600 text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </span>
  );
}

function UserAvatar({ username }: { username: string }) {
  return (
    <div className="inline-flex justify-center items-center bg-sky-50 border border-slate-100 rounded-xl w-10 h-10 text-sky-600 font-semibold text-sm">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

function UserInfo({ name, email }: { name: string; email: string }) {
  return (
    <div>
      <div className="font-medium text-slate-900">{name}</div>
      <div className="text-slate-500 text-sm">{email}</div>
    </div>
  );
}

function ActionButton({ user, onStatusChange, onViewProfile, onViewSchedule }: { 
  user: User; 
  onStatusChange: (userId: string, newStatus: "active" | "inactive") => void;
  onViewProfile: (user: User) => void;
  onViewSchedule: (user: User) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 192 // Adjust for dropdown width (192px)
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="hover:bg-slate-100 p-1.5 rounded-lg text-slate-400 transition"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      
      <>
          <div 
            className={`fixed inset-0 z-40 transition-opacity duration-150 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)}
          />
          <div 
            className={`fixed bg-white border border-slate-200 rounded-lg shadow-lg z-50 w-48 origin-top-right transition duration-150 ease-out ${
              isOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
            }`}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  onViewProfile(user);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4" />
                View Profile
              </button>
              
              <button
                onClick={() => {
                  onViewSchedule(user);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
              
              <button
                onClick={() => {
                  onStatusChange(user.id, user.status === "active" ? "inactive" : "active");
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                  user.status === "active" 
                    ? "text-slate-700" 
                    : "text-emerald-600"
                }`}
              >
                {user.status === "active" ? (
                  <>
                    <PowerOff className="w-4 h-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </>
    </div>
  );
}

function FilterDropdown({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
      >
        <Filter className="w-3 h-3" />
        <span>{label}</span>
        {value !== "all" && value !== "none" && (
          <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
        )}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[120px]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 transition-colors ${
                    value === option.value ? "bg-slate-100 text-sky-600 font-medium" : "text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ActiveFilters({ 
  filters, 
  onClearAll, 
  onClearFilter 
}: { 
  filters: FilterState;
  onClearAll: () => void;
  onClearFilter: (key: keyof FilterState) => void;
}) {
  const activeFilters = Object.entries(filters).filter(([key, value]) => value !== "all");
  
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">
      <span className="text-xs text-slate-500">Active filters:</span>
      <div className="flex items-center gap-1">
        {activeFilters.map(([key, value]) => (
          <button
            key={key}
            onClick={() => onClearFilter(key as keyof FilterState)}
            className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:border-slate-300 transition-colors"
          >
            <span>{key}: {value}</span>
            <X className="w-3 h-3" />
          </button>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

function getUniquePositions(users: User[]): { value: string; label: string }[] {
  const positions = new Set<string>();
  users.forEach(user => {
    if (user.position) {
      positions.add(user.position);
    }
  });
  
  return [
    { value: "all", label: "All Positions" },
    ...Array.from(positions).sort().map(position => ({
      value: position,
      label: position
    }))
  ];
}

function filterUsers(users: User[], filters: FilterState): User[] {
  let filtered = users.filter((user) => {
    const roleMatch = filters.role === "all" || user.role === filters.role;
    const statusMatch = filters.status === "all" || user.status === filters.status;
    const positionMatch = filters.position === "all" || user.position === filters.position;
    return roleMatch && statusMatch && positionMatch;
  });

  // Apply sorting
  if (filters.nameSort !== "none") {
    filtered = filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return filters.nameSort === "asc" ? comparison : -comparison;
    });
  }

  if (filters.emailSort !== "none") {
    filtered = filtered.sort((a, b) => {
      const comparison = a.email.localeCompare(b.email);
      return filters.emailSort === "asc" ? comparison : -comparison;
    });
  }

  return filtered;
}
export default function UserTable({ users }: UserTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    role: "all",
    status: "all",
    position: "all",
    nameSort: "none",
    emailSort: "none"
  });
  
  const filteredUsers = filterUsers(users, filters);
  
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };
  
  const clearFilter = (filterType: keyof FilterState) => {
    const defaultValue = filterType === "nameSort" || filterType === "emailSort" ? "none" : "all";
    setFilters(prev => ({ ...prev, [filterType]: defaultValue }));
  };
  
  const clearAllFilters = () => {
    setFilters({
      role: "all",
      status: "all",
      position: "all",
      nameSort: "none",
      emailSort: "none"
    });
  };

  const handleStatusChange = async (userId: string, newStatus: "active" | "inactive") => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh the users list
        window.location.reload();
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleViewProfile = (user: User) => {
    // Navigate to profile page
    window.location.href = `/admin/users/${user.id}`;
  };

  const handleViewSchedule = (user: User) => {
    // TODO: Navigate to schedule page or open schedule modal
    console.log('View schedule for:', user.name);
    alert(`Schedule view for ${user.name} - Feature coming soon!`);
  };

  const hasActiveFilters = filters.role !== "all" || filters.status !== "all" || filters.position !== "all" || filters.nameSort !== "none" || filters.emailSort !== "none";
  const showNoResultsMessage = filteredUsers.length === 0 && hasActiveFilters;
  const showNoDataMessage = users.length === 0;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-700 text-left">
                <FilterDropdown
                  label="User"
                  value={filters.nameSort}
                  options={[
                    { value: "none", label: "Default" },
                    { value: "asc", label: "A-Z" },
                    { value: "desc", label: "Z-A" }
                  ]}
                  onChange={(value) => handleFilterChange("nameSort", value)}
                />
              </th>
              <th className="px-4 py-3 font-medium text-slate-700 text-left">
                <FilterDropdown
                  label="Role"
                  value={filters.role}
                  options={[
                    { value: "all", label: "All Roles" },
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" }
                  ]}
                  onChange={(value) => handleFilterChange("role", value)}
                />
              </th>
              <th className="px-4 py-3 font-medium text-slate-700 text-left">Contact</th>
              <th className="px-4 py-3 font-medium text-slate-700 text-left">
                <FilterDropdown
                  label="Position"
                  value={filters.position}
                  options={getUniquePositions(users)}
                  onChange={(value) => handleFilterChange("position", value)}
                />
              </th>
              <th className="px-4 py-3 font-medium text-slate-700 text-left">
                <FilterDropdown
                  label="Status"
                  value={filters.status}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                  ]}
                  onChange={(value) => handleFilterChange("status", value)}
                />
              </th>
              <th className="px-4 py-3 font-medium text-slate-700 text-left">Created At</th>
              <th className="px-4 py-3 font-medium text-slate-700 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {showNoDataMessage ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="text-slate-500 text-sm">
                    No users found
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    Start by adding your first user
                  </div>
                </td>
              </tr>
            ) : showNoResultsMessage ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="text-slate-500 text-sm">
                    No users match the current filters
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 text-xs text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <UserInfo name={user.name} email={user.email} />
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {user.contact_no || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {user.position || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusIndicator status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <ActionButton 
                      user={user} 
                      onStatusChange={handleStatusChange}
                      onViewProfile={handleViewProfile}
                      onViewSchedule={handleViewSchedule}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Cards */}
      <div className="md:hidden">
        {/* Mobile Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Filters</span>
            {(filters.role !== "all" || filters.status !== "all") && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FilterDropdown
              label="User"
              value={filters.nameSort}
              options={[
                { value: "none", label: "Default" },
                { value: "asc", label: "A-Z" },
                { value: "desc", label: "Z-A" }
              ]}
              onChange={(value) => handleFilterChange("nameSort", value)}
            />
            <FilterDropdown
              label="Role"
              value={filters.role}
              options={[
                { value: "all", label: "All Roles" },
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" }
              ]}
              onChange={(value) => handleFilterChange("role", value)}
            />
            <FilterDropdown
              label="Position"
              value={filters.position}
              options={getUniquePositions(users)}
              onChange={(value) => handleFilterChange("position", value)}
            />
            <FilterDropdown
              label="Status"
              value={filters.status}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }
              ]}
              onChange={(value) => handleFilterChange("status", value)}
            />
          </div>
        </div>
        
        {/* Mobile User Cards */}
        <div className="flex flex-col gap-3">
          {showNoDataMessage ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="text-slate-500 text-sm">
                No users found
              </div>
              <div className="text-slate-400 text-xs mt-1">
                Start by adding your first user
              </div>
            </div>
          ) : showNoResultsMessage ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="text-slate-500 text-sm">
                No users match the current filters
              </div>
              <button
                onClick={clearAllFilters}
                className="mt-2 text-xs text-sky-600 hover:text-sky-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar username={user.username} />
                  <div className="flex-1">
                    <UserInfo name={user.name} email={user.email} />
                  </div>
                </div>
                <ActionButton 
                      user={user} 
                      onStatusChange={handleStatusChange}
                      onViewProfile={handleViewProfile}
                      onViewSchedule={handleViewSchedule}
                    />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
                <div>
                  <div className="text-slate-400 text-xs mb-1">Role</div>
                  <RoleBadge role={user.role} />
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Status</div>
                  <StatusIndicator status={user.status} />
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Contact</div>
                  <div className="text-slate-600 text-xs">{user.contact_no || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Position</div>
                  <div className="text-slate-600 text-xs">{user.position || 'N/A'}</div>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-slate-100">
                <div className="text-slate-400 text-xs">Created {formatDate(user.created_at)}</div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </>
  );
}
