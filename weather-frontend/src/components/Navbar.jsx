"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Cloud, LogOut, ChevronDown, User } from "lucide-react";
import { logout } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

export default function Navbar({ user }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div>
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SkyBrain</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded-xl transition-all"
              >
                {/* Avatar circle with initials */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up z-50">
                  
                  {/* User info section */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">
                          {getInitials(user?.name)}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white font-semibold text-sm truncate">
                          {user?.name}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          try {
            setLoading(true);
            await logout();
            router.push("/login");
          } finally {
            setLoading(false);
            setShowLogoutModal(false);
          }
        }}
        loading={loading}
      />
    </div>
  );
}