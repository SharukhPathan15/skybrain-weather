'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import { Cloud, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

const passwordRules = [
  { label: 'At least 6 characters',      test: (p) => p.length >= 6 },
  { label: 'One uppercase letter (A-Z)',  test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)',  test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0-9)',            test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password) {
  const passed = passwordRules.filter(r => r.test(password)).length;
  if (passed <= 1) return { label: 'Weak',   color: 'bg-red-500',    width: 'w-1/5' };
  if (passed <= 2) return { label: 'Fair',   color: 'bg-orange-500', width: 'w-2/5' };
  if (passed <= 3) return { label: 'Good',   color: 'bg-yellow-500', width: 'w-3/5' };
  if (passed <= 4) return { label: 'Strong', color: 'bg-blue-500',   width: 'w-4/5' };
  return           { label: 'Excellent', color: 'bg-green-500',  width: 'w-full' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const allRulesPassed = passwordRules.every(r => r.test(form.password));
  const strength = form.password.length > 0 ? getStrength(form.password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client side check before hitting the server
    if (!allRulesPassed) {
      return setError('Please meet all password requirements before continuing.');
    }

    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 flex items-center justify-center p-4">
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SkyBrain</span>
          </div>
          <p className="text-gray-400">Create your personal weather dashboard.</p>
        </div>

        <div className="glass p-8">
          <h1 className="text-xl font-bold text-white mb-6">Create Account</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="Sharukh"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                className="input"
                placeholder="abc@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar — shows as soon as user starts typing */}
              {strength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Password strength</span>
                    <span className={`text-xs font-medium ${
                      strength.label === 'Weak'      ? 'text-red-400' :
                      strength.label === 'Fair'      ? 'text-orange-400' :
                      strength.label === 'Good'      ? 'text-yellow-400' :
                      strength.label === 'Strong'    ? 'text-blue-400' :
                      'text-green-400'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                </div>
              )}

              {/* Requirements checklist — shows on focus or if any rule fails after typing */}
              {(passwordFocused || (form.password.length > 0 && !allRulesPassed)) && (
                <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(form.password);
                    return (
                      <div key={rule.label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          passed ? 'bg-green-500/20' : 'bg-white/10'
                        }`}>
                          {passed
                            ? <Check className="w-2.5 h-2.5 text-green-400" />
                            : <X className="w-2.5 h-2.5 text-gray-500" />
                          }
                        </div>
                        <span className={`text-xs transition-colors ${
                          passed ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !allRulesPassed}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}